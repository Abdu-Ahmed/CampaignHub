<?php
namespace App\GraphQL\Resolvers;

class Hello {
  public function resolve($_, array $args): string {
    return 'Hello, CampaignHub!';
  }
}
