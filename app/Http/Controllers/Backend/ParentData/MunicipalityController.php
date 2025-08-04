<?php

namespace App\Http\Controllers\Backend\ParentData;

use App\Http\Resources\ParentDataResource;
use App\Models\Backend\ParentData\Municipality;
use Dflydev\DotAccessData\Data;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class MunicipalityController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
         $query = Municipality::with(['createdBy', 'district'])->latest();

        if ($request->has('district_id')) {
            $query->where('district_id', $request->district_id);
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
            'district_id' => 'required|exists:districts,id',
        ]);
        try{
            Municipality::create([
                'title'        => $request->get('title'),
                'key'          => $request->get('key'),
                'status'       => $request->get('status'),
                'district_id'  => $request->district_id,
                'created_by'   => auth()->user()->id
            ]);
            return response()->json([
                'success' => true,
                'message' => 'Record Created Successfully',
            ], 201);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create Municipality. Please try again later.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $data = Municipality::with(['createdBy','updatedBy', 'district'])->findOrFail($id);
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
    public function edit(Municipality $Municipality)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Municipality $municipality)
    {
        $validator = Validator::make($request->all(), [
            'title'  => 'required|string|max:255',
            'key'    => 'required|string|max:255|unique:municipalities,key,' . $municipality->id,
            'status' => 'required|in:0,1',
            'district_id' => 'required|exists:districts,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors'  => $validator->errors(),
            ], 422);
        }

        try {
            $municipality->update([
                'title'       => $request->title,
                'key'         => $request->key,
                'status'      => $request->status,
                'district_id' => $request->district_id,
                'updated_by'  => auth()->user()->id,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Municipality updated successfully',
                'data'    => new ParentDataResource($municipality->load('district')),
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update Municipality',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Municipality $municipality)
    {
        try {
            $municipality->delete();

            return response()->json([
                'success' => true,
                'message' => 'Municipality deleted successfully',
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete Municipality',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function trash(){
        $data= Municipality::onlyTrashed()->with('createdBy')->get();
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
            $data = Municipality::onlyTrashed()->findOrFail($id);
            $data->restore();
            DB::commit();
            return response()->json([
                'success' => true,
                'message' => 'Municipality restored successfully'
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
            $data = Municipality::onlyTrashed()->findOrFail($id);
            $data->forceDelete();
            DB::commit();
            return response()->json([
                'success' => true,
                'message' => 'Municipality deleted successfully'
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
