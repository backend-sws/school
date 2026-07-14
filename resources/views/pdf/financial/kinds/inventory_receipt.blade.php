<div style="margin-top: 10px; margin-bottom: 25px; border-top: 1px solid #e5e7eb; pt-15; padding-top: 15px;">
    <table border="0" cellpadding="0" cellspacing="0" class="w-full">
        <tr>
            <td width="55%" style="vertical-align: top;">
                <div style="margin-bottom: 5px; font-size: 9px; text-transform: uppercase; color: #4b5563; font-weight: bold; letter-spacing: 0.5px;">Billed To</div>
                <div style="font-size: 16px; font-weight: bold; color: #111827; margin-bottom: 4px;">{{ $document->extra['buyer_name'] }}</div>
                <div style="font-size: 10px; color: #4b5563; line-height: 1.5;">
                    Buyer Type: <span class="uppercase font-bold" style="color: #111827;">{{ $document->extra['buyer_type'] }}</span><br>
                    Collected By: <span style="color: #111827; font-weight: 500;">{{ $document->extra['collector_name'] }}</span>
                </div>
            </td>
            <td width="45%" style="vertical-align: top;">
                <div style="background: #f9fafb; padding: 12px 14px; border: 1px solid #e5e7eb; border-radius: 8px;">
                    <table border="0" cellpadding="0" cellspacing="0" class="w-full" style="margin:0;">
                        <tr>
                            <td style="border:none; padding:0; font-size: 9px; text-transform: uppercase; color: #4b5563; font-weight: bold; letter-spacing: 0.5px;">Receipt Date</td>
                            <td style="border:none; padding:0; font-size: 9px; text-transform: uppercase; color: #4b5563; font-weight: bold; letter-spacing: 0.5px;" class="text-right">Payment Status</td>
                        </tr>
                        <tr>
                            <td style="border:none; padding:6px 0 0 0; font-size: 12px; font-weight: bold; color: #111827;">{{ $document->extra['date_display'] }}</td>
                            <td style="border:none; padding:6px 0 0 0; font-size: 12px; font-weight: bold; color: {{ !empty($document->extra['status_paid']) ? '#16a34a' : '#dc2626' }};" class="text-right uppercase">{{ $document->extra['payment_status'] }}</td>
                        </tr>
                    </table>
                </div>
            </td>
        </tr>
    </table>
</div>

<div style="margin-bottom: 25px;">
    <table border="0" cellpadding="8" cellspacing="0" class="w-full" style="border-collapse: collapse; font-size: 10px; border: 1px solid #e5e7eb;">
        <thead>
            <tr style="background: #f3f4f6; border-bottom: 2px solid #d1d5db;">
                <th width="45%" class="text-left" style="font-weight: bold; text-transform: uppercase; color: #374151; font-size: 9px; letter-spacing: 0.5px; padding: 10px;">Item Description</th>
                <th width="20%" class="text-center" style="font-weight: bold; text-transform: uppercase; color: #374151; font-size: 9px; letter-spacing: 0.5px; padding: 10px;">Unit Price</th>
                <th width="15%" class="text-center" style="font-weight: bold; text-transform: uppercase; color: #374151; font-size: 9px; letter-spacing: 0.5px; padding: 10px;">Quantity</th>
                <th width="20%" class="text-right" style="font-weight: bold; text-transform: uppercase; color: #374151; font-size: 9px; letter-spacing: 0.5px; padding: 10px;">Total Amount</th>
            </tr>
        </thead>
        <tbody>
            @foreach($document->extra['line_rows'] as $line)
                <tr style="border-bottom: 1px solid #e5e7eb;">
                    <td style="padding: 10px; text-align: left; font-weight: bold; color: #111827;">
                        {{ $line['name'] }}
                        @if(!empty($line['code']))
                            <div style="font-size: 8px; font-weight: normal; color: #6b7280; margin-top: 3px; letter-spacing: 0.3px;">Item Code: {{ $line['code'] }}</div>
                        @endif
                    </td>
                    <td class="text-center" style="padding: 10px; color: #374151;">{{ $line['rate'] }}</td>
                    <td class="text-center" style="padding: 10px; color: #374151; font-weight: 500;">{{ $line['qty'] }}</td>
                    <td class="text-right font-bold" style="padding: 10px; color: #111827;">{{ $line['amount'] }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div style="margin-top: 20px;">
        <table border="0" cellpadding="0" cellspacing="0" class="w-full">
            <tr>
                <td width="55%" style="vertical-align: top; border:none; padding-right: 25px;">
                    @if(!empty($document->extra['remarks']))
                        <div style="background: #f9fafb; padding: 12px; border-radius: 6px; border: 1px solid #e5e7eb; font-style: italic; color: #4b5563; font-size: 9px; line-height: 1.5;">
                            <div style="font-weight: bold; font-style: normal; margin-bottom: 4px; text-transform: uppercase; color: #111827; letter-spacing: 0.3px;">Remarks / Notes:</div>
                            {{ $document->extra['remarks'] }}
                        </div>
                    @else
                        <div style="font-size: 9px; color: #6b7280; line-height: 1.5; padding: 5px;">
                            <div style="font-weight: bold; margin-bottom: 4px; text-transform: uppercase; color: #111827; letter-spacing: 0.3px;">Declaration & Terms:</div>
                            • This is an electronically generated receipt for stock issues.<br>
                            • Goods once sold or issued cannot be returned without proper authorization.
                        </div>
                    @endif
                </td>
                <td width="45%" style="vertical-align: top; border:none;">
                    <table border="0" cellpadding="0" cellspacing="0" class="w-full" style="margin:0; font-size: 11px; line-height: 1.8;">
                        <tr>
                            <td style="border:none; padding: 4px 0; color: #4b5563;" class="text-right">Subtotal:</td>
                            <td style="border:none; padding: 4px 0; color: #111827;" width="100" class="text-right font-medium">{{ $document->extra['subtotal'] }}</td>
                        </tr>
                        <tr>
                            <td style="border:none; padding: 4px 0; color: #4b5563;" class="text-right">Tax / Discount:</td>
                            <td style="border:none; padding: 4px 0; color: #111827;" class="text-right font-medium">₹0.00</td>
                        </tr>
                        <tr style="font-size: 13px;">
                            <td style="border:none; padding: 8px 0; border-top: 1px solid #d1d5db;" class="text-right font-black">Grand Total:</td>
                            <td style="border:none; padding: 8px 0; border-top: 1px solid #d1d5db; color: #111827;" class="text-right font-black">{{ $document->extra['total'] }}</td>
                        </tr>
                        @if(!empty($document->extra['amount_paid']))
                            <tr style="font-size: 13px;">
                                <td style="border:none; padding: 6px 0; color: #16a34a;" class="text-right font-black uppercase">Amount Paid:</td>
                                <td style="border:none; padding: 6px 0; color: #16a34a; border-bottom: 2px double #16a34a;" class="text-right font-black">{{ $document->extra['amount_paid'] }}</td>
                            </tr>
                        @endif
                    </table>
                </td>
            </tr>
        </table>
    </div>

    <!-- Signatures section at bottom of invoice -->
    <div style="margin-top: 60px; padding-top: 20px; border-top: 1px dashed #d1d5db;">
        <table border="0" cellpadding="0" cellspacing="0" class="w-full" style="font-size: 10px; text-align: center;">
            <tr>
                <td width="33%" style="border:none; vertical-align: bottom;">
                    <div style="width: 120px; margin: 0 auto; border-bottom: 1px solid #9ca3af; height: 1px; margin-bottom: 5px;"></div>
                    <span style="font-weight: bold; color: #4b5563; text-transform: uppercase; font-size: 8px; letter-spacing: 0.5px;">Receiver Signature</span>
                </td>
                <td width="34%" style="border:none; vertical-align: bottom;">
                    <div style="width: 120px; margin: 0 auto; border-bottom: 1px solid #9ca3af; height: 1px; margin-bottom: 5px;"></div>
                    <span style="font-weight: bold; color: #4b5563; text-transform: uppercase; font-size: 8px; letter-spacing: 0.5px;">Issued By / Storekeeper</span>
                </td>
                <td width="33%" style="border:none; vertical-align: bottom;">
                    <div style="width: 120px; margin: 0 auto; border-bottom: 1px solid #9ca3af; height: 1px; margin-bottom: 5px;"></div>
                    <span style="font-weight: bold; color: #4b5563; text-transform: uppercase; font-size: 8px; letter-spacing: 0.5px;">Authorized Signatory</span>
                </td>
            </tr>
        </table>
    </div>
</div>

