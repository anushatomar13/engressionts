# EngressionTS

A probabilistic time-series forecasting package combining Darts models with the Engression training paradigm.

## Installation

You can install `engressionts` directly from GitHub using `pip`:

```bash
pip install git+https://github.com/anushatomar13/engressionts.git
```

If you want to install it with the optional foundation model support (e.g., Transformers, Hugging Face Hub), use:

```bash
pip install "engressionts[foundation] @ git+https://github.com/anushatomar13/engressionts.git"
```

## Quick Start

Once installed, you can import and use the models directly in your Python code:

```python
import torch
from darts import TimeSeries
from engressionts.models import EnTransformerModule

# Initialize the Engression Transformer Model
model = EnTransformerModule(
    input_size=1, 
    output_size=1, 
    nr_params=1,
    num_samples_engression=10, 
    noise_dist="gaussian", 
    noise_std=0.1
)

# Your typical training and prediction pipeline goes here
```
