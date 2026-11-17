<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Kredensial yang diberikan tidak cocok dengan data kami.'],
            ]);
        }

        if (!$user->is_active) {
            return response()->json([
                'message' => 'Akun Anda dinonaktifkan. Silakan hubungi Administrator sekolah.',
            ], 403);
        }

        $user->update(['last_login_at' => now()]);
        $token = $user->createToken('sim-ops-auth-token')->plainTextToken;

        ActivityLog::log('LOGIN', 'AUTH', User::class, $user->id);

        return response()->json([
            'message' => 'Login berhasil.',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'school_id' => $user->school_id,
                'roles' => $user->roles->pluck('name'),
                'permissions' => $user->roles->flatMap->permissions->pluck('name')->unique(),
            ],
        ]);
    }

    public function logout(Request $request)
    {
        ActivityLog::log('LOGOUT', 'AUTH', User::class, $request->user()->id);
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout berhasil.',
        ]);
    }

    public function me(Request $request)
    {
        $user = $request->user()->load(['school', 'roles.permissions']);

        return response()->json([
            'user' => $user,
            'roles' => $user->roles->pluck('name'),
            'permissions' => $user->roles->flatMap->permissions->pluck('name')->unique(),
        ]);
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['Kata sandi saat ini tidak sesuai.'],
            ]);
        }

        $user->update([
            'password' => Hash::make($request->new_password),
        ]);

        ActivityLog::log('UPDATE', 'AUTH', User::class, $user->id, null, ['action' => 'CHANGE_PASSWORD']);

        return response()->json([
            'message' => 'Kata sandi berhasil diperbarui.',
        ]);
    }
}

