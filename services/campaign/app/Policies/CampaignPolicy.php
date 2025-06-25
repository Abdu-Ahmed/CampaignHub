<?php

namespace App\Policies;

use App\Models\Campaign;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class CampaignPolicy
{
    /**
     * Any authenticated user can list their campaigns.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Only the owner or an admin can view a given campaign.
     */
    public function view(User $user, Campaign $campaign): bool
    {
        return $user->id === $campaign->user_id
            || $user->role === 'admin';
    }

    /**
     * Any authenticated user can create their own campaign.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Only owner or admin can update.
     */
    public function update(User $user, Campaign $campaign): bool
    {
        return $user->id === $campaign->user_id
            || $user->role === 'admin';
    }

    /**
     * Only owner or admin can delete.
     */
    public function delete(User $user, Campaign $campaign): bool
    {
        return $user->id === $campaign->user_id
            || $user->role === 'admin';
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Campaign $campaign): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Campaign $campaign): bool
    {
        return false;
    }
}
