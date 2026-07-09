import { Head, Link } from "@inertiajs/react";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FilterBar } from "@/components/filter-bar";
import { Building, DoorOpen, UserCheck, MessageSquare, Utensils, BarChart3, ArrowRight } from "lucide-react";
import { HOSTEL_BREADCRUMBS, HOSTEL_GUIDELINES, HOSTEL_TIP } from "@/constants/page/admin/hostel";
import Each from "@/components/Each";
import { useQuery } from "@tanstack/react-query";
import { hostelApi } from "@/lib/api/hostelApi";
import { useRegisterGuide } from '@/components/GuideProvider';
import { HOSTEL_OVERVIEW_GUIDE } from "@/constants/guides/hostel";
import React, { useMemo, useState } from "react";

type HostelLink = {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
};

type HostelOccupancy = {
  id: number;
  name: string;
  code?: string | null;
  type: string;
  capacity: number;
  occupied: number;
  vacant: number;
  occupancy_pct: number;
};

type SummaryStats = {
  total_hostels: number;
  total_rooms: number;
  total_capacity: number;
  occupied_beds: number;
  maintenance_beds: number;
  vacant_beds: number;
  occupancy_rate: number;
};

const setupLinks: HostelLink[] = [
  { title: "Buildings", href: "/hostel/hostels", icon: Building, description: "Define hostel buildings, types, and wardens." },
  { title: "Rooms", href: "/hostel/rooms", icon: DoorOpen, description: "Create rooms and set bed capacity for each." },
  { title: "Mess Plans", href: "/hostel/mess-plans", icon: Utensils, description: "Manage dining options and schedules." },
];

const assignmentLinks: HostelLink[] = [
  { title: "Allocations", href: "/hostel/allocations", icon: UserCheck, description: "Allocate students to beds." },
  { title: "Complaints", href: "/hostel/complaints", icon: MessageSquare, description: "Track and resolve maintenance issues." },
];

const HostelIndex = () => {
  useRegisterGuide(HOSTEL_OVERVIEW_GUIDE);

  const { data: summaryData, isLoading: isLoadingSummary } = useQuery({
    queryKey: ["hostel-summary"],
    queryFn: () => hostelApi.reports.summary().then((res) => res.data as SummaryStats),
  });

  const { data: occupancyData, isLoading: isLoadingOccupancy } = useQuery({
    queryKey: ["hostel-occupancy"],
    queryFn: () => hostelApi.reports.occupancy().then((res) => res.data.hostels as HostelOccupancy[]),
  });

  return (
    <div className="flex flex-col h-full bg-background">
      <Head title="Hostel Management" />
      <MainPageHeader
        title="Hostel Management"
        breadcrumbs={HOSTEL_BREADCRUMBS}
        guidelines={HOSTEL_GUIDELINES}
        tip={HOSTEL_TIP}
        guideId="hostel-overview"
      />

      <div className="flex-1 overflow-auto p-4 md:p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="flex flex-col items-center justify-center p-6 text-center space-y-2">
            <Building className="w-8 h-8 text-primary" />
            <div className="text-3xl font-bold">{isLoadingSummary ? "..." : summaryData?.total_hostels || 0}</div>
            <div className="text-sm text-muted-foreground">Hostels</div>
          </Card>
          <Card className="flex flex-col items-center justify-center p-6 text-center space-y-2">
            <DoorOpen className="w-8 h-8 text-blue-500" />
            <div className="text-3xl font-bold">{isLoadingSummary ? "..." : summaryData?.total_rooms || 0}</div>
            <div className="text-sm text-muted-foreground">Total Rooms</div>
          </Card>
          <Card className="flex flex-col items-center justify-center p-6 text-center space-y-2">
            <UserCheck className="w-8 h-8 text-green-500" />
            <div className="text-3xl font-bold">
              {isLoadingSummary ? "..." : `${summaryData?.occupied_beds || 0} / ${summaryData?.total_capacity || 0}`}
            </div>
            <div className="text-sm text-muted-foreground">Beds Occupied</div>
          </Card>
          <Card className="flex flex-col items-center justify-center p-6 text-center space-y-2">
            <BarChart3 className="w-8 h-8 text-orange-500" />
            <div className="text-3xl font-bold">{isLoadingSummary ? "..." : `${summaryData?.occupancy_rate || 0}%`}</div>
            <div className="text-sm text-muted-foreground">Overall Occupancy</div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card id="hostel-setup-card">
              <CardHeader className="pb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Building className="w-5 h-5 text-primary" /> Setup & Configuration
                </h2>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Each
                  of={setupLinks}
                  render={(link) => (
                    <Link
                      href={link.href}
                      className="group flex flex-col items-start gap-3 p-4 rounded-lg border bg-card hover:bg-accent hover:border-accent-foreground/20 transition-all text-left"
                    >
                      <div className="p-2 rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <link.icon className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium">{link.title}</div>
                        <p className="text-xs text-muted-foreground leading-snug">{link.description}</p>
                      </div>
                    </Link>
                  )}
                />
              </CardContent>
            </Card>

            <Card id="hostel-allocations-card">
              <CardHeader className="pb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-primary" /> Student Assignments & Operations
                </h2>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Each
                  of={assignmentLinks}
                  render={(link) => (
                    <Link
                      href={link.href}
                      className="group flex flex-col items-start gap-3 p-4 rounded-lg border bg-card hover:bg-accent hover:border-accent-foreground/20 transition-all text-left"
                    >
                      <div className="p-2 rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <link.icon className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium">{link.title}</div>
                        <p className="text-xs text-muted-foreground leading-snug">{link.description}</p>
                      </div>
                    </Link>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="flex flex-col h-full">
              <CardHeader className="pb-0 border-b p-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-primary" /> Live Occupancy
                  </h2>
                </div>
              </CardHeader>
              <CardContent className="p-0 flex-1 overflow-auto bg-muted/20">
                {isLoadingOccupancy ? (
                  <div className="p-8 text-center text-muted-foreground">Loading occupancy...</div>
                ) : !occupancyData?.length ? (
                  <div className="p-8 text-center text-muted-foreground bg-background rounded-lg border border-dashed m-4">
                    <DoorOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No hostels found.</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    <Each
                      of={occupancyData}
                      render={(h) => (
                        <div className="p-4 hover:bg-muted/50 transition-colors flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="font-medium flex items-center gap-2">
                              {h.name}
                              <span className="text-[10px] uppercase bg-primary/10 text-primary px-1.5 py-0.5 rounded-sm">
                                {h.type}
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {h.capacity > 0 ? (
                                <span>{h.occupied} occupied • {h.vacant} vacant • {h.capacity} beds</span>
                              ) : (
                                <span>No beds configured</span>
                              )}
                            </div>
                          </div>
                          <div className="text-right flex flex-col items-end gap-1 min-w-[80px]">
                            <div className="font-bold text-lg">{h.occupancy_pct}%</div>
                            <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full ${h.occupancy_pct >= 90 ? 'bg-destructive' : h.occupancy_pct >= 75 ? 'bg-orange-500' : 'bg-green-500'}`}
                                style={{ width: `${Math.min(100, h.occupancy_pct)}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostelIndex;
