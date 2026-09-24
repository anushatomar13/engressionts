# Installation

This guide walks you through installing **engressionts** and its core dependencies.

## Prerequisites

Before installing `engressionts`, ensure you have Python **3.9** or higher installed.

* **Python**: `>= 3.9`
* **PyTorch**: `>= 2.0.0`
* **Darts**: `>= 0.29.0`

---

## Installing via PyPI

Install the latest stable release from PyPI using `pip`:

```bash
pip install engressionts
```

---

## Installing from Source

If you want to contribute or build from source:

1. Clone the GitHub repository:
   ```bash
   git clone https://github.com/anushatomar13/engressionts.git
   cd engressionts
   ```

2. Install in editable mode with development dependencies:
   ```bash
   pip install -e ".[dev]"
   ```

---

## Verifying Installation

Verify that `engressionts` is installed correctly by checking its version:

```python
import engressionts
print(engressionts.__version__)
```
