<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Nuwave\Lighthouse\Http\GraphQLController;

Route::post('register', function(Request $req) {
    $data = $req->validate([
        'name'                  => 'required|string|max:255',
        'email'                 => 'required|email|unique:users,email',
        'password'              => 'required|string|min:8|confirmed',
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

Route::middleware('auth:sanctum')
    ->post('graphql', GraphQLController::class);
