# Noise Distributions

This section documents the noise injection distributions supported for Engression target modeling.

---

## Gaussian Noise

$$\varepsilon \sim \mathcal{N}(0, \sigma^2 \mathbf{I})$$

where $\sigma$ corresponds to `noise_std`.

```{eval-rst}
.. autoclass:: engressionts.noise.gaussian.GaussianNoise
   :members:
   :show-inheritance:
```

---

## Uniform Noise

$$\varepsilon \sim \mathcal{U}(-\sigma, \sigma)$$

where $\sigma$ corresponds to `noise_std`.

```{eval-rst}
.. autoclass:: engressionts.noise.uniform.UniformNoise
   :members:
   :show-inheritance:
```

