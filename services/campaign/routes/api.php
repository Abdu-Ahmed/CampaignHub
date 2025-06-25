<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Http\Controllers\CampaignController;

// Public auth endpoints
Route::post('register', function(Request $req) {
    $data = $req->validate([
        'name'     => 'required|string|max:255',
        'email'    => 'required|email|unique:users,email',
        'password' => 'required|string|min:8|confirmed',
    ]);

    $user = User::create([
        'name'     => $data['name'],
        'email'    => $data['email'],
        'password' => Hash::make($data['password']),
    ]);

    return response()->json([
        'token' => $user->createToken('app-token')->plainTextToken,
    ], 201);
});

Route::post('login', function(Request $req) {
    $creds = $req->validate([
        'email'    => 'required|email',
        'password' => 'required|string',
    ]);

    $user = User::where('email', $creds['email'])->first();
    if (! $user || ! Hash::check($creds['password'], $user->password)) {
        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    return response()->json([
        'token' => $user->createToken('app-token')->plainTextToken,
    ]);
});

// Everything below is sanctum‐protected, plus per‐action `can:` middleware
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('campaigns', [CampaignController::class, 'index'])
         ->middleware('can:viewAny,App\Models\Campaign');

    Route::post('campaigns', [CampaignController::class, 'store'])
         ->middleware('can:create,App\Models\Campaign');

    Route::get('campaigns/{campaign}', [CampaignController::class, 'show'])
         ->middleware('can:view,campaign');

    Route::patch('campaigns/{campaign}', [CampaignController::class, 'update'])
         ->middleware('can:update,campaign');

    Route::delete('campaigns/{campaign}', [CampaignController::class, 'destroy'])
         ->middleware('can:delete,campaign');
         
    Route::post('campaigns/{campaign}/duplicate', [CampaignController::class, 'duplicate'])
     ->middleware('can:view,campaign');

});
