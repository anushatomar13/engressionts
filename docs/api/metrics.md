# Evaluation Metrics

This section documents the point and probabilistic evaluation metrics provided by `engressionts`.

---

## Point Metrics

### Mathematical Formulations

- **Mean Absolute Error (MAE)**:
  $$\text{MAE} = \frac{1}{N} \sum_{i=1}^{N} |y_i - \hat{y}_i|$$

- **Mean Squared Error (MSE)** & **Root Mean Squared Error (RMSE)**:
  $$\text{MSE} = \frac{1}{N} \sum_{i=1}^{N} (y_i - \hat{y}_i)^2, \quad \text{RMSE} = \sqrt{\text{MSE}}$$

- **Symmetric Mean Absolute Percentage Error (sMAPE)**:
  $$\text{sMAPE} = \frac{200\%}{N} \sum_{i=1}^{N} \frac{|y_i - \hat{y}_i|}{|y_i| + |\hat{y}_i|}$$

- **Mean Absolute Scaled Error (MASE)**:
  $$\text{MASE} = \frac{\frac{1}{N} \sum_{i=1}^{N} |y_i - \hat{y}_i|}{\frac{1}{N-m} \sum_{i=m+1}^{N} |y_i - y_{i-m}|}$$

```{eval-rst}
.. autofunction:: engressionts.metrics.mae
.. autofunction:: engressionts.metrics.mse
.. autofunction:: engressionts.metrics.rmse
.. autofunction:: engressionts.metrics.mape
.. autofunction:: engressionts.metrics.smape
.. autofunction:: engressionts.metrics.smdape
.. autofunction:: engressionts.metrics.mpe
.. autofunction:: engressionts.metrics.opl
.. autofunction:: engressionts.metrics.mase
.. autofunction:: engressionts.metrics.rmsse
.. autofunction:: engressionts.metrics.owa
```

---

## Probabilistic Metrics

### Mathematical Formulations

- **Continuous Ranked Probability Score (CRPS)**:
  $$\text{CRPS}(F, y) = \int_{-\infty}^{\infty} \left( F(z) - \mathbf{1}_{\{z \ge y\}} \right)^2 dz = \mathbb{E}|Y - y| - \frac{1}{2}\mathbb{E}|Y - Y'|$$

- **Prediction Interval Coverage Probability (PICP)**:
  $$\text{PICP} = \frac{1}{N} \sum_{i=1}^{N} \mathbf{1}_{\{L_i \le y_i \le U_i\}}$$

- **Winkler Score (MIS)** ($\alpha$-level coverage interval $[L, U]$):
  $$W_\alpha(L, U, y) = (U - L) + \frac{2}{\alpha}(L - y)\mathbf{1}_{\{y < L\}} + \frac{2}{\alpha}(y - U)\mathbf{1}_{\{y > U\}}$$

- **Pinball Loss (Quantile Loss)** ($\tau$-quantile):
  $$\mathcal{L}_\tau(y, \hat{q}_\tau) = \max\left( \tau (y - \hat{q}_\tau), (\tau - 1)(y - \hat{q}_\tau) \right)$$

```{eval-rst}
.. autofunction:: engressionts.metrics.pinball_loss
.. autofunction:: engressionts.metrics.crps
.. autofunction:: engressionts.metrics.empirical_coverage
.. autofunction:: engressionts.metrics.winkler_score
.. autofunction:: engressionts.metrics.mpiw
.. autofunction:: engressionts.metrics.rho_risk
```

