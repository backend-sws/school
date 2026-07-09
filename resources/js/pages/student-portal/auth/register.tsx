import { Head, router } from "@inertiajs/react";
import { useState } from "react";

import AuthLayout from "@/layouts/auth-layout";
import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import AuthApi from "@/lib/api/student/AuthApi";
import {
  useCollegePublicStreams,
  useCollegeStreams,
} from "@/hooks/useCollegeStreams";
import {
  useCollegePublicSessions,
  useCollegeSessions,
} from "@/hooks/useCollegeSessions";
import Each from '@/components/Each';

export default function StudentRegister() {
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [appNo, setAppNo] = useState("");
  const [appData, setAppData] = useState<any>(null);

  const [form, setForm] = useState({
    otp: "",
    password: "",
    password_confirmation: "",
    stream_id: "",
    session_id: "",
  });

  /* ----------------------------------
   Hooks for Streams & Sessions
  ---------------------------------- */

  const streamId = form.stream_id;

  const { streams = [] } = useCollegePublicStreams({
    enabled: step === 3,
    params: {
      active_only: true,
      all: true,
    },
  });
  const { sessions = [] } = useCollegePublicSessions({
    streamId: streamId,
    enabled: step === 3 && !!streamId,
    params: {
      active_only: true,
      all: true,
    },
  });

  /* ----------------------------------
   STEP 1 – Find Application
  ---------------------------------- */

  const findApplication = async () => {
    setProcessing(true);
    setErrors({});

    try {
      const res = await AuthApi.FindApplication(appNo);
      setAppData(res.data);
      setStep(2);
    } catch {
      setErrors({ app_no: "Application not found" });
    } finally {
      setProcessing(false);
    }
  };

  /* ----------------------------------
   STEP 2 – Send OTP
  ---------------------------------- */

  const sendOtp = async () => {
    setProcessing(true);

    try {
      await AuthApi.SendOtp({
        mobile: appData.mobile,
        email: appData.email,
      });
      setStep(3);
    } finally {
      setProcessing(false);
    }
  };

  /* ----------------------------------
   STEP 3 – Register
  ---------------------------------- */

  const register = async (e: any) => {
    e.preventDefault();
    setProcessing(true);
    setErrors({});

    try {
      await AuthApi.Register({
        app_no: appNo,
        otp: form.otp,
        password: form.password,
        password_confirmation: form.password_confirmation,
        stream_id: Number(form.stream_id),
        session_id: Number(form.session_id),
      });
      router.visit("/student-portal/dashboard");
    } catch (e: any) {
      setErrors(e.response?.data?.errors || {});
    } finally {
      setProcessing(false);
    }
  };

  return (
    <AuthLayout
      title="Student Registration"
      description="Verify your application and create your account"
    >
      <Head title="Student Register" />

      <div className="flex flex-col gap-6">
        {/* ================= STEP 1 ================= */}
        {step === 1 && (
          <div className="grid gap-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Step 1: Find Your Application
            </h3>

            <div className="grid gap-2">
              <Label>Application Number</Label>
              <Input
                value={appNo}
                onChange={(e) => setAppNo(e.target.value)}
                placeholder="Enter application number"
              />
              <InputError message={errors.app_no} />
            </div>

            <Button onClick={findApplication} disabled={processing}>
              {processing && <Spinner />}
              Find Application
            </Button>
          </div>
        )}

        {/* ================= STEP 2 ================= */}
        {step === 2 && appData && (
          <div className="grid gap-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Step 2: Confirm Application Details
            </h3>

            <div className="grid gap-3">
              <div>
                <Label>Name</Label>
                <Input disabled value={appData.name} />
              </div>

              <div>
                <Label>Father's Name</Label>
                <Input disabled value={appData.father_name} />
              </div>

              <div>
                <Label>Email</Label>
                <Input disabled value={appData.email} />
              </div>

              <div>
                <Label>Mobile</Label>
                <Input disabled value={appData.mobile} />
              </div>
            </div>

            <Button onClick={sendOtp} disabled={processing}>
              {processing && <Spinner />}
              Send OTP
            </Button>

            <Button
              variant="ghost"
              onClick={() => setStep(1)}
              className="text-sm"
            >
              Change Application Number
            </Button>
          </div>
        )}

        {/* ================= STEP 3 ================= */}
        {step === 3 && (
          <form onSubmit={register} className="grid gap-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Step 3: Verify OTP & Complete Registration
            </h3>

            {/* OTP */}
            <div className="grid gap-2">
              <Label>OTP</Label>
              <Input
                value={form.otp}
                onChange={(e) => setForm({ ...form, otp: e.target.value })}
              />
              <InputError message={errors.otp} />
            </div>

            {/* STREAM */}
            <div className="grid gap-2">
              <Label>Stream</Label>
              <Select
                value={form.stream_id}
                onValueChange={(value) =>
                  setForm({
                    ...form,
                    stream_id: value,
                    session_id: "",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select stream" />
                </SelectTrigger>
                <SelectContent>
                  <Each
                      of={streams}
                      keyExtractor={(stream: any) => String(stream.key)}
                      render={(stream: any) => (
                    <SelectItem key={stream.key} value={String(stream.key)}>
                      {stream?.text}
                    </SelectItem>
                  )}
                  />
                </SelectContent>
              </Select>
              <InputError message={errors.stream_id} />
            </div>

            {/* SESSION */}
            <div className="grid gap-2">
              <Label>Session</Label>
              <Select
                value={form.session_id}
                onValueChange={(value) =>
                  setForm({ ...form, session_id: value })
                }
                disabled={!form.stream_id}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select session" />
                </SelectTrigger>
                <SelectContent>
                  <Each
                      of={sessions}
                      keyExtractor={(session: any) => String(session?.key)}
                      render={(session: any) => (
                    <SelectItem key={session?.key} value={String(session?.key)}>
                      {session?.text}
                    </SelectItem>
                  )}
                  />
                </SelectContent>
              </Select>
              <InputError message={errors.session_id} />
            </div>

            {/* PASSWORD */}
            <div className="grid gap-2">
              <Label>Password</Label>
              <Input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <InputError message={errors.password} />
            </div>

            <div className="grid gap-2">
              <Label>Confirm Password</Label>
              <Input
                type="password"
                value={form.password_confirmation}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password_confirmation: e.target.value,
                  })
                }
              />
            </div>

            <Button type="submit" disabled={processing}>
              {processing && <Spinner />}
              Create Account
            </Button>
          </form>
        )}
      </div>
    </AuthLayout>
  );
}
