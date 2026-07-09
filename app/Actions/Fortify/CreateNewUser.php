<?php

namespace App\Actions\Fortify;

use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * Also stashes org data in the session so the onboarding
     * controller can use it to finish setting up the institution.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            'name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'string', 'email', 'max:150', Rule::unique(User::class)],
            'mobile' => ['nullable', 'regex:/^[6-9]\d{9}$/', Rule::unique(User::class, 'mobile')],
            'password' => $this->passwordRules(),
        ], [
            'mobile.regex' => 'Enter a valid 10-digit Indian mobile number.',
            'mobile.unique' => 'This mobile number is already registered.',
        ])->validate();

        return User::create([
            'name' => $input['name'],
            'email' => $input['email'],
            'mobile' => $input['mobile'] ?? null,
            'password' => $input['password'],
        ]);
    }
}
