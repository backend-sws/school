import { Head, Link } from "@inertiajs/react";
import { useQuery } from "@tanstack/react-query";
import { hostelApi, type Hostel } from "@/lib/api/hostelApi";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { HOSTEL_BREADCRUMBS } from "@/constants/page/admin/hostel";
import { Building, DoorOpen, Users, Phone, MapPin, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Each from "@/components/Each";

interface Props {
  id: number;
}

export default function HostelShow({ id }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: ["hostel-hostels", id],
    queryFn: () => hostelApi.hostels.show(id).then(res => res.data as Hostel),
  });

  if (isLoading || !data) {
    return <div className="p-8 text-center text-muted-foreground">Loading hostel details...</div>;
  }

  const breadcrumbs = [
    ...HOSTEL_BREADCRUMBS,
    { title: "Buildings", href: "/hostel/hostels" },
    { title: data.name, href: `/hostel/hostels/${id}` },
  ];

  return (
    <>
      <Head title={`${data.name} | Hostel`} />
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/hostel/hostels"><ArrowLeft className="size-4" /></Link>
          </Button>
          <MainPageHeader
            icon={Building}
            title={data.name}
            subtitle={`Hostel details, floors, and rooms.`}
            breadcrumbs={breadcrumbs}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader className="pb-4">
                <h2 className="text-lg font-semibold">Information</h2>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="capitalize">{data.type}</Badge>
                  {data.code && <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded">{data.code}</span>}
                </div>
                
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-start gap-3">
                    <Users className="w-4 h-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Warden</div>
                      <div className="text-muted-foreground">{data.warden_name || "Unassigned"}</div>
                    </div>
                  </div>
                  {data.warden_contact && (
                    <div className="flex items-start gap-3">
                      <Phone className="w-4 h-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">Contact</div>
                        <div className="text-muted-foreground">{data.warden_contact}</div>
                      </div>
                    </div>
                  )}
                  {data.address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">Address</div>
                        <div className="text-muted-foreground">{data.address}</div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Occupied Beds</span>
                    <span className="font-medium">{data.occupied_beds_count ?? 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Capacity</span>
                    <span className="font-medium">{data.beds_count ?? 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Rooms</span>
                    <span className="font-medium">{data.rooms_count ?? 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <DoorOpen className="w-5 h-5 text-primary" /> Floors & Rooms
                </h2>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/hostel/rooms?hostel_id=${data.id}`}>Manage Rooms</Link>
                </Button>
              </CardHeader>
              <CardContent>
                {!data.floors?.length ? (
                  <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                    No floors or rooms defined yet.<br />
                    Use the 'Rooms' management page to add them.
                  </div>
                ) : (
                  <div className="space-y-6">
                    <Each
                      of={data.floors}
                      render={(floor) => (
                        <div key={floor.id} className="space-y-3">
                          <h3 className="font-medium border-b pb-2 flex justify-between">
                            <span>{floor.name}</span>
                            <span className="text-muted-foreground text-xs font-normal">{floor.rooms?.length || 0} rooms</span>
                          </h3>
                          {!floor.rooms?.length ? (
                            <div className="text-sm text-muted-foreground italic">No rooms on this floor.</div>
                          ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                              <Each
                                of={floor.rooms}
                                render={(room) => (
                                  <div key={room.id} className="border rounded-md p-3 text-center bg-card flex flex-col items-center justify-center relative overflow-hidden group">
                                    <div className="font-semibold text-lg">{room.room_number}</div>
                                    <div className="text-[10px] uppercase text-muted-foreground mb-2">{room.type}</div>
                                    <div className="flex gap-1">
                                      <Each 
                                        of={room.beds || Array.from({length: room.bed_count}).map((_, i) => ({ id: i, status: 'unknown' }))} 
                                        render={(bed: any) => (
                                          <div 
                                            key={bed.id}
                                            title={bed.status}
                                            className={`w-3 h-3 rounded-sm ${bed.status === 'occupied' ? 'bg-primary' : bed.status === 'maintenance' ? 'bg-orange-500' : 'bg-muted-foreground/30 border border-muted-foreground/50'}`} 
                                          />
                                        )}
                                      />
                                    </div>
                                    {/* Occupancy bar at bottom */}
                                    {room.occupied_beds_count !== undefined && (
                                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
                                        <div 
                                          className={`h-full ${room.occupied_beds_count >= room.bed_count ? 'bg-destructive' : 'bg-primary'}`} 
                                          style={{ width: `${Math.min(100, (room.occupied_beds_count / Math.max(1, room.bed_count)) * 100)}%`}}
                                        />
                                      </div>
                                    )}
                                  </div>
                                )}
                              />
                            </div>
                          )}
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
    </>
  );
}
