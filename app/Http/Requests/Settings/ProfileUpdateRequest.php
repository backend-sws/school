<?php

namespace App\Http\Requests\Settings;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     * Profile is updated for the authenticated user (by user id). Same email is allowed (multiple users can share one email).
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'avatar_url' => ['nullable', 'string', 'max:500'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255'],
        ];
    }
}
