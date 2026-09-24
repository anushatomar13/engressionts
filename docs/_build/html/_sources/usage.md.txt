# Usage Example

This section demonstrates how to train an Engression-enhanced forecasting model on multivariate or univariate time-series data and extract distributional quantile predictions.

---

## Probabilistic Forecasting with EnTFTModel

```python
import numpy as np
import pandas as pd
from darts import TimeSeries
from engressionts.models import EnTFTModel

# 1. Create synthetic time-series data
dates = pd.date_range(start="2024-01-01", periods=200, freq="D")
values = np.sin(np.linspace(0, 20, 200)) + np.random.normal(0, 0.1, 200)
series = TimeSeries.from_times_and_values(dates, values)

# Split into train and test sets
train, test = series[:-30], series[-30:]

# 2. Instantiate EnTFTModel (Engression Temporal Fusion Transformer)
model = EnTFTModel(
    input_chunk_length=30,
    output_chunk_length=14,
    hidden_size=64,
    lstm_layers=1,
    num_attention_heads=4,
    dropout=0.1,
    noise_std=0.5,
    noise_type="gaussian",
    num_samples=50,
    n_epochs=20,
    random_state=42,
)

# 3. Fit the model
model.fit(train)

# 4. Predict probabilistic samples (returns a TimeSeries with multiple sample paths)
pred_samples = model.predict(n=14, num_samples=200)

# 5. Extract quantiles
median_pred = pred_samples.quantile(0.5)
lower_bound = pred_samples.quantile(0.05)
upper_bound = pred_samples.quantile(0.95)

print("Median forecast head:")
print(median_pred.head())
```

---

## Evaluating Forecasts with Energy Score

`engressionts` includes an optimized Energy Score loss for evaluating sample-based probabilistic predictions:

```python
import torch
from engressionts.losses import energy_score_loss

# Shape: (M_samples, Batch, Length, Dim)
samples = torch.randn(50, 8, 14, 1)
target = torch.randn(8, 14, 1)

score = energy_score_loss(samples, target)
print(f"Energy Score Loss: {score.item():.4f}")
```
