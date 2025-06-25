<?php

namespace App\GraphQL\Resolvers;

use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use GraphQL\Error\Error;

class User
{
    /**
     * Return the current authenticated user.
     */
    public function me($_, array $_args, GraphQLContext $ctx): array
    {
        $user = $ctx->request()->user();

        if (! $user) {
            throw new Error('Not authenticated');
        }

        // Return only the fields in the schema
        return [
            'id'    => (string) $user->id,
            'name'  => $user->name,
            'email' => $user->email,
        ];
    }
}
