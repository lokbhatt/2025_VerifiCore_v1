<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\Backend\Kyc;
use App\Models\User;
use App\Models\UserDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends BaseController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = auth()->user();

        if (!$user->hasRole('admin')) {
            return $this->errorMessage('Unauthorized access.', 403);
        }

        $data = User::with(['userDetail', 'roles'])
            ->latest()
            ->paginate(10);

        return $this->successMessage(UserResource::collection($data));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $data = User::with(['userDetail', 'roles'])
            ->findOrFail($id);
        return $this->successMessage(new UserResource($data));
    }

    /**
     * Update the specified resource in storage.
     */

    public function update(Request $request, string $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name'     => 'sometimes|string|max:255',
            'username' => ['sometimes', 'string', 'max:50', Rule::unique('users')->ignore($user->id)],
            'email'    => ['sometimes', 'email', Rule::unique('users')->ignore($user->id)],
            'phone'    => 'nullable|string|max:20',
            'password' => 'nullable|string|min:8|confirmed',
            'status'   => 'sometimes|boolean',
            'address'  => 'nullable|string|max:500',
            'image'    => 'nullable|image|max:2048',
        ]);

        // Update user data
        $user->update([
            'name'     => $validated['name'] ?? $user->name,
            'username' => $validated['username'] ?? $user->username,
            'email'    => $validated['email'] ?? $user->email,
            'phone'    => $validated['phone'] ?? $user->phone,
            'status'   => $validated['status'] ?? $user->status,
        ]);

        $userDetail = $user->userDetail ?? new UserDetail(['created_by' => $user->id]);
        $userDetail->address = $validated['address'] ?? $userDetail->address ?? '';

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = 'profile_' . $user->id . '_' . time() . '.' . $file->getClientOriginalExtension();
            $destination = public_path('images/profiles');

            if (!File::isDirectory($destination)) {
                File::makeDirectory($destination, 0777, true, true);
            }

            if (!empty($userDetail->image) && File::exists(public_path($userDetail->image))) {
                File::delete(public_path($userDetail->image));
            }

            $file->move($destination, $filename);

            $userDetail->image = 'images/profiles/' . $filename;
        }

        $userDetail->updated_by = auth()->id();
        $userDetail->created_by = $userDetail->created_by ?? auth()->id();
        $userDetail->created_by = $userDetail->created_by; 
        if (!$userDetail->exists) {
            $userDetail->created_by = $user->id;
        }
        $userDetail->save();

        if ($request->filled('role')) {
            $user->syncRoles([$request->role]);
        }

        return $this->successMessage(
            new UserResource($user->load(['userDetail', 'roles'])),
            'User updated successfully.'
        );
    }

    /**
     * Remove the specified resource from storage (soft delete).
     */
    public function destroy(string $id)
    {
        $user = User::findOrFail($id);

        $user->delete();

        return $this->successMessage(null, 'User deleted successfully.');
    }

        public function trash()
    {
        $users = User::onlyTrashed()->latest()->get();
        return response()->json(['data' => $users]);
    }

    public function restore(string $id)
    {
        $user = User::onlyTrashed()->findOrFail($id);
        $user->restore();
        return response()->json(['success' => true, 'message' => 'User restored successfully.']);
    }

    public function forceDelete(string $id)
    {
        $user = User::onlyTrashed()->findOrFail($id);
        $user->forceDelete();
        return response()->json(['success' => true, 'message' => 'User permanently deleted.']);
    }

    public function memberIndex()
{
    $user = auth()->user();

    if (!$user->hasRole('member')) {
        return $this->errorMessage('Unauthorized access.', 403);
    }

    $data = User::with(['userDetail', 'roles'])
        ->where('status', 1) // only approved members
        ->latest()
        ->paginate(10);

    return $this->successMessage(UserResource::collection($data));
}


    public function showMember()
    {
        $authUser = auth()->user();
        if ((int) $authUser->status !== 1) {
            return response()->json([
                'message' => 'Your membership is not approved yet.',
            ], 403);
        }

        $data = User::with(['userDetail', 'roles'])
            ->where('status', 1)
            ->findOrFail($authUser->id);

        return $this->successMessage(new UserResource($data));
    }

    public function dashboardStats()
    {
        $user = auth()->user();

        if (!$user->hasRole('admin')) {
            return $this->errorMessage('Unauthorized access.', 403);
        }

        $totalMembers = User::count();
        $pendingMembers = User::where('status', 0)->count();
        $approvedMembers = User::where('status', 1)->count();
        $totalSessions = DB::table('sessions')->count();
        $totalKyc = Kyc::count();

        return response()->json([
            'totalMembers'    => $totalMembers,
            'pendingMembers'  => $pendingMembers,
            'approvedMembers' => $approvedMembers,
            'totalSessions'   => $totalSessions,
            'totalKyc'        => $totalKyc,
        ]);
    }

}
