# EngressionTS: Probabilistic time-series forecasting via Engression

**Anusha Tomar, Rajdeep Pathak, and Tanujit Chakraborty**

[![PyPI Version](https://img.shields.io/pypi/v/engressionts.svg)](https://pypi.org/project/engressionts/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python Version](https://img.shields.io/badge/python-3.9%20%7C%203.10%20%7C%203.11%20%7C%203.12-blue)](https://pypi.org/project/engressionts/)

---

## Overview

**EngressionTS** is a Python package for probabilistic time-series forecasting that combines neural forecasting architectures with Engression. It provides a common framework for generating probabilistic forecasts and capturing uncertainty directly through the model.

---

## Key Features

- **Probabilistic Time-Series Forecasting** : Generates multiple stochastic future trajectories to model the predictive distribution rather than producing only a single point forecast.

- **Model-Intrinsic Uncertainty Quantification** : Introduces stochasticity through noise injection into historical inputs, allowing uncertainty to be captured directly during forecasting.

- **Energy-Based Training** : Uses the **Energy Score** as the training objective to encourage forecasts that are both close to the observed values and appropriately diverse.

- **Models** : Integrates deep time series forecasting architectures, including RNNs, TCNs, Transformers, NHITS, TiDE, and TSMixer, with Engression-based probabilistic forecasting.

- **Unified Probabilistic Framework** : Provides a common interface for training, inference, and evaluation of Engression-augmented forecasting models across different time-series datasets and architectures.

---

## Installation

**Option 1: Install `engressionts` from PyPI using `pip`**:

```bash
pip install engressionts
```

### Option 2: Install from source
```bash
git clone https://github.com/anushatomar13/engressionts.git
cd engressionts
pip install -e .
```

## Documentation & Tutorials

* **Official Documentation Website**: [To be updated]
* **Tutorial Notebook**: [Solar Energy Example Notebook (GitHub)](https://github.com/anushatomar13/engressionts/blob/main/examples/engts-example-usage-solar.ipynb)

---

## Citation

If you use `engressionts` in your research, please cite our paper:

```bibtex
[To be updated]
```

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

