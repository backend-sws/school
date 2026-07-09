<?php

use App\Models\AdmissionApplication;

$applications = AdmissionApplication::all();
foreach ($applications as $app) {
    if (!is_array($app->fee_breakdown)) continue;
    
    $gross = 0;
    $discount = 0;
    $newBreakdown = [];
    foreach ($app->fee_breakdown as $item) {
        $amt = abs((float) ($item['amount'] ?? 0));
        $isDiscount = ($item['type'] ?? '') === 'discount' || strtolower($item['category'] ?? '') === 'discount';
        if ($isDiscount) {
            $discount += $amt;
            $item['amount'] = $amt; // Save absolute value
        } else {
            $gross += $amt;
            $item['amount'] = $amt;
        }
        $newBreakdown[] = $item;
    }
    
    // Check if transport and hostel were in the fee_breakdown array.
    $hasTransportInBreakdown = collect($newBreakdown)->contains('type', 'transport');
    $hasHostelInBreakdown = collect($newBreakdown)->contains('type', 'hostel');
    
    $net = $gross - $discount;
    $total = $net;
    
    // Add transport/hostel if they are not in the breakdown but exist on the model
    if (!$hasTransportInBreakdown && !empty($app->transport_amount)) $total += $app->transport_amount;
    if (!$hasHostelInBreakdown && !empty($app->hostel_amount)) $total += $app->hostel_amount;
    
    echo "App {$app->id}: DB Amount: {$app->amount}, Computed Gross: $gross, Discount: $discount, Total: $total\n";
    
    $app->amount = $total;
    
    $totalPaid = ($app->cash_amount ?? 0) + ($app->online_amount ?? 0);
    $discountAmount = $app->discount_amount ?? 0;
    $due = max(0, $total - $discountAmount - $totalPaid);
    
    $app->due_amount = $due;
    $app->fee_breakdown = $newBreakdown;
    $app->save();
    echo "Fixed App {$app->id} to Total: $total - Due: $due\n";
}
echo "Done.\n";
