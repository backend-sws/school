<?php

namespace Database\Seeders;

use App\Models\Hostel;
use App\Models\HostelFloor;
use App\Models\HostelRoom;
use App\Models\HostelMessPlan;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class HostelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $institutionId = \App\Models\Institution::value('id') ?? 1;

        DB::beginTransaction();
        try {
            // 1. Create Hostels
            $boysHostel = Hostel::updateOrCreate([
                'institution_id' => $institutionId,
                'code' => 'KBH',
            ], [
                'name' => 'Kalam Boys Hostel',
                'type' => 'boys',
                'total_capacity' => 100,
                'address' => 'North Campus',
                'description' => 'Main hostel for junior and senior boys.',
                'is_active' => true,
            ]);

            $girlsHostel = Hostel::updateOrCreate([
                'institution_id' => $institutionId,
                'code' => 'SGH',
            ], [
                'name' => 'Sarojini Girls Hostel',
                'type' => 'girls',
                'total_capacity' => 80,
                'address' => 'South Campus',
                'description' => 'Secure accommodation for female students.',
                'is_active' => true,
            ]);

            // 2. Create Floors
            $bFloor1 = HostelFloor::firstOrCreate(['hostel_id' => $boysHostel->id, 'floor_number' => 0], ['name' => 'Ground Floor']);
            $bFloor2 = HostelFloor::firstOrCreate(['hostel_id' => $boysHostel->id, 'floor_number' => 1], ['name' => 'First Floor']);
            
            $gFloor1 = HostelFloor::firstOrCreate(['hostel_id' => $girlsHostel->id, 'floor_number' => 0], ['name' => 'Ground Floor']);

            // 3. Create Rooms
            $rooms = [
                ['institution_id' => $institutionId, 'hostel_id' => $boysHostel->id, 'hostel_floor_id' => $bFloor1->id, 'room_number' => 'B101', 'type' => 'double', 'bed_count' => 2, 'monthly_fee' => 3000],
                ['institution_id' => $institutionId, 'hostel_id' => $boysHostel->id, 'hostel_floor_id' => $bFloor1->id, 'room_number' => 'B102', 'type' => 'triple', 'bed_count' => 3, 'monthly_fee' => 2500],
                ['institution_id' => $institutionId, 'hostel_id' => $boysHostel->id, 'hostel_floor_id' => $bFloor2->id, 'room_number' => 'B201', 'type' => 'single', 'bed_count' => 1, 'monthly_fee' => 5000],
                
                ['institution_id' => $institutionId, 'hostel_id' => $girlsHostel->id, 'hostel_floor_id' => $gFloor1->id, 'room_number' => 'G101', 'type' => 'double', 'bed_count' => 2, 'monthly_fee' => 3200],
                ['institution_id' => $institutionId, 'hostel_id' => $girlsHostel->id, 'hostel_floor_id' => $gFloor1->id, 'room_number' => 'G102', 'type' => 'double', 'bed_count' => 2, 'monthly_fee' => 3200],
            ];

            foreach ($rooms as $room) {
                $r = HostelRoom::firstOrCreate([
                    'institution_id' => $institutionId,
                    'hostel_id' => $room['hostel_id'],
                    'room_number' => $room['room_number']
                ], [
                    'hostel_floor_id' => $room['hostel_floor_id'],
                    'type' => $room['type'],
                    'bed_count' => $room['bed_count'],
                    'monthly_fee' => $room['monthly_fee']
                ]);
                for ($i = 1; $i <= $room['bed_count']; $i++) {
                    \App\Models\HostelBed::firstOrCreate([
                        'hostel_room_id' => $r->id,
                        'bed_label' => "Bed " . chr(64 + $i),
                    ], [
                        'status' => 'vacant'
                    ]);
                }
            }

            // 4. Create Mess Plans
            HostelMessPlan::updateOrCreate([
                'institution_id' => $institutionId,
                'name' => 'Standard Vegetarian Plan',
            ], [
                'type' => 'veg',
                'monthly_fee' => 2500,
                'description' => 'Includes Breakfast, Lunch, Snacks, and Dinner (All Veg).',
                'is_active' => true,
            ]);

            HostelMessPlan::updateOrCreate([
                'institution_id' => $institutionId,
                'name' => 'Premium Mixed Plan',
            ], [
                'type' => 'both',
                'monthly_fee' => 3500,
                'description' => 'Includes all meals with Non-Veg options on Wed/Fri/Sun.',
                'is_active' => true,
            ]);

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
