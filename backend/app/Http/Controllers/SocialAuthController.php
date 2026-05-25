<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Laravel\Socialite\Facades\Socialite;

class SocialAuthController extends Controller
{
    /**
     * Get the social auth URL for a provider.
     */
    public function redirect(string $provider): JsonResponse
    {
        $allowed = ['google', 'facebook', 'apple'];
        if (!in_array($provider, $allowed)) {
            return response()->json(['error' => 'Invalid provider'], 400);
        }

        $url = Socialite::driver($provider)
            ->stateless()
            ->redirect()
            ->getTargetUrl();

        return response()->json(['url' => $url]);
    }

    /**
     * Handle the callback from a social provider.
     */
    public function callback(string $provider): JsonResponse
    {
        $allowed = ['google', 'facebook', 'apple'];
        if (!in_array($provider, $allowed)) {
            return response()->json(['error' => 'Invalid provider'], 400);
        }

        try {
            $socialUser = Socialite::driver($provider)->stateless()->user();
        } catch (\Exception $e) {
            return response()->json(['error' => 'Authentication failed: ' . $e->getMessage()], 401);
        }

        $email = $socialUser->getEmail();
        if (!$email) {
            return response()->json(['error' => 'Email not provided by ' . ucfirst($provider)], 400);
        }

        // Check if user already exists
        $user = User::where('email', $email)->first();

        if ($user) {
            // Update social fields
            $user->update([
                'social_provider'      => $provider,
                'social_id'            => $socialUser->getId(),
                'social_token'         => $socialUser->token,
                'social_refresh_token' => $socialUser->refreshToken ?? null,
            ]);
        } else {
            // Create new user
            $user = User::create([
                'name'                 => $socialUser->getName() ?? $socialUser->getNickname() ?? explode('@', $email)[0],
                'email'                => $email,
                'password'             => Hash::make(uniqid()),
                'role'                 => 'user',
                'status'               => 'active',
                'avatar'               => $socialUser->getAvatar(),
                'email_verified_at'    => now(),
                'social_provider'      => $provider,
                'social_id'            => $socialUser->getId(),
                'social_token'         => $socialUser->token,
                'social_refresh_token' => $socialUser->refreshToken ?? null,
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful.',
            'user'    => $user,
            'token'   => $token,
        ]);
    }

    /**
     * Handle social login for admin (returns user but frontend checks role).
     */
    public function adminCallback(string $provider): JsonResponse
    {
        return $this->callback($provider);
    }
}
