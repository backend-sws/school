import React from "react";

export interface AdmitCardScheduleItem {
  id?: number | string;
  subject_name: string;
  sitting?: string; // e.g. "1st", "2nd"
  exam_date?: string; // e.g. "16-09-2026"
  day?: string; // e.g. "WEDNESDAY"
  timing?: string; // e.g. "09:30 A.M TO 11:30 A.M"
}

export interface GurukulAdmitCardProps {
  institution?: {
    name?: string;
    code?: string;
    reg_no?: string;
    address?: string;
    trust?: string;
    contact?: string;
    logo_url?: string;
  };
  student?: {
    name?: string;
    father_name?: string;
    mother_name?: string;
    roll_no?: string;
    reg_no?: string;
    admission_no?: string;
    class_name?: string;
    section?: string;
    photo_url?: string;
  };
  exam?: {
    name?: string;
    session?: { name?: string };
    term?: { name?: string };
  };
  schedules?: AdmitCardScheduleItem[];
}

export function GurukulAdmitCard({
  institution,
  student,
  exam,
  schedules = [],
}: GurukulAdmitCardProps) {
  const inst = institution || {};
  const stud = student || {};
  const ex = exam || {};

  const schoolName = (inst.name && inst.name !== "Demo School" && inst.name !== "Demo Organization")
    ? inst.name
    : "GURUKUL SCHOOL";
  const schoolAddress = inst.address || "At:Sundarganj, Baknaura, Rohtas, Bihar, 821311";
  const schoolTrust = inst.trust || "(Managed by Gurukul Managing Committee (Trust), Dehri on Sone)";
  const contactNo = inst.contact || "Contact: +91 7739018091";
  const logoUrl = inst.logo_url || "/images/gurukul-logo.png";
  const regNo = inst.reg_no || inst.affiliation_no || "23414752026325123543";

  const examTitle = ex.name ? ex.name.toUpperCase() : "SA-I (HALF YEARLY)";
  const sessionName = ex.session?.name || "2026-27";

  const studentName = stud.name || "STUDENT NAME";
  const fatherName = stud.father_name || "FATHER NAME";
  const className = stud.class_name || "VII";
  const sectionName = stud.section || "";
  const rollNo = stud.roll_no || "";

  // Helper to render superscript for sitting (1st -> 1<sup>st</sup>)
  const renderSitting = (sittingStr?: string) => {
    if (!sittingStr) return <span>1<sup>st</sup></span>;
    const match = sittingStr.match(/^(\d+)(st|nd|rd|th)$/i);
    if (match) {
      return (
        <span>
          {match[1]}
          <sup>{match[2].toLowerCase()}</sup>
        </span>
      );
    }
    return <span>{sittingStr}</span>;
  };

  // Fallback demo schedules if none provided
  const scheduleList: AdmitCardScheduleItem[] = schedules.length > 0 ? schedules : [
    { subject_name: "SANSKRIT", sitting: "1st", exam_date: "16-09-2026", day: "WEDNESDAY", timing: "09:30 A.M TO 11:30 A.M" },
    { subject_name: "HINDI", sitting: "1st", exam_date: "17-09-2026", day: "THURSDAY", timing: "09:30 A.M TO 11:30 A.M" },
    { subject_name: "ENGLISH", sitting: "1st", exam_date: "18-09-2026", day: "FRIDAY", timing: "09:30 A.M TO 11:30 A.M" },
    { subject_name: "MATHEMATICS", sitting: "1st", exam_date: "19-09-2026", day: "SATURDAY", timing: "09:30 A.M TO 11:30 A.M" },
    { subject_name: "SOCIAL SCIENCE", sitting: "1st", exam_date: "21-09-2026", day: "MONDAY", timing: "09:30 A.M TO 11:30 A.M" },
    { subject_name: "SCIENCE", sitting: "1st", exam_date: "22-09-2026", day: "TUESDAY", timing: "09:30 A.M TO 11:30 A.M" },
    { subject_name: "G.K/COMPUTER", sitting: "2nd", exam_date: "23-09-2026", day: "WEDNESDAY", timing: "11:40 A.M TO 01:40 P.M" },
    { subject_name: "ORAL TEST", sitting: "1st", exam_date: "23-09-2026", day: "WEDNESDAY", timing: "09:30 A.M TO 11:30 A.M" },
  ];

  return (
    <div className="printable-marksheet max-w-4xl mx-auto border-2 border-black p-3 bg-white text-black font-sans text-xs leading-tight select-none">
      {/* Top Header line: ESTD & REG NO */}
      <div className="flex justify-between items-center font-bold text-[11px] mb-1">
        <span>ESTD.2026</span>
        <span>REG NO:{regNo}</span>
      </div>

      {/* Main Header with Logo */}
      <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-1">
        <div className="w-16 flex-shrink-0 flex justify-center">
          <img src={logoUrl} alt="Logo" className="h-16 w-16 object-contain" />
        </div>
        <div className="flex-1 text-center px-2">
          <h1 className="text-xl sm:text-2xl font-black tracking-wide font-serif text-black uppercase">
            {schoolName}
          </h1>
          <p className="text-[11px] font-semibold text-black leading-tight">
            {schoolAddress}
          </p>
          <p className="text-[10px] text-black leading-tight">
            {schoolTrust}
          </p>
          <p className="text-[11px] font-bold text-black leading-tight">
            {contactNo}
          </p>
        </div>
        <div className="w-16 flex-shrink-0" />
      </div>

      {/* Title Bar */}
      <div className="border-t border-b-2 border-black text-center py-1 bg-white mb-2">
        <h2 className="text-base sm:text-lg font-black uppercase text-black tracking-wide">
          {examTitle} EXAMINATION HALL TICKET
        </h2>
        <p className="text-xs font-bold italic text-black">
          ACADEMIC SESSION:{sessionName}
        </p>
      </div>

      {/* Student Details Grid & Photo Box */}
      <div className="border border-black mb-2 flex">
        <div className="flex-1 border-r border-black">
          <div className="grid grid-cols-12 border-b border-black">
            <div className="col-span-3 bg-gray-200 font-bold p-1 border-r border-black uppercase text-[11px]">
              CLASS:
            </div>
            <div className="col-span-4 p-1 font-bold border-r border-black uppercase text-[11px]">
              {className}
            </div>
            <div className="col-span-2 bg-gray-200 font-bold p-1 border-r border-black uppercase text-[11px] text-center">
              SEC:
            </div>
            <div className="col-span-3 p-1 font-bold uppercase text-[11px]">
              {sectionName}
            </div>
          </div>

          <div className="grid grid-cols-12 border-b border-black">
            <div className="col-span-3 bg-gray-200 font-bold p-1 border-r border-black uppercase text-[11px]">
              ROLL:
            </div>
            <div className="col-span-9 p-1 font-bold uppercase text-[11px]">
              {rollNo}
            </div>
          </div>

          <div className="grid grid-cols-12 border-b border-black">
            <div className="col-span-3 bg-gray-200 font-bold p-1 border-r border-black uppercase text-[11px]">
              NAME:
            </div>
            <div className="col-span-9 p-1 font-bold uppercase text-[11px]">
              {studentName}
            </div>
          </div>

          <div className="grid grid-cols-12">
            <div className="col-span-3 bg-gray-200 font-bold p-1 border-r border-black uppercase text-[11px]">
              FATHER'S NAME:
            </div>
            <div className="col-span-9 p-1 font-bold uppercase text-[11px]">
              {fatherName}
            </div>
          </div>
        </div>

        {/* Photo Box */}
        <div className="w-36 flex-shrink-0 flex items-center justify-center p-1 text-center bg-white">
          {stud.photo_url ? (
            <img src={stud.photo_url} alt="Student" className="max-h-24 max-w-full object-contain" />
          ) : (
            <div className="w-full h-full border border-dashed border-black/40 flex items-center justify-center p-2">
              <span className="text-[9px] font-bold leading-snug text-black uppercase">
                PASTE YOUR RECENT PHOTO HERE
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Examination Schedule Section */}
      <div className="text-center font-black uppercase tracking-wider text-xs my-1 underline">
        EXAMINATION SCHEDULE
      </div>

      <table className="w-full border-collapse border border-black mb-2 text-[11px]">
        <thead>
          <tr className="bg-gray-200 font-bold border-b border-black">
            <th className="border border-black p-1 text-left w-[35%] uppercase">SUBJECT</th>
            <th className="border border-black p-1 text-center w-[12%] uppercase">SITTING</th>
            <th className="border border-black p-1 text-center w-[18%] uppercase">EXAM DATE</th>
            <th className="border border-black p-1 text-center w-[15%] uppercase">DAY</th>
            <th className="border border-black p-1 text-center w-[20%] uppercase">TIMING</th>
          </tr>
        </thead>
        <tbody>
          {scheduleList.map((item, index) => {
            const isSecondSitting = item.sitting?.toLowerCase().includes("2") || item.sitting === "2nd";
            return (
              <tr key={index} className="border-b border-black">
                <td className="border border-black p-1 font-bold uppercase">{item.subject_name}</td>
                <td className={`border border-black p-1 text-center font-bold ${isSecondSitting ? 'bg-gray-300' : ''}`}>
                  {renderSitting(item.sitting)}
                </td>
                <td className="border border-black p-1 text-center font-bold">{item.exam_date}</td>
                <td className="border border-black p-1 text-center font-bold uppercase">{item.day}</td>
                <td className={`border border-black p-1 text-center font-bold ${isSecondSitting ? 'bg-gray-300' : ''}`}>
                  {item.timing}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Signature Section */}
      <div className="flex justify-between items-end border-t border-b border-black py-2 my-2 text-[11px] font-bold px-2">
        <div className="w-1/3 text-left">
          Class Teacher
        </div>
        <div className="w-1/3 text-center">
          (SEAL)
        </div>
        <div className="w-1/3 text-right uppercase">
          PRINCIPAL
        </div>
      </div>

      {/* General Instructions Section */}
      <div className="text-center mt-1">
        <h3 className="font-bold text-[11px] underline text-black">
          General/Examination Instructions for Students
        </h3>
        <p className="text-[9px] italic text-black mb-1">
          (In case of any discrepancy between the entries in the hall ticket must contact to school office.)
        </p>
      </div>

      {/* Box 1: Instructions 1 to 10 */}
      <div className="border border-black p-1.5 mb-1.5 text-[9.5px] leading-tight space-y-0.5">
        <p>1. Check the exam timetable carefully.</p>
        <p>2. Students must bring the Admit Card and show it to the invigilator(s) on duty and should preserve it for future requirements.</p>
        <p>3. Calculator, Digital Watch, or any Electronic Device is NOT ALLOWED.</p>
        <p>4. Arrive at the School at least 15 Minutes before the start of the Examination.</p>
        <p>5. Student is barred from entering the examination hall 15 minutes after the written examination starts.</p>
        <p>6. Ensure that you use the washroom before arriving for your exam as you will not be permitted to leave during the first hour.</p>
        <p>7. Normally, you are required to answer question using Pencil (KIDS TO STD-II), BLUE or BLACK INK PEN (STD-III to STD-VIII).</p>
        <p>8. Keep your eyes on your own paper. Remember, Copying is cheating!</p>
        <p>9. You must remain silent until after you have exited the school building.</p>
        <p>10. When the exam ends the Invigilator calls "TIME IS OVER. PENS, PENCILSDOWN".</p>
      </div>

      {/* Box 2: Instructions 11 to 12 */}
      <div className="border border-black p-1.5 text-[9.5px] leading-tight space-y-0.5 bg-gray-50">
        <p>11. If you have any difficulty with the exam paper, raise your hand and wait for the invigilator to respond.</p>
        <p>12. Make sure that you are prepared for the exam. Have your pen(s), pencil(s), pencil sharpener, extra lead(s) or refill(s), and your eraser available and ready.</p>
      </div>
    </div>
  );
}
