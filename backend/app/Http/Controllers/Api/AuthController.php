<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Traits\ApiResponses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    use ApiResponses;

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return $this->error('Les identifiants sont incorrects.', 401);
        }

        $token = $user->createToken('auth-token')->plainTextToken;
        $cookie = cookie('admin_token', $token, 60 * 24, null, null, false, true, false, 'Lax');

        return $this->success([
            'user' => $user,
            'role' => $user->role,
        ], 'Connexion réussie')->withCookie($cookie);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return $this->success(null, 'Déconnexion réussie');
    }

    public function user(Request $request)
    {
        return $this->success($request->user());
    }
}
