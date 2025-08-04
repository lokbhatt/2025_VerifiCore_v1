<?php

namespace App\Http\Controllers\Backend\ParentData;

use App\Http\Resources\ParentDataResource;
use App\Models\Backend\ParentData\Gender;
use Dflydev\DotAccessData\Data;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class GenderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = Gender::with('createdBy')->latest()->get();
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
            'key'    => 'required|string|max:255|unique:Genders,key',
            'status' => 'required|in:0,1',
        ]);
        try{
            Gender::create([
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
                'message' => 'Failed to create Gender. Please try again later.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $data = Gender::with(['createdBy','updatedBy'])->findOrFail($id);
        return response()->json([
            'success' => true,
            'data' => new ParentDataResource($data),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Gender $Gender)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Gender $gender)
    {
        $validator = Validator::make($request->all(), [
            'title'  => 'required|string|max:255',
            'key'    => 'required|string|max:255|unique:Genders,key,' . $gender->id,
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
            $gender->update([
                'title'      => $request->title,
                'key'        => $request->key,
                'status'     => $request->status,
                'updated_by' => auth()->user()->id,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Gender updated successfully',
                'data'    => $gender,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update Gender',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Gender $gender)
    {
        try {
            $gender->delete();

            return response()->json([
                'success' => true,
                'message' => 'Gender deleted successfully',
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete Gender',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function trash(){
        $data= Gender::onlyTrashed()->with('createdBy')->get();
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
            $data = Gender::onlyTrashed()->findOrFail($id);
            $data->restore();
            DB::commit();
            return response()->json([
                'success' => true,
                'message' => 'Gender restored successfully'
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
            $data = Gender::onlyTrashed()->findOrFail($id);
            $data->forceDelete();
            DB::commit();
            return response()->json([
                'success' => true,
                'message' => 'Gender deleted successfully'
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
