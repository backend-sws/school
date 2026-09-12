import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import gateSecurityApi from "@/lib/api/gateSecurityApi";
import axios from "axios";
import {
  UserCheck,
  User,
  Phone,
  Car,
  ShieldCheck,
  Camera,
  Upload,
  Sparkles,
  Building,
  GraduationCap,
  Briefcase,
  Layers,
  FileText,
  Clock,
  Check,
  X,
  Search,
} from "lucide-react";

export interface GatePassDialogProps {
  open: boolean;
  onClose: (refresh?: boolean) => void;
  passData?: any | null; // For editing
}

const VISITOR_TYPES = [
  { value: "parent", label: "Parent / Guardian", icon: UserCheck },
  { value: "vendor", label: "Vendor / Supplier", icon: Briefcase },
  { value: "guest", label: "Guest / Relative", icon: User },
  { value: "contractor", label: "Contractor / Worker", icon: Layers },
  { value: "delivery", label: "Delivery / Courier", icon: Building },
  { value: "alumni", label: "Alumni / Former Student", icon: GraduationCap },
  { value: "official", label: "Official / Inspector", icon: ShieldCheck },
  { value: "other", label: "Other Visitor", icon: User },
];

const ID_TYPES = [
  { value: "aadhaar", label: "Aadhaar Card" },
  { value: "driving_license", label: "Driving License" },
  { value: "voter_id", label: "Voter ID" },
  { value: "pan", label: "PAN Card" },
  { value: "parent_id", label: "School Parent ID" },
  { value: "passport", label: "Passport" },
  { value: "office_id", label: "Official / Company ID" },
  { value: "other", label: "Other Valid ID" },
];

const VEHICLE_TYPES = [
  { value: "none", label: "No Vehicle (Walk-in)" },
  { value: "2-wheeler", label: "Two Wheeler (Bike/Scooter)" },
  { value: "4-wheeler", label: "Four Wheeler (Car/SUV)" },
  { value: "auto", label: "Auto Rickshaw" },
  { value: "truck", label: "Commercial / Van / Truck" },
  { value: "cycle", label: "Bicycle" },
];

const QUICK_PURPOSES = [
  "Parent Teacher Meeting",
  "Fee Submission",
  "Meet Principal",
  "Meet Class Teacher",
  "Admissions Inquiry",
  "Document Collection",
  "Vendor Delivery",
  "Maintenance Work",
  "Official Inspection",
  "Student Pickup",
];

export function GatePassDialog({ open, onClose, passData }: GatePassDialogProps) {
  const isEdit = Boolean(passData?.id);

  // Form states
  const [visitorName, setVisitorName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [visitorType, setVisitorType] = useState("parent");
  const [accompanyingCount, setAccompanyingCount] = useState("0");
  const [address, setAddress] = useState("");

  const [idProofType, setIdProofType] = useState("aadhaar");
  const [idProofNumber, setIdProofNumber] = useState("");

  // Host category
  const [hostType, setHostType] = useState<"staff" | "student" | "general">("staff");
  const [staffId, setStaffId] = useState<string>("");
  const [studentName, setStudentName] = useState("");
  const [purpose, setPurpose] = useState("");

  // Gate & Vehicle
  const [gateName, setGateName] = useState("Main Gate");
  const [vehicleType, setVehicleType] = useState("none");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [belongingsDeclared, setBelongingsDeclared] = useState("");
  const [notes, setNotes] = useState("");

  // Files
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [docFile, setDocFile] = useState<File | null>(null);

  // Staff list for dropdown
  const [staffList, setStaffList] = useState<Array<{ id: number; name: string; email?: string }>>([]);
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [staffSearchQuery, setStaffSearchQuery] = useState("");

  // State flags
  const [submitting, setSubmitting] = useState(false);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [autoFilledName, setAutoFilledName] = useState<string | null>(null);

  // Load staff list
  useEffect(() => {
    if (open) {
      setLoadingStaff(true);
      axios
        .get("/api/v1/staff?per_page=200")
        .then((res) => {
          const list = res.data?.data || [];
          setStaffList(
            list.map((s: any) => ({
              id: s.id,
              name: s.name || s.full_name || `Staff #${s.id}`,
              email: s.email,
            }))
          );
        })
        .catch((err) => console.error("Error loading staff:", err))
        .finally(() => setLoadingStaff(false));
    }
  }, [open]);

  // Populate on edit or reset on create
  useEffect(() => {
    if (open) {
      if (passData) {
        setVisitorName(passData.visitor_name || "");
        setPhone(passData.phone || "");
        setEmail(passData.email || "");
        setVisitorType(passData.visitor_type || "parent");
        setAccompanyingCount(String(passData.accompanying_count ?? 0));
        setAddress(passData.address || "");
        setIdProofType(passData.id_proof_type || "aadhaar");
        setIdProofNumber(passData.id_proof_number || "");
        setPurpose(passData.purpose || "");
        setGateName(passData.gate_name || "Main Gate");
        setVehicleType(passData.vehicle_type || "none");
        setVehicleNumber(passData.vehicle_number || "");
        setBelongingsDeclared(passData.belongings_declared || "");
        setNotes(passData.notes || "");
        setPhotoPreview(passData.photo_url || null);
        setPhotoFile(null);
        setDocFile(null);

        if (passData.staff_id) {
          setHostType("staff");
          setStaffId(String(passData.staff_id));
        } else if (passData.student_name) {
          setHostType("student");
          setStudentName(passData.student_name);
        } else {
          setHostType("general");
        }
        setAutoFilledName(null);
      } else {
        // Reset
        setVisitorName("");
        setPhone("");
        setEmail("");
        setVisitorType("parent");
        setAccompanyingCount("0");
        setAddress("");
        setIdProofType("aadhaar");
        setIdProofNumber("");
        setPurpose("");
        setGateName("Main Gate");
        setVehicleType("none");
        setVehicleNumber("");
        setBelongingsDeclared("");
        setNotes("");
        setPhotoPreview(null);
        setPhotoFile(null);
        setDocFile(null);
        setHostType("staff");
        setStaffId("");
        setStudentName("");
        setAutoFilledName(null);
      }
    }
  }, [open, passData]);

  // Phone lookup auto-fill
  const handlePhoneLookup = async (phoneNum?: string) => {
    const targetPhone = (phoneNum ?? phone).trim();
    if (targetPhone.length < 10) return;

    try {
      setIsLookingUp(true);
      const res: any = await gateSecurityApi.passes.lookup(targetPhone);
      const data = res?.data ?? res;
      if (data) {
        if (!visitorName || visitorName === data.visitor_name) {
          setVisitorName(data.visitor_name || "");
        }
        if (data.visitor_type) setVisitorType(data.visitor_type);
        if (data.id_proof_type) setIdProofType(data.id_proof_type);
        if (data.id_proof_number) setIdProofNumber(data.id_proof_number);
        if (data.address) setAddress(data.address);
        if (data.vehicle_type) setVehicleType(data.vehicle_type);
        if (data.vehicle_number) setVehicleNumber(data.vehicle_number);
        if (data.photo_url && !photoPreview) setPhotoPreview(data.photo_url);

        setAutoFilledName(data.visitor_name);
        toast.info(`Auto-filled details for returning visitor: ${data.visitor_name}`);
      }
    } catch (e) {
      // Not found or network error, silently ignore
    } finally {
      setIsLookingUp(false);
    }
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Photo size should be less than 5MB");
        return;
      }
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!visitorName.trim()) {
      toast.error("Please enter visitor name");
      return;
    }
    if (!phone.trim()) {
      toast.error("Please enter visitor phone number");
      return;
    }
    if (!purpose.trim()) {
      toast.error("Please enter purpose of visit");
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("visitor_name", visitorName.trim());
      formData.append("phone", phone.trim());
      if (email.trim()) formData.append("email", email.trim());
      formData.append("visitor_type", visitorType);
      formData.append("accompanying_count", accompanyingCount || "0");
      if (address.trim()) formData.append("address", address.trim());

      if (idProofType) formData.append("id_proof_type", idProofType);
      if (idProofNumber.trim()) formData.append("id_proof_number", idProofNumber.trim());

      // Host details
      if (hostType === "staff" && staffId) {
        formData.append("staff_id", staffId);
      } else if (hostType === "student" && studentName.trim()) {
        formData.append("student_name", studentName.trim());
      }

      formData.append("purpose", purpose.trim());
      formData.append("gate_name", gateName || "Main Gate");
      if (vehicleType) formData.append("vehicle_type", vehicleType);
      if (vehicleNumber.trim()) formData.append("vehicle_number", vehicleNumber.trim().toUpperCase());
      if (belongingsDeclared.trim()) formData.append("belongings_declared", belongingsDeclared.trim());
      if (notes.trim()) formData.append("notes", notes.trim());

      if (photoFile) {
        formData.append("photo", photoFile);
      }
      if (docFile) {
        formData.append("id_proof_document", docFile);
      }

      if (isEdit) {
        await gateSecurityApi.passes.update(passData.id, formData);
        toast.success("Visitor gate pass updated successfully");
      } else {
        const res: any = await gateSecurityApi.passes.store(formData);
        const newPass = res?.data ?? res;
        toast.success(
          `Gate Pass Generated: ${newPass?.pass_number || "Success"} for ${visitorName}`
        );
      }

      onClose(true);
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || "Failed to save visitor pass";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredStaff = staffList.filter((s) =>
    s.name.toLowerCase().includes(staffSearchQuery.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose(false)}>
      <DialogContent className="sm:max-w-[760px] max-h-[90vh] overflow-y-auto p-0 gap-0 border-border/80 shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white p-6 rounded-t-lg relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                {isEdit ? "Edit Visitor Gate Pass" : "New Visitor Entry (Check-In)"}
                {!isEdit && (
                  <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-emerald-400/30 text-emerald-100 border border-emerald-300/40">
                    Live Guard Register
                  </span>
                )}
              </DialogTitle>
              <DialogDescription className="text-emerald-100/90 text-xs mt-1">
                Record campus gate entry, identity verification, vehicle details, and host info.
              </DialogDescription>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Quick Returning Visitor Alert */}
          {autoFilledName && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-200">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>
                  Returning visitor profile identified for <strong>{autoFilledName}</strong>. Details auto-populated.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setAutoFilledName(null)}
                className="text-emerald-600 hover:text-emerald-800 dark:hover:text-emerald-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Section 1: Visitor Primary Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-1 border-b border-border/60">
              <User className="w-4 h-4 text-primary" />
              <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground/80">
                Visitor Details
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Photo Box */}
              <div className="md:col-span-3 flex flex-col items-center justify-center p-3 border-2 border-dashed rounded-xl border-border/80 bg-muted/20 text-center relative group">
                {photoPreview ? (
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-border shadow-sm">
                    <img
                      src={photoPreview}
                      alt="Visitor Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPhotoPreview(null);
                        setPhotoFile(null);
                      }}
                      className="absolute top-1 right-1 bg-black/60 hover:bg-black/90 text-white rounded-full p-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="visitor-photo"
                    className="cursor-pointer flex flex-col items-center justify-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                      <Camera className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-medium">Add Photo</span>
                    <span className="text-[9px] text-muted-foreground">JPG/PNG &lt; 5MB</span>
                  </label>
                )}
                <input
                  id="visitor-photo"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handlePhotoSelect}
                />
              </div>

              {/* Phone & Name Fields */}
              <div className="md:col-span-9 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Phone with Auto-Lookup */}
                  <div>
                    <Label className="text-xs font-semibold flex items-center justify-between">
                      <span>Phone Number *</span>
                      {isLookingUp && (
                        <span className="text-[10px] text-emerald-600 animate-pulse">
                          Checking history...
                        </span>
                      )}
                    </Label>
                    <div className="relative mt-1">
                      <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="tel"
                        value={phone}
                        onChange={(e) => {
                          const val = e.target.value;
                          setPhone(val);
                          if (val.length === 10) {
                            handlePhoneLookup(val);
                          }
                        }}
                        onBlur={() => handlePhoneLookup()}
                        placeholder="10-digit mobile number"
                        className="pl-9 pr-8"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => handlePhoneLookup()}
                        title="Lookup phone history"
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Search className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Full Name */}
                  <div>
                    <Label className="text-xs font-semibold">Visitor Full Name *</Label>
                    <div className="relative mt-1">
                      <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        value={visitorName}
                        onChange={(e) => setVisitorName(e.target.value)}
                        placeholder="e.g. Rajesh Kumar"
                        className="pl-9"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Visitor Type */}
                  <div>
                    <Label className="text-xs font-semibold">Visitor Type</Label>
                    <Select value={visitorType} onValueChange={setVisitorType}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {VISITOR_TYPES.map((t) => (
                          <SelectItem key={t.value} value={t.value}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Accompanying Persons */}
                  <div>
                    <Label className="text-xs font-semibold">Accompanying Persons</Label>
                    <Input
                      type="number"
                      min="0"
                      max="50"
                      value={accompanyingCount}
                      onChange={(e) => setAccompanyingCount(e.target.value)}
                      placeholder="0 (coming alone)"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Address & Email row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <Label className="text-xs font-semibold">Address / Company / City</Label>
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Hazratganj, Lucknow / ABC Supplies"
                  className="mt-1 text-xs"
                />
              </div>
              <div>
                <Label className="text-xs font-semibold">Email Address (Optional)</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. visitor@example.com"
                  className="mt-1 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 2: ID Verification */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-1 border-b border-border/60">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground/80">
                Identity Verification
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <Label className="text-xs font-semibold">ID Proof Type</Label>
                <Select value={idProofType} onValueChange={setIdProofType}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select ID" />
                  </SelectTrigger>
                  <SelectContent>
                    {ID_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs font-semibold">ID Proof Number</Label>
                <Input
                  value={idProofNumber}
                  onChange={(e) => setIdProofNumber(e.target.value)}
                  placeholder="e.g. XXXX-XXXX-1234"
                  className="mt-1 text-xs font-mono"
                />
              </div>

              <div>
                <Label className="text-xs font-semibold">ID Document / Card (Optional)</Label>
                <div className="relative mt-1">
                  <Input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => setDocFile(e.target.files?.[0] || null)}
                    className="text-xs file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-primary/10 file:text-primary"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Whom to Meet & Purpose */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-1 border-b border-border/60">
              <Building className="w-4 h-4 text-primary" />
              <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground/80">
                Whom to Meet & Purpose
              </h4>
            </div>

            {/* Host Type Selector Buttons */}
            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant={hostType === "staff" ? "default" : "outline"}
                onClick={() => setHostType("staff")}
                className="h-8 text-xs gap-1.5"
              >
                <UserCheck className="w-3.5 h-3.5" />
                Staff / Teacher
              </Button>
              <Button
                type="button"
                size="sm"
                variant={hostType === "student" ? "default" : "outline"}
                onClick={() => setHostType("student")}
                className="h-8 text-xs gap-1.5"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                Student / Ward
              </Button>
              <Button
                type="button"
                size="sm"
                variant={hostType === "general" ? "default" : "outline"}
                onClick={() => setHostType("general")}
                className="h-8 text-xs gap-1.5"
              >
                <Building className="w-3.5 h-3.5" />
                Office / Department
              </Button>
            </div>

            {/* Host Field based on selection */}
            {hostType === "staff" && (
              <div>
                <Label className="text-xs font-semibold">Select Staff Member</Label>
                <div className="space-y-1.5 mt-1">
                  <Select value={staffId} onValueChange={setStaffId}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={loadingStaff ? "Loading staff members..." : "Choose staff member to meet"} />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      <div className="p-2 sticky top-0 bg-popover z-10">
                        <Input
                          placeholder="Search staff by name..."
                          value={staffSearchQuery}
                          onChange={(e) => setStaffSearchQuery(e.target.value)}
                          className="h-8 text-xs"
                        />
                      </div>
                      {filteredStaff.length === 0 ? (
                        <div className="p-2 text-xs text-muted-foreground text-center">
                          No staff found
                        </div>
                      ) : (
                        filteredStaff.map((s) => (
                          <SelectItem key={s.id} value={String(s.id)}>
                            {s.name} {s.email ? `(${s.email})` : ""}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {hostType === "student" && (
              <div>
                <Label className="text-xs font-semibold">Student Name & Class / Roll No</Label>
                <Input
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. Aarav Sharma (Class 8-B, Roll 14)"
                  className="mt-1 text-xs"
                />
              </div>
            )}

            {/* Purpose with quick pills */}
            <div>
              <Label className="text-xs font-semibold">Purpose of Visit *</Label>
              <Input
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="e.g. Fee Payment, Parent Meeting, Delivery"
                className="mt-1 text-xs"
                required
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {QUICK_PURPOSES.map((qp) => (
                  <button
                    key={qp}
                    type="button"
                    onClick={() => setPurpose(qp)}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-secondary hover:bg-primary/20 hover:text-primary transition-colors border border-border/60 text-muted-foreground font-medium"
                  >
                    + {qp}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 4: Gate, Vehicle & Belongings */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-1 border-b border-border/60">
              <Car className="w-4 h-4 text-primary" />
              <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground/80">
                Gate & Vehicle Details
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <Label className="text-xs font-semibold">Gate Name</Label>
                <Select value={gateName} onValueChange={setGateName}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Gate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Main Gate">Main Gate (Gate 1)</SelectItem>
                    <SelectItem value="Gate 2 (East)">Gate 2 (East)</SelectItem>
                    <SelectItem value="Gate 3 (Back)">Gate 3 (Back)</SelectItem>
                    <SelectItem value="Admin Gate">Admin Gate</SelectItem>
                    <SelectItem value="Hostel Gate">Hostel Gate</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs font-semibold">Vehicle Type</Label>
                <Select value={vehicleType} onValueChange={setVehicleType}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Vehicle Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {VEHICLE_TYPES.map((v) => (
                      <SelectItem key={v.value} value={v.value}>
                        {v.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs font-semibold">Vehicle Reg. Number</Label>
                <Input
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                  placeholder={vehicleType === "none" ? "N/A" : "e.g. UP 32 AB 1234"}
                  disabled={vehicleType === "none"}
                  className="mt-1 text-xs font-mono uppercase"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold">Belongings / Items Declared</Label>
                <Input
                  value={belongingsDeclared}
                  onChange={(e) => setBelongingsDeclared(e.target.value)}
                  placeholder="e.g. Laptop, Tool kit, Samples box, Handbag"
                  className="mt-1 text-xs"
                />
              </div>

              <div>
                <Label className="text-xs font-semibold">Guard Remarks / Internal Notes</Label>
                <Input
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Special instructions or guard observations"
                  className="mt-1 text-xs"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="pt-3 border-t border-border flex items-center justify-between sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => onClose(false)}
              disabled={submitting}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-2 min-w-[140px]"
            >
              {submitting ? (
                <>Saving Entry...</>
              ) : isEdit ? (
                <>Update Visitor Pass</>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Issue Gate Pass
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default GatePassDialog;
