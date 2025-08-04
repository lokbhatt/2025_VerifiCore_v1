<?php

namespace App\Http\Controllers\Backend\ParentData;

use App\Http\Resources\ParentDataResource;
use App\Models\Backend\ParentData\Ward;
use Dflydev\DotAccessData\Data;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class WardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
         $query = Ward::with(['createdBy', 'municipality'])->latest();

        if ($request->has('municipality_id')) {
            $query->where('municipality_id', $request->municipality_id);
        }

        $data = $query->get();
        return response()->json([
            'success' => true,
            'data'    => ParentDataResource::collection($data),
        ], 200);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        if (!auth()->check()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 401);
        }
        $validated = $request->validate([
            'title'  => 'required|string|max:255',
            'key'    => 'required|string|max:255|unique:municipalities,key',
            'status' => 'required|in:0,1',
            'municipality_id' => 'required|exists:municipalities,id',
        ]);
        try{
            Ward::create([
                'title'        => $request->get('title'),
                'key'          => $request->get('key'),
                'status'       => $request->get('status'),
                'municipality_id'  => $request->municipality_id,
                'created_by'   => auth()->user()->id
            ]);
            return response()->json([
                'success' => true,
                'message' => 'Ward Created Successfully',
            ], 201);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create ward. Please try again later.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $data = Ward::with(['createdBy','updatedBy', 'municipality'])->findOrFail($id);
        if(!$data){
            return response()->json([
                'success' => false,
                'message' => 'No Record Found'
            ]);
        }
        return response()->json([
            'success' => true,
            'data' => new ParentDataResource($data),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Ward $ward)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Ward $ward)
    {
        $validator = Validator::make($request->all(), [
            'title'  => 'required|string|max:255',
            'key'    => 'required|string|max:255|unique:municipalities,key,' . $ward->id,
            'status' => 'required|in:0,1',
            'municipality_id' => 'required|exists:municipalities,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors'  => $validator->errors(),
            ], 422);
        }

        try {
            $ward->update([
                'title'       => $request->title,
                'key'         => $request->key,
                'status'      => $request->status,
                'municipality_id' => $request->municipality_id,
                'updated_by'  => auth()->user()->id,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Ward updated successfully',
                'data'    => new ParentDataResource($ward->load('municipality')),
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update Ward',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ward $ward)
    {
        try {
            $ward->delete();

            return response()->json([
                'success' => true,
                'message' => 'Ward deleted successfully',
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete Ward',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function trash(){
        $data= Ward::onlyTrashed()->with('createdBy')->get();
        if($data){
            return response()->json([
                'success' => true,
                'data'    => ParentDataResource::collection($data),
            ]);
        }
        else{
            return response()->json([
                'success' => false,
                'message' => 'No Record Found'
            ]);
        }
    }

    public function restore($id){
        DB::beginTransaction();
        try{
            $data = Ward::onlyTrashed()->findOrFail($id);
            $data->restore();
            DB::commit();
            return response()->json([
                'success' => true,
                'message' => 'Ward restored successfully'
            ]);
        }catch(\Throwable $ex){
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => "$ex.getMessage()"
            ]);
        }
    }

    public function forceDelete($id){
        DB::beginTransaction();
        try{
            $data = Ward::onlyTrashed()->findOrFail($id);
            $data->forceDelete();
            DB::commit();
            return response()->json([
                'success' => true,
                'message' => 'Ward deleted successfully'
            ]);
        }catch(\Throwable $ex){
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => "$ex.getMessage()"
            ]);
        }
    }
}
