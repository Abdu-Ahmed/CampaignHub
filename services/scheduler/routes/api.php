<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\DispatchController;

Route::post('/dispatch-scheduled', [DispatchController::class, 'dispatchScheduled']);