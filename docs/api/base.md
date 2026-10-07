# Base Architecture

This section documents core PyTorch Lightning base classes underlying Engression models.

---

## EngressionPLModule

### Target Noise Injection

$$\tilde{X} = X + \varepsilon, \quad \varepsilon \sim \mathcal{D}(0, \sigma^2)$$

```{eval-rst}
.. autoclass:: engressionts.base.base_engression.EngressionPLModule
   :members:
   :show-inheritance:
```

