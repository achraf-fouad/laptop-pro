<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Http\Resources\UserResource;
use App\Traits\ApiResponses;
use Illuminate\Http\Request;

class UserController extends Controller
{
    use ApiResponses;

    /**
     * Display a listing of clients.
     */
    public function index()
    {
        $users = User::withCount('orders')
            ->with([
                'orders' => function ($query) {
                    $query->where('status', '!=', 'cancelled');
                }
            ])
            ->latest()
            ->paginate(10);

        return UserResource::collection($users);
    }

    /**
     * Display the specified client.
     */
    public function show(User $user)
    {
        $user->loadCount('orders')->load([
            'orders' => function ($query) {
                $query->where('status', '!=', 'cancelled');
            }
        ]);

        return new UserResource($user);
    }

    /**
     * Remove the specified client.
     */
    public function destroy(User $user)
    {
        if ($user->isAdmin()) {
            return $this->error('Impossible de supprimer un administrateur.', 403);
        }

        $user->delete();
        return $this->success(null, 'Client supprimé avec succès');
    }
}
