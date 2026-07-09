<?php

namespace Database\Seeders;

use App\Models\NotificationTemplate;
use Illuminate\Database\Seeder;

/**
 * Seeds all notification templates for every channel.
 *
 * Run: php artisan db:seed --class=NotificationTemplateSeeder
 */
class NotificationTemplateSeeder extends Seeder
{
    /**
     * Notification definitions — one entry per type with per-channel content.
     * Content must EXACTLY match DLT-registered templates for SMS.
     */
    private const TEMPLATES = [
        // ── OTP ──
        [
            'key' => 'AUTH_OTP_VERIFICATION',
            'name' => 'OTP Verification',
            'variables' => [
                ['name' => 'otp', 'description' => '6-digit OTP code'],
            ],
            'channels' => [
                'sms' => [
                    'content' => 'PRADYUMAN login OTP is {otp}. It is valid for 10 minutes. Please do not share it with anyone.',
                    'provider_template_id' => '1707177443150939142',
                ],
                'whatsapp' => [
                    'content' => 'Your OTP is *{otp}*. Valid for 10 minutes. Do not share with anyone.',
                ],
            ],
        ],

        // ── Attendance ──
        [
            'key' => 'attendance_marked',
            'name' => 'Attendance Alert',
            'variables' => [
                ['name' => 'name', 'description' => 'Student name'],
                ['name' => 'status', 'description' => 'PRESENT/ABSENT'],
                ['name' => 'date', 'description' => 'Date string'],
                ['name' => 'class', 'description' => 'Class label e.g. " (Class 10-A)"'],
            ],
            'channels' => [
                'sms' => [
                    'content' => 'Attendance: {name} marked as {status} on {date} Class {class}. PRADYUMAN',
                    'provider_template_id' => '1707177434826890281',
                ],
                'whatsapp' => [
                    'content' => 'Attendance update: {name} has been marked as {status} on {date}{class}.',
                ],
                'push' => [
                    'content' => 'Your attendance for {date} was marked as {status}{class}.',
                    'subject' => 'Attendance recorded',
                ],
                'in_app' => [
                    'content' => 'Your attendance for {date} was marked as {status}{class}.',
                    'subject' => 'Attendance recorded',
                ],
            ],
        ],

        // ── Fee Due ──
        [
            'key' => 'fee_due_reminder',
            'name' => 'Fee Due Reminder',
            'variables' => [
                ['name' => 'amount', 'description' => 'Balance amount formatted'],
                ['name' => 'date', 'description' => 'Due date'],
                ['name' => 'name', 'description' => 'Student name'],
                ['name' => 'period', 'description' => 'Fee period key'],
                ['name' => 'previous_dues', 'description' => 'Arrears before this period'],
                ['name' => 'period_fee', 'description' => 'Scheduled fee for this cycle'],
                ['name' => 'late_fee', 'description' => 'Late fee component'],
                ['name' => 'total_payable', 'description' => 'Total payable for window'],
                ['name' => 'paid_in_period', 'description' => 'Already paid toward period'],
                ['name' => 'discount', 'description' => 'Discount on fee structure'],
            ],
            'channels' => [
                'sms' => [
                    'content' => 'Fee reminder rupees {amount} due on {date} for {name} (Period: {period}). Pay now to avoid late fees. - PRADYUMAN',
                    'provider_template_id' => '1707177425051192781',
                ],
                'whatsapp' => [
                    'content' => 'Fee reminder — {name} | Period {period} | Due {date}. Prev dues ₹{previous_dues} | Period fee ₹{period_fee} | Late ₹{late_fee} | Discount ₹{discount} | Total payable ₹{total_payable} | Paid ₹{paid_in_period} | Balance ₹{amount}.',
                ],
                'email' => [
                    'subject' => 'Fee Due Reminder - {name} ({period})',
                    'content' => "Fee period {period} — due on {date}.\nPrevious dues: ₹{previous_dues}\nPeriod fee: ₹{period_fee}\nLate fee: ₹{late_fee}\nDiscount on structure: ₹{discount}\nTotal payable: ₹{total_payable}\nAlready paid: ₹{paid_in_period}\n**Balance due now: ₹{amount}**\nPlease pay on time to avoid further late fees.",
                ],
                'push' => [
                    'subject' => 'Fee due soon',
                    'content' => '{period}: payable ₹{total_payable}, balance ₹{amount}. Due {date}.',
                ],
                'in_app' => [
                    'subject' => 'Fee due soon',
                    'content' => '{name} — {period} due {date}. Prev ₹{previous_dues} + period ₹{period_fee} + late ₹{late_fee} − disc ₹{discount}. Payable ₹{total_payable}, paid ₹{paid_in_period}, balance ₹{amount}.',
                ],
            ],
        ],

        // ── Fee Overdue ──
        [
            'key' => 'fee_overdue_reminder',
            'name' => 'Fee Overdue Alert',
            'variables' => [
                ['name' => 'amount', 'description' => 'Balance amount formatted'],
                ['name' => 'name', 'description' => 'Student name'],
                ['name' => 'period', 'description' => 'Fee period key'],
                ['name' => 'date', 'description' => 'Due date'],
                ['name' => 'previous_dues', 'description' => 'Arrears before this period'],
                ['name' => 'period_fee', 'description' => 'Scheduled fee for this cycle'],
                ['name' => 'late_fee', 'description' => 'Late fee component'],
                ['name' => 'total_payable', 'description' => 'Total payable for window'],
                ['name' => 'paid_in_period', 'description' => 'Already paid toward period'],
                ['name' => 'discount', 'description' => 'Discount on fee structure'],
            ],
            'channels' => [
                'sms' => [
                    'content' => 'Dear {name}, your fee of Rupees Date {amount} for {period} is overdue. Kindly pay before {date} to prevent penalties. PRADYUMAN',
                    'provider_template_id' => '1707177443310052869',
                ],
                'whatsapp' => [
                    'content' => 'OVERDUE — {name} | {period} (was due {date}). Prev dues ₹{previous_dues} | Period fee ₹{period_fee} | Late ₹{late_fee} | Discount ₹{discount} | Payable ₹{total_payable} | Paid ₹{paid_in_period} | **Balance ₹{amount}**',
                ],
                'email' => [
                    'subject' => 'Fee Overdue - {name} ({period})',
                    'content' => "Your fee for period {period} was due on {date} and is overdue.\nPrevious dues: ₹{previous_dues}\nPeriod fee: ₹{period_fee}\nLate fee: ₹{late_fee}\nDiscount on structure: ₹{discount}\nTotal payable: ₹{total_payable}\nAlready paid: ₹{paid_in_period}\n**Outstanding balance: ₹{amount}**\nPlease pay immediately.",
                ],
                'push' => [
                    'subject' => 'Fee overdue',
                    'content' => '{period} overdue: balance ₹{amount} (payable was ₹{total_payable}).',
                ],
                'in_app' => [
                    'subject' => 'Fee overdue',
                    'content' => '{name} — {period} overdue since {date}. Prev ₹{previous_dues} + period ₹{period_fee} + late ₹{late_fee}. Payable ₹{total_payable}, paid ₹{paid_in_period}, balance ₹{amount}.',
                ],
            ],
        ],

        // ── Admission Submitted ──
        [
            'key' => 'admission_application_submitted',
            'name' => 'Admission Submitted Confirmation',
            'variables' => [
                ['name' => 'type', 'description' => 'admission/re-admission'],
                ['name' => 'app_id', 'description' => 'Application ID'],
            ],
            'channels' => [
                'sms' => [
                    'content' => 'Your {type} admission request {app_id} has been submitted successfully. Track status on your student portal PRADYUMAN',
                    'provider_template_id' => '1707177433171248907',
                ],
                'whatsapp' => [
                    'content' => 'Your {type} application *{app_id}* has been submitted successfully. Track status at your student portal.',
                ],
                'email' => [
                    'subject' => 'Application {app_id} Submitted Successfully',
                    'content' => 'Your {type} application {app_id} has been submitted successfully. You can track its status in your student portal.',
                ],
                'push' => [
                    'subject' => 'Application submitted',
                    'content' => 'Your {type} application {app_id} was submitted successfully.',
                ],
                'in_app' => [
                    'subject' => 'Application submitted',
                    'content' => 'Your {type} application {app_id} has been submitted successfully.',
                ],
            ],
        ],

        // ── Admission Status Changed ──
        [
            'key' => 'admission_status_changed',
            'name' => 'Admission Status Update',
            'variables' => [
                ['name' => 'type', 'description' => 'Admission/Re-admission'],
                ['name' => 'app_id', 'description' => 'Application ID'],
                ['name' => 'status', 'description' => 'APPROVED/REJECTED etc.'],
            ],
            'channels' => [
                'sms' => [
                    'content' => '{type} update: Application {app_id} has been {status}',
                    // TODO: Register this template on the DLT portal and add the ID here.
                    // Without it, Adcrux will return error 118 (Template not found) or
                    // fall back to the global SMS_TEMPLATE_ID causing error 120 (Template not Matched).
                    'provider_template_id' => null,
                ],
                'whatsapp' => [
                    'content' => '{type} update: Application *{app_id}* has been *{status}*.',
                ],
                'email' => [
                    'subject' => 'Application {app_id} - {status}',
                    'content' => 'Your {type} application {app_id} has been {status}.',
                ],
                'push' => [
                    'subject' => 'Application {status}',
                    'content' => 'Your {type} application {app_id} has been {status}.',
                ],
                'in_app' => [
                    'subject' => 'Application update',
                    'content' => 'Your {type} application {app_id} has been {status}.',
                ],
            ],
        ],

        // ── Student Import Welcome ──
        [
            'key' => 'student_import_welcome',
            'name' => 'Student Enrollment Welcome',
            'variables' => [
                ['name' => 'institution', 'description' => 'Institution name'],
                ['name' => 'reg_no', 'description' => 'Registration number'],
                ['name' => 'url', 'description' => 'Login/verification URL'],
            ],
            'channels' => [
                'sms' => [
                    'content' => 'Dear {name}, your enrollment is successful. Reg No: {reg_no}. Please verify your account at {url}. PRADYUMAN',
                    'provider_template_id' => '1707177151587118283',
                ],
                'whatsapp' => [
                    'content' => 'Welcome to *{institution}*! You have been enrolled. Reg No: *{reg_no}*. Please verify your account at {url}',
                ],
                'email' => [
                    'subject' => 'Welcome to {institution} - Enrollment Confirmed',
                    'content' => 'Welcome to {institution}! You have been successfully enrolled. Your Registration Number is {reg_no}. Please verify your account to get started.',
                ],
                'push' => [
                    'subject' => 'Welcome!',
                    'content' => 'Welcome to {institution}! Reg No: {reg_no}. Verify your account to get started.',
                ],
                'in_app' => [
                    'subject' => 'Enrollment confirmed',
                    'content' => 'Welcome to {institution}! You have been enrolled. Reg No: {reg_no}.',
                ],
            ],
        ],

        // ── Password Reset ──
        [
            'key' => 'password_reset',
            'name' => 'Password Reset',
            'variables' => [
                ['name' => 'url', 'description' => 'Password reset URL'],
                ['name' => 'institution', 'description' => 'Institution name'],
            ],
            'channels' => [
                'sms' => [
                    'content' => 'Reset your password at {url}. If you did not request this, ignore this message. {institution}',
                    // TODO: Register this template on the DLT portal and add the ID here.
                    'provider_template_id' => null,
                ],
                'whatsapp' => [
                    'content' => 'Reset your password: {url}. If you did not request this, please ignore.',
                ],
                'email' => [
                    'subject' => 'Reset Your Password',
                    'content' => 'You are receiving this email because we received a password reset request. Reset at: {url}',
                ],
            ],
        ],
    ];

    public function run(): void
    {
        $count = 0;

        foreach (self::TEMPLATES as $template) {
            foreach ($template['channels'] as $channel => $channelData) {
                NotificationTemplate::updateOrCreate(
                    ['key' => $template['key'], 'channel' => $channel],
                    [
                        'name' => $template['name'],
                        'subject' => $channelData['subject'] ?? null,
                        'content' => $channelData['content'],
                        'provider_template_id' => $channelData['provider_template_id'] ?? null,
                        'variables' => $template['variables'],
                        'is_active' => true,
                    ]
                );
                $count++;
            }
        }

        $this->command->info("Seeded {$count} notification templates.");
    }
}
