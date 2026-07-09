<?php

use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('App.Models.User.{id}', function (User $user, $id) {
    $userId = $user->getAuthIdentifier();
    $channelId = is_numeric($id) ? (int) $id : (string) $id;
    return (string) $userId === (string) $channelId;
});
