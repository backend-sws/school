import React from "react";
import { GraduationCap, Mail, MapPin, User } from "lucide-react";
import Each from "@/components/Each";
import R2Api from "@/lib/api/r2Api";

interface Address {
  address_type: string;
  village_mohalla: string;
  post_office: string;
  police_station: string;
  district: string;
  state: string;
  pincode: string;
}

interface StudentProfileCardProps {
  personalInfo: {
    name: string;
    email: string;
    photo_url?: string;
    father_name: string;
    mother_name: string;
    aadhar_no?: string;
    category: string;
    blood_group?: string;
  };
  academicRecord: {
    university_roll_no?: string;
    roll_no: string;
    reg_no: string;
  };
  addresses: Address[];
  statusLabel?: string;
}

export function StudentProfileCard({
  personalInfo,
  academicRecord,
  addresses,
}: StudentProfileCardProps) {
  const guardianItems = [
    { label: "Father's Name", value: personalInfo.father_name },
    { label: "Mother's Name", value: personalInfo.mother_name },
  ];

  const personalItems = [
    { label: "Aadhar No", value: personalInfo.aadhar_no || "N/A" },
    { label: "Category", value: personalInfo.category },
    { label: "Blood Group", value: personalInfo.blood_group || "N/A" },
  ];

  return (
    <div className="rounded-[2rem] border border-border bg-card p-6 md:p-8 relative overflow-hidden">
      {/* Top Identity */}
      <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
        <div className="relative">
          <div className="h-32 w-32 rounded-3xl border-4 border-background bg-muted overflow-hidden flex items-center justify-center">
            {personalInfo.photo_url ? (
              <img
                src={R2Api.imageSrc(personalInfo.photo_url)}
                alt={personalInfo.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-xl font-semibold text-muted-foreground">
                {personalInfo.name
                  ?.split(" ")
                  .map((part) => part.charAt(0))
                  .join("")
                  .slice(0, 2)
                  .toUpperCase() || "?"}
              </span>
            )}
          </div>
        </div>

        <div className="flex-1 space-y-4">
          {/* Name + email + status pill */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="text-center md:text-left space-y-1">
              <h2 className="text-2xl font-black uppercase tracking-tight text-foreground">
                {personalInfo.name}
              </h2>
              <p className="text-muted-foreground font-medium flex items-center justify-center md:justify-start gap-2">
                <Mail size={14} /> {personalInfo.email}
              </p>
            </div>
            {/** Optional status pill */}
            {academicRecord && (
              <div className="flex justify-center md:justify-end">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/60 px-3 py-1 text-xs font-semibold text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {/** If a specific label is provided, use it; otherwise fall back to generic */}
                  {/** This stays purely presentational and can be wired to real status later */}
                  {/** eslint-disable-next-line react/jsx-no-comment-textnodes */}
                  {/**/}
                  <span>{(academicRecord as any).status_label ?? "Active"}</span>
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-4 border-t border-border/50">
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                University Roll
              </p>
              <p className="font-black text-foreground">
                {academicRecord.university_roll_no || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                College Roll
              </p>
              <p className="font-black text-foreground">
                {academicRecord.roll_no}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Registration No
              </p>
              <p className="font-black text-foreground">
                {academicRecord.reg_no}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom two-column layout inside same card */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Addresses */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <MapPin className="size-4 text-primary" />
            <h3 className="font-bold text-sm uppercase tracking-wider">
              Contact Addresses
            </h3>
          </div>
          {addresses.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No address information available yet.
            </p>
          ) : (
            <div className="space-y-3">
              <Each
                of={addresses}
                keyExtractor={(_, idx) => idx}
                render={(addr: Address) => (
                  <div className="p-3 rounded-2xl bg-muted/30 border border-transparent">
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">
                      {addr.address_type}
                    </p>
                    <p className="text-sm font-medium leading-relaxed">
                      {addr.village_mohalla}, {addr.post_office}
                      <br />
                      {addr.police_station}, {addr.district}, {addr.state} -{" "}
                      {addr.pincode}
                    </p>
                  </div>
                )}
              />
            </div>
          )}
        </div>

        {/* Guardian & Personal */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <User className="size-4 text-primary" />
            <h3 className="font-bold text-sm uppercase tracking-wider">
              Guardian &amp; Personal
            </h3>
          </div>
          <div className="space-y-4">
            {/* Guardians */}
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Guardians
              </p>
              <div className="grid grid-cols-1 gap-3">
                <Each
                  of={guardianItems}
                  keyExtractor={(item, idx) => `${item.label}-${idx}`}
                  render={(item) => (
                    <div className="flex justify-between items-center py-2 border-b border-border/40 last:border-0">
                      <span className="text-xs font-semibold text-muted-foreground uppercase px-2 py-0.5 rounded-full bg-muted/50">
                        {item.label}
                      </span>
                      <span className="text-sm font-bold break-words text-right max-w-[60%]">
                        {item.value}
                      </span>
                    </div>
                  )}
                />
              </div>
            </div>

            {/* Personal details */}
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Personal Details
              </p>
              <div className="grid grid-cols-1 gap-3">
                <Each
                  of={personalItems}
                  keyExtractor={(item, idx) => `${item.label}-${idx}`}
                  render={(item) => (
                    <div className="flex justify-between items-center py-2 border-b border-border/40 last:border-0">
                      <span className="text-xs font-semibold text-muted-foreground uppercase px-2 py-0.5 rounded-full bg-muted/50">
                        {item.label}
                      </span>
                      <span className="text-sm font-bold break-words text-right max-w-[60%]">
                        {item.value}
                      </span>
                    </div>
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Icon */}
      <div className="absolute -bottom-10 -right-10 opacity-[0.03] rotate-12 pointer-events-none">
        <GraduationCap size={240} strokeWidth={1} />
      </div>
    </div>
  );
}

