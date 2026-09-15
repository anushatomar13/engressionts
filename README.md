# EngressionTS

A probabilistic time-series forecasting package combining Darts models with the Engression training paradigm.

## Installation

You can install `engressionts` directly from GitHub using `pip`:

```bash
pip install git+https://github.com/anushatomar13/engressionts.git
```



## Quick Start

Once installed, you can use the models seamlessly in your Jupyter Notebooks or Python scripts just like standard Darts models!

```python
import matplotlib.pyplot as plt
from darts.datasets import AirPassengersDataset
from engressionts.models import EnTransformerModel

# 1. Load some sample time-series data
series = AirPassengersDataset().load()

# 2. Initialize an Engression Model 
# (You pass both Darts parameters and Engression parameters!)
model = EnTransformerModel(
    input_chunk_length=12, 
    output_chunk_length=6, 
    n_epochs=10,
    num_samples=20,          # Engression parameter
    noise_type="gaussian",   # Engression parameter
    noise_std=0.1            # Engression parameter
)

# 3. Train the model
model.fit(series)

# 4. Generate a probabilistic forecast 
# (Set num_samples > 1 to draw stochastic trajectories)
pred = model.predict(n=6, num_samples=100)

# 5. Plot the forecast with uncertainty intervals
series.tail(24).plot(label="Actual")
pred.plot(label="Forecast")
plt.legend()
plt.show()
```
