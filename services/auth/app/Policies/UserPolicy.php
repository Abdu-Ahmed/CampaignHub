<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    /**
     * Only allow an existing admin to promote another user.
     */
    public function promote(User $actor, User $target): bool
    {
        return $actor->role === 'admin';
    }
}
