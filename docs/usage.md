# Usage Example

This guide walks through end-to-end multivariate time-series forecasting using `EnHiTSModel` (Engression-enhanced High-resolution Time Series Forecasting) on the Solar (`solar_nips`) dataset from `examples/engts-example-usage-solar.ipynb`.

---

## 1. Load Solar Dataset & Format TimeSeries

```python
import numpy as np
import pandas as pd
from darts import TimeSeries
from gluonts.dataset.repository.datasets import get_dataset
from gluonts.dataset.multivariate_grouper import MultivariateGrouper

# 1. Load GluonTS solar_nips dataset
ds = get_dataset("solar_nips", regenerate=False)
freq = ds.metadata.freq

# 2. Group into multivariate series
target_dim = int(ds.metadata.feat_static_cat[0].cardinality)
train_grouper = MultivariateGrouper(max_target_dim=target_dim)
train_mv_items = list(train_grouper(list(ds.train)))

# 3. Convert to Darts TimeSeries
def gluonts_item_to_darts_mv(item, freq: str) -> TimeSeries:
    start = item["start"].to_timestamp() if hasattr(item["start"], "to_timestamp") else pd.Timestamp(item["start"])
    target = np.asarray(item["target"]).T
    times = pd.date_range(start=start, periods=target.shape[0], freq=freq)
    cols = [f"dim_{i}" for i in range(target.shape[1])]
    return TimeSeries.from_times_and_values(times, target, columns=cols)

train_ts = gluonts_item_to_darts_mv(train_mv_items[0], freq)
PRED_LEN = 24
```

---

## 2. Scale Target & Construct Past Covariates

```python
from darts import concatenate
from darts.dataprocessing.transformers import Scaler

# 1. Scale target series
y_scaler = Scaler()
train_y_sc = y_scaler.fit_transform(train_ts)

# 2. Build 552-dim past covariates
def lag_covs_from_scaled_target(ts_sc: TimeSeries, lags=(1, 24, 168)) -> TimeSeries:
    shifted = [
        ts_sc.shift(L).with_columns_renamed(
            ts_sc.components, [f"{c}_lag{L}" for c in ts_sc.components]
        )
        for L in lags
    ]
    common = shifted[0]
    for s in shifted[1:]:
        common = common.slice_intersect(s)
    return concatenate([s.slice_intersect(common) for s in shifted], axis=1)

def fourier_from_index(idx) -> TimeSeries:
    hour, dow = idx.hour.to_numpy(), idx.dayofweek.to_numpy()
    X = np.vstack([
        np.sin(2 * np.pi * hour / 24.0), np.cos(2 * np.pi * hour / 24.0),
        np.sin(2 * np.pi * dow / 7.0), np.cos(2 * np.pi * dow / 7.0),
    ]).T
    return TimeSeries.from_times_and_values(idx, X, columns=["h_sin", "h_cos", "dow_sin", "dow_cos"])

def dim_indicator_norm(idx, D: int) -> TimeSeries:
    v = (np.arange(D, dtype=np.float32) / (D - 1)).astype(np.float32)
    return TimeSeries.from_times_and_values(idx, np.tile(v, (len(idx), 1)), columns=[f"dim_id_{i}" for i in range(D)])

def build_past_covs_552(ts_sc: TimeSeries, lags=(1, 24, 168)) -> TimeSeries:
    lag_covs = lag_covs_from_scaled_target(ts_sc, lags)
    idx = lag_covs.time_index
    return concatenate([lag_covs, dim_indicator_norm(idx, ts_sc.width), fourier_from_index(idx)], axis=1)

train_pc = build_past_covs_552(train_y_sc, lags=(1, 24, 168))
train_y_sc = train_y_sc.slice_intersect(train_pc)
train_pc = train_pc.slice_intersect(train_y_sc).astype(np.float32)
```

---

## 3. Instantiate & Fit EnHiTSModel

```python
from engressionts.models import EnHiTSModel

# Instantiate EnHiTSModel
model = EnHiTSModel(
    input_chunk_length=24,
    output_chunk_length=PRED_LEN,
    num_samples_train=2,
    noise_std=1.0,
    noise_type="uniform",
    optimizer_kwargs={"lr": 1e-3},
    batch_size=512,
    n_epochs=30,
    random_state=42,
)

# Fit the model
model.fit(series=train_y_sc, past_covariates=train_pc)
```

---

## 4. Predict Probabilistic Samples & Extract Quantiles

```python
# Predict 100 sample trajectories over 24h horizon
pred_scaled = model.predict(
    n=PRED_LEN,
    series=train_y_sc,
    past_covariates=train_pc,
    num_samples=100,
    random_state=42,
)

# Inverse transform prediction samples to original scale
pred_samples = y_scaler.inverse_transform(pred_scaled)

# Extract median forecast and 10% - 90% quantile bounds
median_forecast = pred_samples.quantile(0.5)
lower_bound = pred_samples.quantile(0.10)
upper_bound = pred_samples.quantile(0.90)

print("Median forecast head:")
print(median_forecast.head())
```

