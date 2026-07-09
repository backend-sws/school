<?php
namespace App\Services;

use App\Models\FeeStructureRule;
use App\Models\SubjectPaper;
use App\Models\AdmissionHead;
use App\Models\FeeType;
use App\Models\AdmissionHeadPaper;
use Illuminate\Support\Facades\DB;

class AdmissionHeadService
{
    public function storeAdmissionHeadData(array $data)
    {
        return DB::transaction(function () use ($data) {

            // 1. Total Fee Calculation
            $totalFees = collect($data['fees'])->sum('amount');

            $applicationFee = ($data['has_application_fees'] ?? false) ? ($data['application_fees'] ?? 0) : 0;
            // 2. Create Main Admission Head Record
            $head = AdmissionHead::create([
                'title' => $data['title'],
                'course_for' => $data['course_for'],
                'main_stream_id' => $data['main_stream_id'],
                'stream_id' => $data['stream_id'],
                'major_subject_id' => $data['major_subject_id'],
                'session_id' => $data['session_id'],
                'semester' => $data['semester'] ?? null,

                // Criteria Fields (Store as JSON)
                'board_criteria' => $data['board_criteria'],
                'gender_criteria' => $data['gender_criteria'],
                'category_criteria' => $data['category_criteria'],

                'status' => $data['status'] ?? 0, // Default to Draft (0)
                'allow_subject_paper_selection' => $data['allow_subject_paper_selection'] ?? false,
                'has_application_fees' => $data['has_application_fees'] ?? false,
                'application_fees' => $data['application_fees'] ?? 0,
                'total_admission_fees' => $totalFees + $applicationFee,
                'last_date' => $data['last_date'],
                'payment_gateway' => $data['payment_gateway'] ?? null,
                'min_credits' => $data['min_credits'] ?? 0,
                'max_credits' => $data['max_credits'] ?? 0,
                'created_by' => auth()->id(),
            ]);

            // 3. Save Fee Structure Rules (scope = admission_head)
            foreach ($data['fees'] as $fee) {
                $feeTypeId = $fee['fee_type_id'] ?? $fee['fee_particular_id'] ?? null;
                $feeType = FeeType::findOrFail($feeTypeId);

                FeeStructureRule::create([
                    'scope_type' => FeeStructureRule::SCOPE_ADMISSION_HEAD,
                    'scope_id'   => $head->id,
                    'fee_type_id' => $feeType->id,
                    'amount'     => $fee['amount'],
                    'fee_slot'   => $fee['category'] ?? null,
                ]);
            }

            // 4. Save Admission Head Papers
            if ($head->allow_subject_paper_selection && !empty($data['admission_head_papers'])) {
                foreach ($data['admission_head_papers'] as $index => $paper) {

                    $finalSortOrder = ($paper['sort_order'] ?? 0) <= 1 ? ($index + 1) : $paper['sort_order'];
                    AdmissionHeadPaper::create([
                        'admission_head_id' => $head->id,
                        'subject_category_id' => $paper['subject_category_id'],
                        'paper_limit' => $paper['paper_limit'] ?? 1,
                        'sort_order' => $finalSortOrder,
                        'is_compulsory' => $paper['is_compulsory'],
                    ]);
                }
            }

            return $head->load(['feeStructures.feeType', 'papers.category']);
        });
    }
    public function updateAdmissionData(int $id, array $data)
    {
        return DB::transaction(function () use ($id, $data) {
            $head = AdmissionHead::findOrFail($id);

            // 1. Basic Fields Update
            $head->update(collect($data)->except(['fees', 'admission_head_papers'])->toArray());

            $applicationFee = ($data['has_application_fees'] ?? false) ? ($data['application_fees'] ?? 0) : 0;
            // 2. Fees Update (Delete and Re-insert as FeeStructureRules)
            if (isset($data['fees'])) {
                $head->feeStructures()->delete();
                $totalFees = 0;

                foreach ($data['fees'] as $fee) {
                    $feeTypeId = $fee['fee_type_id'] ?? $fee['fee_particular_id'] ?? null;
                    $feeType = FeeType::findOrFail($feeTypeId);
                    $totalFees += $fee['amount'];

                    FeeStructureRule::create([
                        'scope_type'  => FeeStructureRule::SCOPE_ADMISSION_HEAD,
                        'scope_id'    => $head->id,
                        'fee_type_id' => $feeType->id,
                        'amount'      => $fee['amount'],
                        'fee_slot'    => $fee['category'] ?? null,
                    ]);
                }
                $head->update(['total_admission_fees' => $totalFees + $applicationFee]);
            }

            // 3. Papers Update (Delete and Re-insert)
            if (isset($data['admission_head_papers'])) {
                $head->papers()->delete();

                foreach ($data['admission_head_papers'] as $index => $paper) {
                    $finalSortOrder = ($paper['sort_order'] ?? 0) <= 1 ? ($index + 1) : $paper['sort_order'];
                    $head->papers()->create([
                        'subject_category_id' => $paper['subject_category_id'],
                        'paper_limit' => $paper['paper_limit'],
                        'sort_order' => $finalSortOrder,
                        'is_compulsory' => $paper['is_compulsory'],
                    ]);
                }
            }

            return $head->load(['feeStructures.feeType', 'papers.category']);
        });
    }


    /**
     * Deep duplicate an Admission Head and its relations
     */
    public function duplicateAdmissionHead(AdmissionHead $originalHead)
    {
        
        $originalHead->load(['feeStructures', 'papers']);

        return DB::transaction(function () use ($originalHead) {
            // 1. Replicate main model
            $newHead = $originalHead->replicate();

            // 2. Customizations for the new copy
            $newHead->title = $originalHead->title . " (Copy) - " . now()->format('d M H:i');
            $newHead->status = 0; // Force to Draft
            $newHead->created_by = auth()->id();
            $newHead->save();

            // 3. Duplicate Fee Structure Rules
            foreach ($originalHead->feeStructures as $rule) {
                FeeStructureRule::create([
                    'scope_type'  => FeeStructureRule::SCOPE_ADMISSION_HEAD,
                    'scope_id'    => $newHead->id,
                    'fee_type_id' => $rule->fee_type_id,
                    'amount'      => $rule->amount,
                    'fee_slot'    => $rule->fee_slot,
                ]);
            }

            // 4. Duplicate Paper Configurations

            if ($originalHead->allow_subject_paper_selection && $originalHead->papers->count() > 0) {
                foreach ($originalHead->papers as $paper) {
                    $newPaper = $paper->replicate();
                    $newPaper->admission_head_id = $newHead->id;
                    $newPaper->save();
                }
            }

            return $newHead->load(['feeStructures.feeType', 'papers.category']);
        });
    }
}
