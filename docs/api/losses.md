# Loss Functions

This section covers custom loss functions used in Engression training.

---

## Energy Score Loss

### Mathematical Formulation

For a predictive sample set $Y = \{y^{(1)}, \dots, y^{(M)}\}$ and ground truth target $Y_{\text{true}}$:

$$\text{EnergyScore}(Y, Y_{\text{true}}) = \mathbb{E}\left[\|Y - Y_{\text{true}}\|\right] - \frac{1}{2}\mathbb{E}\left[\|Y - Y'\|\right]$$

Sample estimator computed during training:

$$\widehat{\mathcal{L}}_{\text{ES}} = \frac{1}{M}\sum_{m=1}^{M} \|y^{(m)} - Y_{\text{true}}\| - \frac{1}{2 M (M-1)} \sum_{m=1}^{M} \sum_{j \neq m}^{M} \|y^{(m)} - y^{(j)}\|$$

```{eval-rst}
.. autofunction:: engressionts.losses.energy_score_loss
```

