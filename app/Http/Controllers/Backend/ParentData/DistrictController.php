<?php

namespace App\Http\Controllers\Backend\ParentData;

use App\Http\Resources\ParentDataResource;
use App\Models\Backend\ParentData\District;
use Dflydev\DotAccessData\Data;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class DistrictController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = District::with('createdBy')->latest()->get();
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
            'key'    => 'required|string|max:255|unique:districts,key',
            'status' => 'required|in:0,1',
        ]);
        try{
            District::create([
                'title'        => $request->get('title'),
                'key'          => $request->get('key'),
                'status'       => $request->get('status'),
                'created_by'   => auth()->user()->id
            ]);
            return response()->json([
                'success' => true,
                'message' => 'Record Created Successfully',
            ], 201);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create district. Please try again later.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $data = District::with(['createdBy','updatedBy'])->findOrFail($id);
        return response()->json([
            'success' => true,
            'data' => new ParentDataResource($data),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(District $district)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, District $district)
    {
        $validator = Validator::make($request->all(), [
            'title'  => 'required|string|max:255',
            'key'    => 'required|string|max:255|unique:districts,key,' . $district->id,
            'status' => 'required|in:0,1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors'  => $validator->errors(),
            ], 422);
        }

        try {
            $district->update([
                'title'      => $request->title,
                'key'        => $request->key,
                'status'     => $request->status,
                'updated_by' => auth()->id(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'District updated successfully',
                'data'    => $district,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update district',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(District $district)
    {
        try {
            $district->delete();

            return response()->json([
                'success' => true,
                'message' => 'District deleted successfully',
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete district',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function trash(){
        $data= District::onlyTrashed()->with('createdBy')->get();
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
            $data = District::onlyTrashed()->findOrFail($id);
            $data->restore();
            DB::commit();
            return response()->json([
                'success' => true,
                'message' => 'District restored successfully'
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
            $data = District::onlyTrashed()->findOrFail($id);
            $data->forceDelete();
            DB::commit();
            return response()->json([
                'success' => true,
                'message' => 'District deleted successfully'
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
