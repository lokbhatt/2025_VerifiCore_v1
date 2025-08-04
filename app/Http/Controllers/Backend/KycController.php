<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\BaseController;
use App\Http\Requests\KycRequest;
use App\Http\Resources\KycResource;
use App\Models\Backend\Kyc;
use App\Models\Backend\ParentData\District;
use App\Models\Backend\ParentData\Gender;
use App\Models\Backend\ParentData\Municipality;
use App\Models\Backend\ParentData\Ward;
use App\Services\KycValidationService;
use App\Services\OcrParserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use thiagoalessio\TesseractOCR\TesseractOCR;

class KycController extends BaseController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = auth()->user();

        if ($user->hasRole('admin')) {
            $data = Kyc::with('createdBy')->latest()->paginate(10);
            return $this->successMessage(KycResource::collection($data));
        } 
        else if ($user->hasRole('member')){
            $data= Kyc::with('createdBy')->where('created_by', $user->id)->get();
            return $this->successMessage(KycResource::collection($data));
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(KycRequest $request)
    {
        $ocrRawTextFront = null;
        $ocrRawTextBack  = null;
        $userId = auth()->user()->id;
        $existingKyc = Kyc::where('created_by', $userId)->first();
        if($existingKyc){
            return $this->successMessage(new KycResource($existingKyc), 'KYC already exists.', [], 200);
        }

        $data = $request->validated();

        if (!empty($data['citizenship_issued_place'])) {
            $districtTitle = District::find($data['citizenship_issued_place'])?->title;
        }
        if (!empty($data['district_id'])) {
            $district = District::find($data['district_id'])?->title;
        }
        if (!empty($data['municipality_id'])) {
            $municipality = Municipality::find($data['municipality_id'])?->title;
        }
        if (!empty($data['ward_id'])) {
            $ward = Ward::find($data['ward_id'])?->title;
        }
        if (!empty($data['gender_id'])) {
            $gender = Gender::find($data['gender_id'])?->title;
        }
        $data['created_by'] = $userId;

        try {          
            if ($request->hasFile('citizenship_photo_front')) {
                $file = $request->file('citizenship_photo_front');
                $filename = 'front_' . time() . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs('kyc', $filename, 'public');
                $data['citizenship_photo_front'] = $path;

                // ocr extraction 
                $ocrRawTextFront = (new TesseractOCR(public_path('images/'.$path)))
                    ->executable('C:\Program Files\Tesseract-OCR\tesseract.exe')
                    ->lang('nep+eng')
                    ->run();
            }

            if ($request->hasFile('citizenship_photo_back')) {
                $file = $request->file('citizenship_photo_back');
                $filename = 'back_' . time() . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs('kyc', $filename, 'public');
                $data['citizenship_photo_back'] = $path;

                $ocrRawTextBack = (new TesseractOCR(public_path('images/'.$path)))
                        ->executable('C:\Program Files\Tesseract-OCR\tesseract.exe')
                        ->lang('nep+eng')
                        ->run();
            }
            
            $ocrRawText = ($ocrRawTextFront ?? '') . ' ' . ($ocrRawTextBack ?? '');
            $ocrData = app(OcrParserService::class)->extractFields($ocrRawText);

            $ocrNormalized = [
                'citizenship_number' => $ocrData['citizenship_number'] ?? null,
                'dob' => $ocrData['dob'] ?? null,
                'citizenship_issued_date' => $ocrData['citizenship_issued_date_ad'] ?? null,
                'citizenship_issued_by' => $ocrData['citizenship_issued_by'] ?? null,
                'citizenship_issued_place' => $ocrData['district'] ?? null,
                'district' => $ocrData['district'] ?? null,
                'municipality' => $ocrData['municipality'] ?? null,
                'ward' => $ocrData['ward'] ?? null,
                'gender' => $ocrData['gender'] ?? null,
            ];

            $userInput = [
                'citizenship_number' => $data['citizenship_number'],
                'name' => $data['name'],
                'dob' => $data['dob'],
                'citizenship_issued_date' => $data['citizenship_issued_date'],
                'citizenship_issued_by' => $data['citizenship_issued_by'] ?? null,
                'citizenship_issued_place' => $districtTitle ?? null,
                'district' => $district ?? null,
                'municipality' => $municipality ?? null,
                'ward' => $ward ?? null,
                'gender' => $gender ?? null,
            ];

            $validator = app(KycValidationService::class);
            $errors = $validator->matches($ocrNormalized, $userInput);

             if (!empty($errors)) {
                return $this->errorMessage('Matching Validation error', $errors, 422);
            }
            
                $kyc = Kyc::create($data);
                return $this->successMessage(new KycResource($kyc), 'KYC created successfully.', [], 201);
        } catch (\Throwable $th) {
            return $this->errorMessage("Failed to create KYC record". $th->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        if (!auth()->check()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 401);
        }
        $kyc = Kyc::with([
            'district', 'municipality', 'ward',
            'tempDistrict', 'tempMunicipality', 'tempWard',
            'gender', 'createdBy', 'updatedBy'
        ])->findOrFail($id);

        return new KycResource($kyc);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(KycRequest $request, string $id)
    {
        $kyc = Kyc::find($id);
        if (!$kyc) {
            return $this->errorMessage('KYC not found.');
        }

        $data = $request->validated();
        $data['updated_by'] = auth()->id();

        $destination = public_path('images/kyc');
        if (!is_dir($destination)) {
            mkdir($destination, 0755, true);
        }

        $ocrRawTextFront = null;
        $ocrRawTextBack = null;

        if ($request->hasFile('citizenship_photo_front')) {
            if ($kyc->citizenship_photo_front && file_exists(public_path('images/' . $kyc->citizenship_photo_front))) {
                unlink(public_path('images/' . $kyc->citizenship_photo_front));
            }

            $file = $request->file('citizenship_photo_front');
            $filename = 'front_' . time() . '.' . $file->getClientOriginalExtension();
            $file->move($destination, $filename);
            $data['citizenship_photo_front'] = 'kyc/' . $filename;

            $ocrRawTextFront = (new TesseractOCR(public_path('images/' . $data['citizenship_photo_front'])))
                ->executable('C:\Program Files\Tesseract-OCR\tesseract.exe')
                ->lang('nep+eng')
                ->run();
        }

        if ($request->hasFile('citizenship_photo_back')) {
            if ($kyc->citizenship_photo_back && file_exists(public_path('images/' . $kyc->citizenship_photo_back))) {
                unlink(public_path('images/' . $kyc->citizenship_photo_back));
            }

            $file = $request->file('citizenship_photo_back');
            $filename = 'back_' . time() . '.' . $file->getClientOriginalExtension();
            $file->move($destination, $filename);
            $data['citizenship_photo_back'] = 'kyc/' . $filename;

            $ocrRawTextBack = (new TesseractOCR(public_path('images/' . $data['citizenship_photo_back'])))
                ->executable('C:\Program Files\Tesseract-OCR\tesseract.exe')
                ->lang('nep+eng')
                ->run();
        }

        $requiresOcrValidation = $ocrRawTextFront !== null 
            || $ocrRawTextBack !== null 
            || $request->hasAny(['name','dob','citizenship_number','citizenship_issued_date']);

        if ($requiresOcrValidation) {
            $ocrRawText = ($ocrRawTextFront ?? '') . ' ' . ($ocrRawTextBack ?? '');
            if (!empty(trim($ocrRawText))) {
                $ocrData = app(OcrParserService::class)->extractFields($ocrRawText);
            } else {
                return $this->errorMessage('Cannot verify changes without updated citizenship photos.', [], 422);
            }

            $userInput = [
                'citizenship_number' => $data['citizenship_number'] ?? $kyc->citizenship_number,
                'name' => $data['name'] ?? $kyc->name,
                'dob' => $data['dob'] ?? $kyc->dob,
                'citizenship_issued_date' => $data['citizenship_issued_date'] ?? $kyc->citizenship_issued_date,
                'citizenship_issued_by' => $data['citizenship_issued_by'] ?? $kyc->citizenship_issued_by,
                'citizenship_issued_place' => $data['citizenship_issued_place'] ?? $kyc->citizenship_issued_place,
                'district' => $data['district'] ?? $kyc->district,
                'municipality' => $data['municipality'] ?? $kyc->municipality,
                'ward' => $data['ward'] ?? $kyc->ward,
                'gender' => $data['gender'] ?? $kyc->gender,
            ];

            $validator = app(KycValidationService::class);
            $errors = $validator->matches($ocrData, $userInput);

            if (!empty($errors)) {
                return $this->errorMessage('Matching Validation error', $errors, 422);
            }
        }

        $kyc->update($data);
        return $this->successMessage(new KycResource($kyc), 'KYC updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $kyc = Kyc::find($id);
        if (!$kyc) {
            return $this->errorMessage('KYC not found.');
        }

        $kyc->delete();
        return $this->successMessage([], 'KYC soft-deleted successfully.');
    }

    /**
     * Display soft-deleted records.
     */
    public function trash()
{
    $user = auth()->user();

    if ($user->hasRole('admin')) {
        // Admin sees all trashed KYCs
        $trashed = Kyc::onlyTrashed()
            ->with('createdBy')
            ->latest()
            ->paginate(10);
    } 

    if ($trashed->isEmpty()) {
        return $this->successMessage([], 'No trashed KYC records found.');
    }

    return $this->successMessage(KycResource::collection($trashed));
}


    /**
     * Restore a soft-deleted KYC record.
     */
    public function restore(string $id)
    {
        $kyc = Kyc::onlyTrashed()->find($id);
        if (!$kyc) {
            return $this->errorMessage('KYC not found or not trashed.');
        }

        $existingKyc = Kyc::where('created_by', $kyc->created_by)->whereNull('deleted_at')->first();
        if ($existingKyc) {
            return $this->errorMessage('User already has an active KYC record. Restore not allowed.', [], 422);
        }

        $kyc->restore();
        return $this->successMessage($kyc, 'KYC restored successfully.');
    }

    /**
     * Permanently delete a soft-deleted KYC record.
     */
    public function forceDelete(string $id)
    {
        $kyc = Kyc::onlyTrashed()->find($id);
        if (!$kyc) {
            return $this->errorMessage('KYC not found or not trashed.');
        }

        $kyc->forceDelete();
        return $this->successMessage([], 'KYC permanently deleted.');
    }

    public function approve(Request $request, string $id)
    {
        $kyc = Kyc::find($id);
        if (!$kyc) {
            return $this->errorMessage('KYC not found.');
        }

         $validator = Validator::make($request->all(), [
            'remarks' => 'required|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $kyc->update([
            'status' => 'approved',
            'remarks' => $request->remarks,
            'updated_by' => auth()->id(),
        ]);

        return $this->successMessage(new KycResource($kyc), 'KYC approved successfully.');
    }

    public function reject(string $id, Request $request)
    {
        $kyc = Kyc::find($id);
        if (!$kyc) {
            return $this->errorMessage('KYC not found.');
        }

        $validator = Validator::make($request->all(), [
            'remarks' => 'required|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $kyc->update([
            'status' => 'rejected',
            'remarks' => $request->remarks,
            'updated_by' => auth()->id(),
        ]);

        return $this->successMessage(new KycResource($kyc), 'KYC rejected successfully.');
    }

}
