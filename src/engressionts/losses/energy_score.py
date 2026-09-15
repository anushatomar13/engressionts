import torch
from typing import List, Optional, Union

def energy_score_loss(samples: torch.Tensor, target: torch.Tensor) -> torch.Tensor:
    """
    samples: (M, batch, len, dim) - M stochastic samples
    target: (batch, len, dim) - Ground truth
    """
    M = samples.size(0)
    
    # Term 1: Mean distance to target E[||Y - y||]
    # Resulting shape: (batch, len)
    dist_to_target = torch.linalg.norm(samples - target.unsqueeze(0), dim=-1).mean(0)
    
    # Term 2: Mean pairwise distance between samples 0.5 * E[||Y - Y'||]
    # Flatten samples to (M, batch*len, dim) for efficient pairwise calculation
    s = samples.reshape(M, -1, samples.size(-1))
    # (M, 1, BL, D) - (1, M, BL, D) -> (M, M, BL, D)
    diff = s.unsqueeze(1) - s.unsqueeze(0)
    pairwise_dist = torch.linalg.norm(diff, dim=-1).mean(dim=(0, 1))
    dist_samples = pairwise_dist.view(target.size(0), target.size(1))
    
    # Final Energy Score (mean over batch and time)
    loss = dist_to_target - 0.5 * dist_samples
    return loss.mean()

# def energy_score_loss(
#     samples: torch.Tensor,
#     target: torch.Tensor,
#     mask: torch.Tensor = None,
# ) -> torch.Tensor:
#     """
#     Computes the Energy Score loss.

#     Parameters
#     ----------
#     samples
#         Shape: (M, B, T, D)

#     target
#         Shape: (B, T, D)

#     mask
#         Shape: (B, T, D) or None

#     Returns
#     -------
#     torch.Tensor
#         Scalar Energy Score loss.
#     """

#     if mask is None:
#         # Distance between generated samples and ground truth
#         diff = samples - target.unsqueeze(0)
#         term1 = torch.norm(diff, dim=-1).mean()

#         # Pairwise distance between generated samples
#         pairwise = samples.unsqueeze(0) - samples.unsqueeze(1)
#         term2 = torch.norm(pairwise, dim=-1).mean()
#     else:
#         # Distance between generated samples and ground truth
#         diff = samples - target.unsqueeze(0)
#         diff = diff * mask.unsqueeze(0)
#         norm_diff = torch.norm(diff, dim=-1)
#         term1 = norm_diff.sum() / torch.clamp(mask.sum() * samples.shape[0], min=1.0)

#         # Pairwise distance between generated samples
#         pairwise = samples.unsqueeze(0) - samples.unsqueeze(1)
#         pairwise = pairwise * mask.unsqueeze(0).unsqueeze(0)
#         norm_pairwise = torch.norm(pairwise, dim=-1)
#         term2 = norm_pairwise.sum() / torch.clamp(mask.sum() * (samples.shape[0] ** 2), min=1.0)

#     return term1 - 0.5 * term2


