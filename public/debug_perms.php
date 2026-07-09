<?php
$user = \App\Models\User::whereHas('roles', function($q) { $q->where('key', 'student'); })->first();
if (!$user) { echo "No student user found.\n"; exit; }
echo "Roles: " . json_encode($user->roles->pluck('key')) . "\n";
echo "Perms: " . json_encode($user->resolveEffectivePermissionKeys()) . "\n";
