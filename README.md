# EngressionTS

A probabilistic time-series forecasting package combining the vast architecture library of [Darts](https://unit8co.github.io/darts/) with the highly calibrated **Engression** training paradigm.

<img width="1208" height="293" alt="EngTS" src="https://github.com/user-attachments/assets/6114ef1e-9332-4352-9a42-5a4e787ec8ef" />

### Why EngressionTS?

- **Probabilistic Forecasting:** EngressionTS adds noise to deep learning models such as TiDE, TSMixer, N-HiTS, and RNNs during training. This allows them to generate multiple possible future trajectories instead of producing just one fixed prediction.

- **Energy Score Optimization:** Instead of relying only on MSE, EngressionTS uses Energy Score optimization to train probabilistic forecasts, helping improve the quality and calibration of the predicted distributions.

- **Easy Integration:** Built on top of `darts`, EngressionTS follows the same familiar API and works with existing datasets and forecasting pipelines. This makes it easy to add probabilistic forecasting to your workflow without changing the entire pipeline.

## Installation

You can install `engressionts` directly from GitHub using `pip`:

```bash
pip install git+https://github.com/anushatomar13/engressionts.git
```



## Usage

`engressionts` models are built directly on top of `darts` and share the same API. You can initialize any Engression model by passing both standard Darts architecture parameters and Engression-specific parameters (like `noise_type` and `num_samples_train`).

### 1. Import and Initialize
```python
from engressionts.models.darts import EnTiDEModel

# Initialize an Engression Model 
model = EnTiDEModel(
    input_chunk_length=24, 
    output_chunk_length=24,
    # Engression-specific parameters:
    num_samples_train=10,          
    noise_type="uniform",   
    noise_std=1.0            
)
```

### 2. Train the Model
```python
# Train the model using the Energy Score loss
model.fit(train_series, past_covariates=past_covariates)
```

### 3. Generate Probabilistic Forecasts
```python
# Generate stochastic trajectories by setting num_samples > 1
pred = model.predict(n=24, num_samples=100)
```

## Detailed Tutorial

For a comprehensive, end-to-end tutorial on configuring and evaluating `engressionts` models (including data preprocessing, deterministic seeding, and advanced probabilistic metrics), please check out the example notebook provided in the repository: [EngressionTS Solar Example](./examples/EngressionTS_Solar_Example.ipynb)
