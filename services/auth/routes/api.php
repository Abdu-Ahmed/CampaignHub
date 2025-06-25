<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use App\Models\User;
use App\Http\Controllers\CampaignController;

/*
|--------------------------------------------------------------------------
| Public auth routes
|--------------------------------------------------------------------------
*/
Route::post('register', function (Request $req) {
    $data = $req->validate([
        'name'     => 'required|string|max:255',
        'email'    => 'required|email|unique:users,email',
        'password' => [
            'required', 'string', 'confirmed', 'min:8',
            'regex:/[a-z]/', 'regex:/[A-Z]/',
            'regex:/[0-9]/', 'regex:/[@$!%*?&]/',
        ],
    ], [
        'password.regex' => 'Your password must contain uppercase, lowercase, a number, and a special character.',
    ]);

    // auto-verify for ease of development
    $user = User::create([
        'name'              => $data['name'],
        'email'             => $data['email'],
        'password'          => Hash::make($data['password']),
        'email_verified_at' => now(),
    ]);

    return response()->json([
        'token' => $user->createToken('app-token')->plainTextToken,
    ], 201);
});

Route::post('login', function (Request $req) {
    $creds = $req->validate([
        'email'    => 'required|email',
        'password' => 'required|string',
    ]);

    $user = User::where('email', $creds['email'])->first();

    if (! $user || ! Hash::check($creds['password'], $user->password)) {
        throw ValidationException::withMessages([
            'email' => ['Invalid credentials.'],
        ]);
    }

    return response()->json([
        'token' => $user->createToken('app-token')->plainTextToken,
    ]);
});

/*
|--------------------------------------------------------------------------
| Protected routes
|--------------------------------------------------------------------------
|
| All campaign CRUD, plus “user promotion” endpoint.
|
*/
Route::middleware('auth:sanctum')->group(function () {
    // Campaign CRUD
    Route::apiResource('campaigns', CampaignController::class);

    // Only admins can promote other users
    Route::patch('users/{user}/promote', function (User $user, Request $req) {
        $req->user()->can('promote', $user);
        $user->role = 'admin';
        $user->save();

        return response()->json(['message' => 'User promoted.']);
    })->name('users.promote');

    Route::get('debug/user', function(Request $request) {
        return response()->json([
            'id'    => $request->user()->id,
            'email' => $request->user()->email,
            'name'  => $request->user()->name,
        ]);
    });
});
