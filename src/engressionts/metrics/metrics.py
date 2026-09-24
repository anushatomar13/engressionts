import torch
import numpy as np


# Utility functions
def _sync_tensors(*args):
    """Converts inputs to PyTorch tensors and synchronizes them to the same device.

    Uses the device of the first tensor found.
    """
    tensors = [
        torch.as_tensor(x) if not isinstance(x, torch.Tensor) else x
        for x in args
    ]

    if not tensors:
        return []

    device = tensors[0].device
    return [t.to(device, dtype=torch.float32) for t in tensors]


def _get_point_forecast(y_pred, point_method):
    """Collapses the sample dimension (dim=-1) to generate a point forecast."""
    if point_method == "mean":
        return torch.mean(y_pred, dim=-1)

    elif point_method == "median":
        return torch.median(y_pred, dim=-1).values

    elif isinstance(point_method, float) and 0.0 <= point_method <= 1.0:
        return torch.quantile(y_pred, point_method, dim=-1)

    else:
        raise ValueError(
            "point_method must be 'mean', 'median', "
            "or a float between 0.0 and 1.0"
        )


def _aggregate(tensor, method):
    """Aggregates the tensor over the remaining dimensions."""
    if method is None or method == "none":
        return tensor

    elif method == "mean":
        return torch.mean(tensor)

    elif method == "median":
        return torch.median(tensor)

    elif method == "sum":
        return torch.sum(tensor)

    elif method == "norm":
        return torch.norm(tensor)

    else:
        raise ValueError(f"Unsupported aggregate_method: {method}")


def _format_return(tensor):
    return tensor.item() if tensor.numel() == 1 else tensor


# Point metrics
def mae(y_true, y_pred, point_method="mean", aggregate_method="mean"):
    """Mean Absolute Error (MAE).

    .. math::
        \\text{MAE} = \\frac{1}{N} \\sum_{i=1}^{N} |y_i - \\hat{y}_i|
    """
    y_true, y_pred = _sync_tensors(y_true, y_pred)
    y_point = _get_point_forecast(y_pred, point_method)

    error = torch.abs(y_true - y_point)

    return _format_return(_aggregate(error, aggregate_method))


def mse(y_true, y_pred, point_method="mean", aggregate_method="mean"):
    """Mean Squared Error (MSE).

    .. math::
        \\text{MSE} = \\frac{1}{N} \\sum_{i=1}^{N} (y_i - \\hat{y}_i)^2
    """
    y_true, y_pred = _sync_tensors(y_true, y_pred)
    y_point = _get_point_forecast(y_pred, point_method)

    error = (y_true - y_point) ** 2

    return _format_return(_aggregate(error, aggregate_method))


def rmse(y_true, y_pred, point_method="mean", aggregate_method="mean"):
    """Root Mean Squared Error (RMSE).

    .. math::
        \\text{RMSE} =
        \\sqrt{
            \\frac{1}{N}
            \\sum_{i=1}^{N}
            (y_i - \\hat{y}_i)^2
        }
    """
    y_true, y_pred = _sync_tensors(y_true, y_pred)
    y_point = _get_point_forecast(y_pred, point_method)

    # Calculate squared error
    squared_error = (y_true - y_point) ** 2

    # Aggregate (e.g., take the mean) FIRST
    agg_error = _aggregate(squared_error, aggregate_method)

    # Take the square root of the aggregated value
    return _format_return(torch.sqrt(agg_error))


def mape(
    y_true,
    y_pred,
    point_method="mean",
    aggregate_method="mean",
    eps=1e-8,
):
    """Mean Absolute Percentage Error (MAPE).

    .. math::
        \\text{MAPE} =
        \\frac{100}{N}
        \\sum_{i=1}^{N}
        \\left|
        \\frac{y_i - \\hat{y}_i}{\\max(|y_i|, \\epsilon)}
        \\right|
    """
    y_true, y_pred = _sync_tensors(y_true, y_pred)
    y_point = _get_point_forecast(y_pred, point_method)

    error = torch.abs(
        (y_true - y_point) / torch.clamp(torch.abs(y_true), min=eps)
    )

    return _format_return(_aggregate(error * 100, aggregate_method))


def smape(
    y_true,
    y_pred,
    point_method="mean",
    aggregate_method="mean",
    eps=1e-8,
):
    """Symmetric Mean Absolute Percentage Error (sMAPE).

    .. math::
        \\text{sMAPE} =
        \\frac{100}{N}
        \\sum_{i=1}^{N}
        \\frac{|y_i - \\hat{y}_i|}
        {\\max((|y_i| + |\\hat{y}_i|) / 2, \\epsilon)}
    """
    y_true, y_pred = _sync_tensors(y_true, y_pred)
    y_point = _get_point_forecast(y_pred, point_method)

    num = torch.abs(y_point - y_true)

    denom = torch.clamp((torch.abs(y_true) + torch.abs(y_point)) / 2, min=eps)

    return _format_return(_aggregate((num / denom) * 100, aggregate_method))


def smdape(
    y_true,
    y_pred,
    point_method="mean",
    aggregate_method="mean",
    eps=1e-8,
):
    """Symmetric Median Absolute Percentage Error (sMdAPE).

    .. math::
        \\text{sMdAPE} =
        \\text{median}
        \\left(
        100 \\times
        \\frac{|y_i - \\hat{y}_i|}
        {\\max((|y_i| + |\\hat{y}_i|) / 2, \\epsilon)}
        \\right)
    """
    y_true, y_pred = _sync_tensors(y_true, y_pred)
    y_point = _get_point_forecast(y_pred, point_method)

    num = torch.abs(y_point - y_true)

    denom = torch.clamp((torch.abs(y_true) + torch.abs(y_point)) / 2, min=eps)

    error = (num / denom) * 100

    return _format_return(
        _aggregate(error, "median" if aggregate_method != "none" else "none")
    )


def mpe(
    y_true,
    y_pred,
    point_method="mean",
    aggregate_method="mean",
    eps=1e-8,
):
    """Mean Percentage Error (MPE).

    .. math::
        \\text{MPE} =
        \\frac{100}{N}
        \\sum_{i=1}^{N}
        \\frac{y_i - \\hat{y}_i}
        {\\max(y_i, \\epsilon)}
    """
    y_true, y_pred = _sync_tensors(y_true, y_pred)
    y_point = _get_point_forecast(y_pred, point_method)

    error = (y_true - y_point) / torch.clamp(y_true, min=eps)

    return _format_return(_aggregate(error * 100, aggregate_method))


def opl(y_true, y_pred, point_method="mean", aggregate_method="mean"):
    """Optimized Point Loss (OPL).

    Measures if the model correctly predicted the direction of change compared
    to the last observation.

    .. math::
        \\text{OPL} =
        \\frac{1}{2N}
        \\sum_{t=1}^{N}
        |
        \\text{sgn}(y_{t+1} - y_t)
        -
        \\text{sgn}(\\hat{y}_{t+1} - y_t)
        |
    """
    y_true, y_pred = _sync_tensors(y_true, y_pred)
    y_point = _get_point_forecast(y_pred, point_method)

    diff_true = torch.sign(y_true[1:] - y_true[:-1])

    diff_pred = torch.sign(y_point[1:] - y_true[:-1])

    error = torch.abs(diff_true - diff_pred) / 2

    return _format_return(_aggregate(error, aggregate_method))


def mase(
    y_true,
    y_pred,
    y_train,
    point_method="mean",
    aggregate_method="mean",
    eps=1e-8,
):
    """Mean Absolute Scaled Error (MASE).

    .. math::
        \\text{MASE} =
        \\frac{
            \\frac{1}{H}
            \\sum_{t=1}^{H}
            |y_t - \\hat{y}_t|
        }{
            \\max(
                \\frac{1}{T-1}
                \\sum_{t=2}^{T}
                |y_t - y_{t-1}|,
                \\epsilon
            )
        }
    """
    y_true, y_pred, y_train = _sync_tensors(y_true, y_pred, y_train)

    y_point = _get_point_forecast(y_pred, point_method)

    # 1. Numerator: MAE of forecast
    abs_err_forecast = torch.abs(y_true - y_point)

    mae_forecast = torch.nanmean(abs_err_forecast, dim=0)

    # 2. Denominator: MAE of naive in-sample forecast
    diff = torch.abs(y_train[1:] - y_train[:-1])

    scale = torch.nanmean(diff, dim=0)

    # 3. Guard against exact zeros or all-NaN series
    scale = torch.clamp(scale, min=eps)

    scale = torch.nan_to_num(scale, nan=eps)

    # 4. Calculate final metric and scrub any resulting NaNs
    mase_per_series = mae_forecast / scale

    mase_per_series = torch.nan_to_num(mase_per_series, nan=0.0)

    return _format_return(_aggregate(mase_per_series, aggregate_method))


def rmsse(
    y_true,
    y_pred,
    y_train,
    point_method="mean",
    aggregate_method="mean",
    eps=1e-8,
):
    """Root Mean Squared Scaled Error (RMSSE).

    .. math::
        \\text{RMSSE} =
        \\sqrt{
            \\frac{
                \\frac{1}{H}
                \\sum_{t=1}^{H}
                (y_t - \\hat{y}_t)^2
            }{
                \\max(
                    \\frac{1}{T-1}
                    \\sum_{t=2}^{T}
                    (y_t - y_{t-1})^2,
                    \\epsilon
                )
            }
        }
    """
    y_true, y_pred, y_train = _sync_tensors(y_true, y_pred, y_train)

    y_point = _get_point_forecast(y_pred, point_method)

    # 1. Numerator: MSE of forecast (average over time, dim=0)
    sq_err_forecast = (y_true - y_point) ** 2

    mse_forecast = torch.nanmean(sq_err_forecast, dim=0)

    # 2. Denominator: MSE of naive in-sample forecast
    # (average over time, dim=0)
    diff = (y_train[1:] - y_train[:-1]) ** 2

    scale = torch.nanmean(diff, dim=0)

    # 3. Guard against exact zeros or all-NaN series
    scale = torch.clamp(scale, min=eps)

    scale = torch.nan_to_num(scale, nan=eps)

    # 4. Calculate final metric and scrub any resulting NaNs
    rmsse_per_series = torch.sqrt(mse_forecast / scale)

    rmsse_per_series = torch.nan_to_num(rmsse_per_series, nan=0.0)

    return _format_return(_aggregate(rmsse_per_series, aggregate_method))


def owa(
    y_true,
    y_pred,
    y_train,
    y_naive_pred=None,
    point_method="mean",
    aggregate_method="mean",
    eps=1e-8,
):
    """Overall Weighted Average (OWA).

    .. math::
        \\text{OWA} =
        \\frac{1}{2}
        \\left(
            \\frac{\\text{sMAPE}}
            {\\max(\\text{sMAPE}_{naive}, \\epsilon)}
            +
            \\frac{\\text{MASE}}
            {\\max(\\text{MASE}_{naive}, \\epsilon)}
        \\right)
    """
    y_true, y_pred, y_train = _sync_tensors(y_true, y_pred, y_train)

    if y_naive_pred is None:
        # Utilize the first point of y_pred across the time dimension
        # (dim=0) and repeat it across to form a naive prediction
        # of identical shape
        y_naive_pred = y_pred[0:1, ...].expand_as(y_pred)

    else:
        y_naive_pred = _sync_tensors(y_naive_pred)[0]

    smape_val = smape(y_true, y_pred, point_method, "none", eps)

    smape_naive = smape(y_true, y_naive_pred, point_method, "none", eps)

    mase_val = mase(y_true, y_pred, y_train, point_method, "none", eps)

    mase_naive = mase(
        y_true, y_naive_pred, y_train, point_method, "none", eps
    )

    owa_val = 0.5 * (smape_val / torch.clamp(smape_naive, min=eps)) + 0.5 * (
        mase_val / torch.clamp(mase_naive, min=eps)
    )

    return _format_return(_aggregate(owa_val, aggregate_method))


# Probabilistic metrics
def pinball_loss(y_true, y_pred, quantile, aggregate_method="mean"):
    """Pinball Loss (Quantile Loss).

    .. math::
        L_q(y, \\hat{y}) =
        \\max(
            q(y - \\hat{y}),
            (q - 1)(y - \\hat{y})
        )
    """
    y_true, y_pred = _sync_tensors(y_true, y_pred)

    y_pred_q = _get_point_forecast(y_pred, point_method=quantile)

    error = y_true - y_pred_q

    loss = torch.max(quantile * error, (quantile - 1) * error)

    return _format_return(_aggregate(loss, aggregate_method))


def crps(y_true, y_pred, aggregate_method="mean"):
    """Continuous Ranked Probability Score (CRPS).

    Empirical Approximation.

    .. math::
        \\text{CRPS} =
        \\frac{1}{S}
        \\sum_{s=1}^{S}
        |y - \\hat{y}_s|
        -
        \\frac{1}{2S^2}
        \\sum_{s_1=1}^{S}
        \\sum_{s_2=1}^{S}
        |\\hat{y}_{s_1} - \\hat{y}_{s_2}|
    """
    y_true, y_pred = _sync_tensors(y_true, y_pred)

    y_true_ext = y_true.unsqueeze(-1)

    abs_diff_true = torch.mean(torch.abs(y_pred - y_true_ext), dim=-1)

    y_pred_i = y_pred.unsqueeze(-1)
    y_pred_j = y_pred.unsqueeze(-2)

    abs_diff_samples = torch.mean(
        torch.abs(y_pred_i - y_pred_j), dim=(-1, -2)
    )

    crps_val = abs_diff_true - 0.5 * abs_diff_samples

    return _format_return(_aggregate(crps_val, aggregate_method))


def empirical_coverage(y_true, y_pred, alpha=0.1, aggregate_method="mean"):
    """Empirical Coverage (Prediction Interval Coverage Probability - PICP).

    .. math::
        \\text{PICP} =
        \\frac{1}{N}
        \\sum_{i=1}^{N}
        \\mathbf{1}(L_i \\leq y_i \\leq U_i)
    """
    y_true, y_pred = _sync_tensors(y_true, y_pred)

    lower = torch.quantile(y_pred, alpha / 2, dim=-1)

    upper = torch.quantile(y_pred, 1 - (alpha / 2), dim=-1)

    inside = ((y_true >= lower) & (y_true <= upper)).float()

    return _format_return(_aggregate(inside, aggregate_method))


def winkler_score(y_true, y_pred, alpha=0.1, aggregate_method="mean"):
    """Winkler Score (Mean Interval Score - MIS).

    .. math::
        \\text{MIS} =
        (U_i - L_i)
        +
        \\frac{2}{\\alpha}
        (L_i - y_i)
        \\mathbf{1}(y_i < L_i)
        +
        \\frac{2}{\\alpha}
        (y_i - U_i)
        \\mathbf{1}(y_i > U_i)
    """
    y_true, y_pred = _sync_tensors(y_true, y_pred)

    lower = torch.quantile(y_pred, alpha / 2, dim=-1)

    upper = torch.quantile(y_pred, 1 - (alpha / 2), dim=-1)

    widths = upper - lower

    below = (y_true < lower).float()

    above = (y_true > upper).float()

    penalty_below = (2 / alpha) * (lower - y_true) * below

    penalty_above = (2 / alpha) * (y_true - upper) * above

    scores = widths + penalty_below + penalty_above

    return _format_return(_aggregate(scores, aggregate_method))


def mpiw(y_pred, alpha=0.1, aggregate_method="mean"):
    """Mean Prediction Interval Width (MPIW).

    .. math::
        \\text{MPIW} =
        \\frac{1}{N}
        \\sum_{i=1}^{N}
        (U_i - L_i)
    """
    y_pred = _sync_tensors(y_pred)[0]

    lower = torch.quantile(y_pred, alpha / 2, dim=-1)

    upper = torch.quantile(y_pred, 1 - (alpha / 2), dim=-1)

    widths = upper - lower

    return _format_return(_aggregate(widths, aggregate_method))


def rho_risk(
    y_true,
    y_pred,
    quantiles=[0.1, 0.5, 0.9],
    aggregate_method="mean",
    eps=1e-8,
):
    """Rho-Risk (Normalized Quantile Loss).

    .. math::
        \\rho\\text{-risk} =
        \\frac{
            2 \\sum_i L_q(y_i, \\hat{y}_i)
        }{
            \\max(
                \\sum_i |y_i|,
                \\epsilon
            )
        }
    """
    y_true, y_pred = _sync_tensors(y_true, y_pred)

    total_true = torch.clamp(torch.sum(torch.abs(y_true)), min=eps)

    rho_risks = []

    for q in quantiles:
        p_loss_q = pinball_loss(
            y_true, y_pred, q, aggregate_method="sum"
        )

        rho_risks.append(2 * p_loss_q / total_true)

    avg_rho_risk = sum(rho_risks) / len(rho_risks)

    return _format_return(_aggregate(avg_rho_risk, aggregate_method))
