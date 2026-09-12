<?php

namespace App\Http\Controllers\Api\V1\Transport;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\TransportVehicle;
use App\Models\TransportVehicleExpense;
use App\Models\TransportVehicleFuel;
use App\Models\TransportVehicleLog;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TransportVehicleAnalyticsController extends BaseController
{
    public function vehicleAnalytics(Request $request, int $id): JsonResponse
    {
        if (! $request->user()->hasAbility('view_transport_vehicles')) {
            return $this->forbidden('You do not have permission to view vehicle analytics.');
        }

        $vehicle = TransportVehicle::with(['transportRoute:id,name,code', 'transportDriver:id,name,mobile'])->find($id);

        if (! $vehicle) {
            return $this->notFound('Vehicle not found.');
        }

        // Totals
        $totalKm = (float) TransportVehicleLog::where('transport_vehicle_id', $id)->sum('total_km');
        $totalTrips = TransportVehicleLog::where('transport_vehicle_id', $id)->count();

        $fuelStats = TransportVehicleFuel::where('transport_vehicle_id', $id)
            ->selectRaw('SUM(liters) as total_liters, SUM(total_amount) as total_fuel_cost, AVG(calculated_mileage) as avg_tank_mileage')
            ->first();

        $totalFuelLiters = (float) ($fuelStats->total_liters ?? 0);
        $totalFuelCost = (float) ($fuelStats->total_fuel_cost ?? 0);
        $avgTankMileage = (float) ($fuelStats->avg_tank_mileage ?? 0);

        // Overall mileage fallback: totalKm / totalFuelLiters
        $calculatedMileage = $avgTankMileage > 0
            ? round($avgTankMileage, 2)
            : ($totalFuelLiters > 0 && $totalKm > 0 ? round($totalKm / $totalFuelLiters, 2) : null);

        $totalExpenses = (float) TransportVehicleExpense::where('transport_vehicle_id', $id)->sum('amount');

        // Total Running Cost per KM: (Fuel + Expenses) / Total KM
        $totalCost = $totalFuelCost + $totalExpenses;
        $costPerKm = $totalKm > 0 ? round($totalCost / $totalKm, 2) : 0;

        // Compliance status analysis
        $today = Carbon::today();
        $compliance = [
            'insurance' => $this->evaluateDocumentExpiry($vehicle->insurance_expiry_date, $today, $vehicle->insurance_policy_number),
            'puc' => $this->evaluateDocumentExpiry($vehicle->puc_expiry_date, $today),
            'fitness' => $this->evaluateDocumentExpiry($vehicle->fitness_expiry_date, $today),
            'road_tax' => $this->evaluateDocumentExpiry($vehicle->road_tax_expiry_date, $today),
            'permit' => $this->evaluateDocumentExpiry($vehicle->permit_expiry_date, $today),
        ];

        // Monthly trends for the last 6 months
        $monthsTrend = [];
        for ($i = 5; $i >= 0; $i--) {
            $monthDate = Carbon::today()->subMonths($i);
            $startOfMonth = $monthDate->copy()->startOfMonth()->toDateString();
            $endOfMonth = $monthDate->copy()->endOfMonth()->toDateString();
            $monthKey = $monthDate->format('M Y');

            $mKm = (float) TransportVehicleLog::where('transport_vehicle_id', $id)
                ->whereBetween('log_date', [$startOfMonth, $endOfMonth])
                ->sum('total_km');

            $mFuel = TransportVehicleFuel::where('transport_vehicle_id', $id)
                ->whereBetween('fuel_date', [$startOfMonth, $endOfMonth])
                ->selectRaw('SUM(liters) as liters, SUM(total_amount) as cost')
                ->first();

            $mExpense = (float) TransportVehicleExpense::where('transport_vehicle_id', $id)
                ->whereBetween('expense_date', [$startOfMonth, $endOfMonth])
                ->sum('amount');

            $mLiters = (float) ($mFuel->liters ?? 0);
            $mFuelCost = (float) ($mFuel->cost ?? 0);
            $mMileage = ($mLiters > 0 && $mKm > 0) ? round($mKm / $mLiters, 2) : null;

            $monthsTrend[] = [
                'month' => $monthKey,
                'distance_km' => round($mKm, 2),
                'fuel_liters' => round($mLiters, 2),
                'fuel_cost' => round($mFuelCost, 2),
                'maintenance_cost' => round($mExpense, 2),
                'total_cost' => round($mFuelCost + $mExpense, 2),
                'mileage' => $mMileage,
            ];
        }

        // Expense category breakdown
        $expensesByCategory = TransportVehicleExpense::where('transport_vehicle_id', $id)
            ->select('category', DB::raw('SUM(amount) as total_amount'), DB::raw('COUNT(*) as count'))
            ->groupBy('category')
            ->orderByDesc('total_amount')
            ->get()
            ->map(fn ($item) => [
                'category' => $item->category,
                'amount' => (float) $item->total_amount,
                'count' => (int) $item->count,
            ]);

        // Refuel mileage history (last 10)
        $fuelHistory = TransportVehicleFuel::where('transport_vehicle_id', $id)
            ->orderBy('fuel_date', 'desc')
            ->orderBy('id', 'desc')
            ->take(10)
            ->get(['id', 'fuel_date', 'odometer_reading', 'liters', 'rate_per_liter', 'total_amount', 'calculated_mileage', 'is_full_tank']);

        return $this->success([
            'vehicle' => $vehicle,
            'kpis' => [
                'current_odometer' => (float) $vehicle->current_odometer,
                'total_km_run' => round($totalKm, 2),
                'total_trips' => $totalTrips,
                'total_fuel_liters' => round($totalFuelLiters, 2),
                'total_fuel_cost' => round($totalFuelCost, 2),
                'avg_mileage' => $calculatedMileage,
                'total_expenses' => round($totalExpenses, 2),
                'total_cost' => round($totalCost, 2),
                'cost_per_km' => $costPerKm,
            ],
            'compliance' => $compliance,
            'monthly_trends' => $monthsTrend,
            'expense_breakdown' => $expensesByCategory,
            'fuel_history' => $fuelHistory,
        ]);
    }

    public function fleetAnalytics(Request $request): JsonResponse
    {
        if (! $request->user()->hasAbility('view_transport_vehicles')) {
            return $this->forbidden('You do not have permission to view fleet analytics.');
        }

        $totalVehicles = TransportVehicle::count();
        $activeVehicles = TransportVehicle::where('status', 'active')->count();
        $maintenanceVehicles = TransportVehicle::where('status', 'maintenance')->count();

        $startOfMonth = Carbon::today()->startOfMonth()->toDateString();
        $endOfMonth = Carbon::today()->endOfMonth()->toDateString();

        $monthKm = (float) TransportVehicleLog::whereBetween('log_date', [$startOfMonth, $endOfMonth])->sum('total_km');

        $monthFuelStats = TransportVehicleFuel::whereBetween('fuel_date', [$startOfMonth, $endOfMonth])
            ->selectRaw('SUM(liters) as liters, SUM(total_amount) as cost')
            ->first();

        $monthFuelLiters = (float) ($monthFuelStats->liters ?? 0);
        $monthFuelCost = (float) ($monthFuelStats->cost ?? 0);

        $monthExpense = (float) TransportVehicleExpense::whereBetween('expense_date', [$startOfMonth, $endOfMonth])->sum('amount');

        $fleetAvgMileage = ($monthFuelLiters > 0 && $monthKm > 0) ? round($monthKm / $monthFuelLiters, 2) : null;
        $totalMonthCost = $monthFuelCost + $monthExpense;
        $fleetCostPerKm = $monthKm > 0 ? round($totalMonthCost / $monthKm, 2) : null;

        // Document expiry alerts across entire fleet (in next 30 days or expired)
        $today = Carbon::today();
        $thirtyDaysAhead = Carbon::today()->addDays(30);

        $vehicles = TransportVehicle::all();
        $expiringAlerts = [];

        foreach ($vehicles as $v) {
            $docTypes = [
                'Insurance' => $v->insurance_expiry_date,
                'PUC' => $v->puc_expiry_date,
                'Fitness' => $v->fitness_expiry_date,
                'Road Tax' => $v->road_tax_expiry_date,
                'Permit' => $v->permit_expiry_date,
            ];

            foreach ($docTypes as $docName => $expDate) {
                if (! $expDate) {
                    continue;
                }
                $exp = Carbon::parse($expDate);
                if ($exp->isPast()) {
                    $expiringAlerts[] = [
                        'vehicle_id' => $v->id,
                        'registration_number' => $v->registration_number,
                        'document_type' => $docName,
                        'expiry_date' => $exp->toDateString(),
                        'status' => 'expired',
                        'days_diff' => (int) $exp->diffInDays($today, false) * -1,
                    ];
                } elseif ($exp->betweenIncluded($today, $thirtyDaysAhead)) {
                    $expiringAlerts[] = [
                        'vehicle_id' => $v->id,
                        'registration_number' => $v->registration_number,
                        'document_type' => $docName,
                        'expiry_date' => $exp->toDateString(),
                        'status' => 'expiring_soon',
                        'days_diff' => (int) $today->diffInDays($exp),
                    ];
                }
            }
        }

        // Fleet monthly trends (last 6 months)
        $monthlyFleetTrends = [];
        for ($i = 5; $i >= 0; $i--) {
            $mDate = Carbon::today()->subMonths($i);
            $s = $mDate->copy()->startOfMonth()->toDateString();
            $e = $mDate->copy()->endOfMonth()->toDateString();

            $fKm = (float) TransportVehicleLog::whereBetween('log_date', [$s, $e])->sum('total_km');
            $fFuel = (float) TransportVehicleFuel::whereBetween('fuel_date', [$s, $e])->sum('total_amount');
            $fExp = (float) TransportVehicleExpense::whereBetween('expense_date', [$s, $e])->sum('amount');

            $monthlyFleetTrends[] = [
                'month' => $mDate->format('M Y'),
                'distance_km' => round($fKm, 2),
                'fuel_cost' => round($fFuel, 2),
                'maintenance_cost' => round($fExp, 2),
                'total_cost' => round($fFuel + $fExp, 2),
            ];
        }

        // Top running vehicles
        $topVehiclesByKm = TransportVehicleLog::select('transport_vehicle_id', DB::raw('SUM(total_km) as total_km'))
            ->groupBy('transport_vehicle_id')
            ->orderByDesc('total_km')
            ->take(5)
            ->with('transportVehicle:id,registration_number,vehicle_type')
            ->get()
            ->map(fn ($r) => [
                'vehicle_id' => $r->transport_vehicle_id,
                'registration_number' => $r->transportVehicle?->registration_number ?? 'Unknown',
                'total_km' => round((float) $r->total_km, 2),
            ]);

        return $this->success([
            'kpis' => [
                'total_vehicles' => $totalVehicles,
                'active_vehicles' => $activeVehicles,
                'maintenance_vehicles' => $maintenanceVehicles,
                'month_km' => round($monthKm, 2),
                'month_fuel_liters' => round($monthFuelLiters, 2),
                'month_fuel_cost' => round($monthFuelCost, 2),
                'month_expense' => round($monthExpense, 2),
                'month_total_cost' => round($totalMonthCost, 2),
                'fleet_avg_mileage' => $fleetAvgMileage,
                'fleet_cost_per_km' => $fleetCostPerKm,
            ],
            'expiry_alerts' => $expiringAlerts,
            'monthly_trends' => $monthlyFleetTrends,
            'top_vehicles_by_km' => $topVehiclesByKm,
        ]);
    }

    private function evaluateDocumentExpiry(?Carbon $date, Carbon $today, ?string $docNumber = null): array
    {
        if (! $date) {
            return [
                'date' => null,
                'status' => 'not_set',
                'status_label' => 'Not Set',
                'days_left' => null,
                'number' => $docNumber,
            ];
        }

        $days = (int) $today->diffInDays($date, false);

        if ($days < 0) {
            return [
                'date' => $date->toDateString(),
                'status' => 'expired',
                'status_label' => 'Expired ' . abs($days) . ' days ago',
                'days_left' => $days,
                'number' => $docNumber,
            ];
        }

        if ($days <= 30) {
            return [
                'date' => $date->toDateString(),
                'status' => 'expiring_soon',
                'status_label' => "Expiring in {$days} days",
                'days_left' => $days,
                'number' => $docNumber,
            ];
        }

        return [
            'date' => $date->toDateString(),
            'status' => 'valid',
            'status_label' => 'Valid',
            'days_left' => $days,
            'number' => $docNumber,
        ];
    }

    public function vehicleAuditLogs(Request $request, int $id): JsonResponse
    {
        if (! $request->user()->hasAbility('view_transport_vehicles')) {
            return $this->forbidden('You do not have permission to view vehicle audit logs.');
        }

        $logIds = TransportVehicleLog::where('transport_vehicle_id', $id)->pluck('id');
        $fuelIds = TransportVehicleFuel::where('transport_vehicle_id', $id)->pluck('id');
        $expenseIds = TransportVehicleExpense::where('transport_vehicle_id', $id)->pluck('id');

        $audits = \App\Models\AuditLog::with('user:id,name,email')
            ->where(function ($q) use ($id, $logIds, $fuelIds, $expenseIds) {
                $q->where(function ($q1) use ($id) {
                    $q1->where('entity_type', 'TransportVehicle')->where('entity_id', $id);
                })
                ->orWhere(function ($q2) use ($logIds) {
                    $q2->where('entity_type', 'TransportVehicleLog')->whereIn('entity_id', $logIds);
                })
                ->orWhere(function ($q3) use ($fuelIds) {
                    $q3->where('entity_type', 'TransportVehicleFuel')->whereIn('entity_id', $fuelIds);
                })
                ->orWhere(function ($q4) use ($expenseIds) {
                    $q4->where('entity_type', 'TransportVehicleExpense')->whereIn('entity_id', $expenseIds);
                });
            })
            ->orderBy('id', 'desc')
            ->take(50)
            ->get();

        return $this->success($audits);
    }

    public function fleetAuditLogs(Request $request): JsonResponse
    {
        if (! $request->user()->hasAbility('view_transport_vehicles')) {
            return $this->forbidden('You do not have permission to view fleet audit logs.');
        }

        $audits = \App\Models\AuditLog::with('user:id,name,email')
            ->whereIn('entity_type', [
                'TransportVehicle',
                'TransportVehicleLog',
                'TransportVehicleFuel',
                'TransportVehicleExpense',
            ])
            ->orderBy('id', 'desc')
            ->take(100)
            ->get();

        return $this->success($audits);
    }
}
