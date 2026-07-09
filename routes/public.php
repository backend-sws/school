<?php

use App\Http\Controllers\Web\WebsiteController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Website Routes
|--------------------------------------------------------------------------
|
| All public-facing website routes. No closures; each route points to a
| controller action. Data is passed as Inertia props where applicable.
|
*/
// Route::get('/', [WebsiteController::class, 'index'])->name('home');

Route::get('/gallery', [WebsiteController::class, 'gallery'])->name('gallery');
Route::get('/about-us', [WebsiteController::class, 'aboutUs'])->name('about-us');
Route::get('/contact', [WebsiteController::class, 'contact'])->name('contact');
Route::get('/approval', [WebsiteController::class, 'approval'])->name('approval');
Route::get('/academics', [WebsiteController::class, 'academics'])->name('academics');
Route::get('/departments', [WebsiteController::class, 'departments'])->name('departments');
Route::get('/facilities', [WebsiteController::class, 'facilities'])->name('facilities');
Route::get('/training-placement', [WebsiteController::class, 'trainingPlacement'])->name('training-placement');
