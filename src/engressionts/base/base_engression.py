import math
from typing import Optional, List, Dict, Union
import numpy as np
import torch
import torch.nn as nn
from darts.models.forecasting.pl_forecasting_module import PLForecastingModule

from engressionts.losses.energy_score import energy_score_loss
from engressionts.noise import NOISE_REGISTRY


class EngressionPLModule(PLForecastingModule):
    def __init__(
        self,
        noise_std: float = 1.0,
        noise_type: str = "gaussian",
        num_samples_train: int = 20,
        num_samples: Optional[int] = None,
        clip_preds: bool = False,
        **kwargs,
    ):
        super().__init__(**kwargs)
        if num_samples is not None:
            num_samples_train = num_samples

        self.noise_std = noise_std
        self.noise_type = noise_type
        self.num_samples_train = num_samples_train
        self.clip_preds = clip_preds

        self.noise_layer = self._build_noise_layer()

    def _build_noise_layer(self):
        try:
            noise_cls = NOISE_REGISTRY[self.noise_type]
        except KeyError as exc:
            raise ValueError(f"Unknown Engression noise type: {self.noise_type}") from exc

        return noise_cls(std=self.noise_std)

    def _repeat_tensor(self, tensor):
        return (
            tensor.repeat_interleave(self.num_samples_train, dim=0)
            if tensor is not None
            else None
        )

    def training_step(self, batch, batch_idx):
        """Train on ``M`` noise-perturbed forecasts using the Energy Score."""
        (
            past_target,
            past_covariates,
            historic_future_covariates,
            future_covariates,
            static_covariates,
            _,
            future_target,
        ) = batch

        batch_size = future_target.shape[0]

        y_hat = self._produce_train_output(
            (
                self._repeat_tensor(past_target),
                self._repeat_tensor(past_covariates),
                self._repeat_tensor(historic_future_covariates),
                self._repeat_tensor(future_covariates),
                self._repeat_tensor(static_covariates),
                self._repeat_tensor(future_target) # <-- Rajdeep testing
            )
        )

        if y_hat.shape[-1] != 1:
            raise ValueError(
                "Engression models currently require `likelihood=None`, because the "
                "Energy Score is computed from forecast samples."
            )

        y_hat = y_hat.squeeze(-1)
        samples = y_hat.view(
            batch_size,
            self.num_samples_train,
            y_hat.shape[1],
            y_hat.shape[2],
        ).permute(1, 0, 2, 3)

        loss = energy_score_loss(samples, future_target)
        self.log(
            "energy_score_train_loss",
            loss,
            batch_size=batch_size,
            prog_bar=True,
            on_epoch=True,
            sync_dist=True,
        )
        return loss

    def predict_step(self, batch, batch_idx, dataloader_idx=None):
        """Enable input noise while Darts generates prediction samples."""
        noise_layer_was_training = self.noise_layer.training
        self.noise_layer.train()
        try:
            y_hat = super().predict_step(batch, batch_idx, dataloader_idx)
            if getattr(self, "clip_preds", False):
                y_hat = torch.clamp(y_hat, min=0.0)
            return y_hat
        finally:
            self.noise_layer.train(noise_layer_was_training)

    def on_predict_start(self) -> None:
        super().on_predict_start()
        if hasattr(self, "noise_layer") and self.noise_layer is not None:
            seed = torch.initial_seed()
            self.noise_layer.reset_seed(seed)


try:
    from darts.models.forecasting.torch_forecasting_model import TorchForecastingModel

    if not hasattr(TorchForecastingModel, "_orig_predict_engression"):
        TorchForecastingModel._orig_predict_engression = TorchForecastingModel.predict

        def custom_predict(self, *args, clip_preds: bool = False, **kwargs):
            # Intercept clip_preds at the prediction API level
            forecasts = self._orig_predict_engression(*args, **kwargs)
            if clip_preds:
                if isinstance(forecasts, list) or isinstance(forecasts, tuple):
                    return type(forecasts)(
                        [f.with_values(np.clip(f.all_values(), a_min=0, a_max=None)) for f in forecasts]
                    )
                else:
                    return forecasts.with_values(np.clip(forecasts.all_values(), a_min=0, a_max=None))
            return forecasts

        TorchForecastingModel.predict = custom_predict

except ImportError:
    pass


