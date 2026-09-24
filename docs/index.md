# Welcome to engressionts's documentation!

**engressionts** is a specialized Python package designed for deep distributional time-series forecasting. It integrates state-of-the-art time-series models from **Darts** with **Engression** (Energy-based regression), offering a unified framework for probabilistic forecasting with model-intrinsic uncertainty quantification.

### Key Highlights
- **Probabilistic Forecasting**: Calibrated uncertainty quantification using Energy Score loss and target noise injection.
- **11 Deep Neural Architectures**: Built-in support for N-BEATS, N-HiTS, TFT, TiDE, Transformers, TSMixer, DLinear, NLinear, TCN, RNN, and BlockRNN.
- **Flexible Noise Distributions**: Target noise modeling using Gaussian, Uniform, and custom distributions.
- **PyTorch Lightning Core**: Multi-GPU/CPU training, scalable DataLoaders, and automated logging.

---

## Getting Started

To install the latest release, simply run the following command in your terminal:

```bash
pip install engressionts
```

### Quick Example

```python
from darts.datasets import AirPassengersDataset
from engressionts.models import EnBEATSModel

# Load time-series data
series = AirPassengersDataset().load()
train, val = series[:-36], series[-36:]

# Initialize an Engression-enhanced N-BEATS forecasting model
model = EnBEATSModel(
    input_chunk_length=24,
    output_chunk_length=12,
    noise_std=1.0,
    noise_type="gaussian",
    num_samples=20,
    n_epochs=50,
)

# Fit and predict probabilistic samples
model.fit(train)
forecast = model.predict(n=36, num_samples=100)
```

---

## Explore the Documentation

```{toctree}
:maxdepth: 2
:caption: Table of Contents

installation
usage
api/index
citation
```
