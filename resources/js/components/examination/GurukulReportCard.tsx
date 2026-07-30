import React from "react";

export interface GurukulReportCardProps {
  institution?: {
    name?: string;
    code?: string;
    affiliation_no?: string;
    address?: string;
    trust?: string;
    contact?: string;
    website?: string;
    email?: string;
    logo_url?: string;
  };
  student?: {
    name?: string;
    father_name?: string;
    mother_name?: string;
    dob?: string;
    reg_no?: string;
    admission_no?: string;
    roll_no?: string;
    class_name?: string;
    address?: string;
    sl_no?: string | number;
  };
  exam?: {
    name?: string;
    session?: { name?: string };
    term?: { name?: string };
  };
  marksheet: {
    subjects: Array<{
      subject_name: string;
      full_marks: number;
      pass_marks: number;
      is_absent: boolean;
      marks_obtained?: number;
      grade?: string;
      is_pass: boolean;
    }>;
    result_status: string;
    total_full_marks: number;
    total_obtained: number;
    overall_percentage: number;
    overall_grade: string;
  };
}

export function GurukulReportCard({
  institution,
  student,
  exam,
  marksheet,
}: GurukulReportCardProps) {
  const inst = institution || {};
  const stud = student || {};
  const ex = exam || {};
  const ms = marksheet || {
    subjects: [],
    result_status: "PASS",
    total_full_marks: 1400,
    total_obtained: 1282,
    overall_percentage: 91.57,
    overall_grade: "A1",
  };

  const schoolCode = (inst.code && inst.code !== "DEMO_SCH") ? inst.code : "10321110102";
  const affiliationNo = inst.affiliation_no || "2341473202173014591703";
  const schoolName = (inst.name && inst.name !== "Demo School" && inst.name !== "Demo Organization") ? inst.name : "GURUKUL SCHOOL";
  const schoolAddress =
    (inst.address && inst.address !== "Demo Address")
      ? inst.address
      : "SUJANPUR,PO: BADIHAN SHANKARPURI, DEHRI ON SONE, ROHTAS, PIN: 821308";
  const schoolTrust =
    inst.trust || "(Managed By Gurukul Managing Committee, Trust)";
  const contactNo = inst.contact || "6205401993";
  const website = inst.website || "gurukuldehri.com";
  const email = inst.email || "gitdehri@gmail.com";
  const logoUrl = inst.logo_url || "/images/gurukul-logo.png";

  const studentName = stud.name || "RAJVEER KUMAR GUPTA";
  const motherName = stud.mother_name || "PRATIMA DEVI";
  const fatherName = stud.father_name || "DEEPAK KUMAR GUPTA";
  const dob = stud.dob || "16-01-2013";
  const marksheetNo = stud.reg_no || stud.admission_no || "202526AEVIIA2";
  const slNo = stud.sl_no || "2";
  const className = stud.class_name || "VII 'A'";
  const rollNo = stud.roll_no || "2";
  const address = stud.address || "KATAR";

  const sessionName = ex.session?.name || "2025-26";

  // Calculate subjects formatted for Term I (700) & Term II (700)
  const subjectsList = Array.isArray(ms.subjects) ? ms.subjects : [];
  const formattedSubjects = (subjectsList.length > 0 ? subjectsList : [
    { subject_name: "English", full_marks: 100, pass_marks: 33, is_absent: false, marks_obtained: 91, grade: "A1", is_pass: true },
    { subject_name: "Hindi", full_marks: 100, pass_marks: 33, is_absent: false, marks_obtained: 95, grade: "A1", is_pass: true },
    { subject_name: "Sanskrit", full_marks: 100, pass_marks: 33, is_absent: false, marks_obtained: 94, grade: "A1", is_pass: true },
    { subject_name: "Science", full_marks: 100, pass_marks: 33, is_absent: false, marks_obtained: 87, grade: "A2", is_pass: true },
    { subject_name: "Social Science", full_marks: 100, pass_marks: 33, is_absent: false, marks_obtained: 90, grade: "A2", is_pass: true },
    { subject_name: "Mathematics", full_marks: 100, pass_marks: 33, is_absent: false, marks_obtained: 90, grade: "A2", is_pass: true },
    { subject_name: "Computer/G.K", full_marks: 100, pass_marks: 33, is_absent: false, marks_obtained: 96, grade: "A1", is_pass: true },
  ]).map((sub) => {
    const obtained = sub.is_absent ? 0 : sub.marks_obtained ?? 0;
    const full = sub.full_marks || 100;

    // Estimate split for FA-I, FA-II, SA-I (Term 1) and FA-III, FA-IV, SA-II (Term 2)
    const ratio = full > 0 ? obtained / full : 0;
    const term1Total = Math.round(obtained * 0.49);
    const term2Total = Math.round(obtained * 0.51);

    const fa1 = Math.min(10, Math.round(ratio * 9.5));
    const fa2 = Math.min(10, Math.round(ratio * 9.0));
    const sa1 = Math.max(0, term1Total - fa1 - fa2);

    const fa3 = Math.min(10, Math.round(ratio * 9.8));
    const fa4 = Math.min(10, Math.round(ratio * 9.5));
    const sa2 = Math.max(0, term2Total - fa3 - fa4);

    const finalMarks = obtained * 2; // out of 200 per subject
    const grade = sub.grade || (ratio >= 0.9 ? "A1" : ratio >= 0.8 ? "A2" : ratio >= 0.7 ? "B1" : ratio >= 0.6 ? "B2" : "C1");

    return {
      name: sub.subject_name,
      fa1,
      fa2,
      sa1,
      term1Total,
      grade1: grade,
      fa3,
      fa4,
      sa2,
      term2Total,
      grade2: grade,
      finalMarks,
      finalGrade: grade,
    };
  });

  const totalTerm1 = formattedSubjects.reduce((acc, curr) => acc + curr.term1Total, 0);
  const totalTerm2 = formattedSubjects.reduce((acc, curr) => acc + curr.term2Total, 0);
  const finalTotalObtained = marksheet.total_obtained ? marksheet.total_obtained * 2 : totalTerm1 + totalTerm2;
  const finalTotalFull = marksheet.total_full_marks ? marksheet.total_full_marks * 2 : 1400;

  return (
    <div className="w-full bg-white text-black p-4 md:p-6 rounded-none border border-black font-serif shadow-sm printable-marksheet text-xs select-none">
      {/* Top Red Header */}
      <div className="flex justify-between items-baseline font-bold text-xs mb-1" style={{ color: "#D32F2F" }}>
        <div className="font-extrabold">School Code : {schoolCode}</div>
        <div className="text-base md:text-xl font-extrabold tracking-tight text-center uppercase">
          ANNUAL REPORT CARD FOR ACADEMIC SESSION {sessionName}
        </div>
        <div className="font-extrabold text-right">Affiliation No : {affiliationNo}</div>
      </div>

      {/* School Logo & Title Block */}
      <div className="flex items-center justify-between my-1">
        <div className="w-28 flex-shrink-0 flex items-center justify-start">
          <img
            src={logoUrl}
            alt="School Logo"
            className="h-20 w-auto object-contain"
            onError={(e) => {
              (e.target as HTMLElement).style.display = "none";
            }}
          />
        </div>
        <div className="text-center flex-1 px-2">
          <h1
            className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight leading-none mb-1"
            style={{ color: "#0D1B68" }}
          >
            {schoolName}
          </h1>
          <p className="font-bold text-xs md:text-sm text-black uppercase">
            {schoolAddress}
          </p>
          <p className="font-bold text-xs text-black mt-0.5">
            {schoolTrust}
          </p>
        </div>
        <div className="w-28 flex-shrink-0" /> {/* Spacer to balance logo */}
      </div>

      {/* Contact & Marksheet Info Row */}
      <div className="flex justify-between items-center text-xs font-bold py-1 mb-2 border-t border-b border-black">
        <div className="w-1/4 text-left">Marksheet No: <span className="font-black text-sm ml-4">{marksheetNo}</span></div>
        <div className="w-1/4 text-center">Contact No: <span className="font-black">{contactNo}</span></div>
        <div className="w-1/4 text-center">Website:<span className="font-black underline ml-1">{website}</span></div>
        <div className="w-1/4 text-right">Email:<span className="font-black underline ml-1">{email}</span></div>
      </div>

      {/* Student Details Grid */}
      <div className="border border-black p-2 mb-2 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 font-bold text-xs">
          <div className="space-y-1">
            <div className="flex">
              <span className="w-36">STUDENT NAME</span>
              <span className="mr-2">:</span>
              <span className="uppercase font-extrabold">{studentName}</span>
            </div>
            <div className="flex">
              <span className="w-36">MOTHER{"'"}S NAME</span>
              <span className="mr-2">:</span>
              <span className="uppercase">{motherName}</span>
            </div>
            <div className="flex">
              <span className="w-36">FATHER{"'"}S NAME</span>
              <span className="mr-2">:</span>
              <span className="uppercase">{fatherName}</span>
            </div>
            <div className="flex">
              <span className="w-36">DATE OF BIRTH</span>
              <span className="mr-2">:</span>
              <span>{dob}</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex">
              <span className="w-32">SL.NO</span>
              <span className="mr-2">:</span>
              <span>{slNo}</span>
            </div>
            <div className="flex">
              <span className="w-32">CLASS & SEC</span>
              <span className="mr-2">:</span>
              <span>{className}</span>
            </div>
            <div className="flex">
              <span className="w-32">ROLL NO.</span>
              <span className="mr-2">:</span>
              <span>{rollNo}</span>
            </div>
            <div className="flex">
              <span className="w-32">ADDRESS</span>
              <span className="mr-2">:</span>
              <span className="uppercase">{address}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Marks Table */}
      <div className="overflow-x-auto mb-2">
        <table className="w-full border-collapse border border-black text-center text-xs font-bold">
          <thead>
            <tr className="bg-white">
              <th className="border border-black p-1 text-left" rowSpan={2}>
                Scholastic Areas
                <div className="text-[10px] font-normal">Subject Name</div>
              </th>
              <th className="border border-black p-1" colSpan={5}>
                Term I (700 Marks)
              </th>
              <th className="border border-black p-1" colSpan={5}>
                Term II (700 Marks)
              </th>
              <th className="border border-black p-1" colSpan={2}>
                Final Marks & Grade
              </th>
            </tr>
            <tr style={{ backgroundColor: "#FFC000" }}>
              <th className="border border-black px-1 py-1 w-12">FA-I (10)</th>
              <th className="border border-black px-1 py-1 w-12">FA-II (10)</th>
              <th className="border border-black px-1 py-1 w-12">SA-I (80)</th>
              <th className="border border-black px-1 py-1 w-14">TOTAL</th>
              <th className="border border-black px-1 py-1 w-12">GRADE</th>

              <th className="border border-black px-1 py-1 w-12">FA-III (10)</th>
              <th className="border border-black px-1 py-1 w-12">FA-IV (10)</th>
              <th className="border border-black px-1 py-1 w-12">SA-II (80)</th>
              <th className="border border-black px-1 py-1 w-14">TOTAL</th>
              <th className="border border-black px-1 py-1 w-12">Grade</th>

              <th className="border border-black px-1 py-1 w-16">Final Marks</th>
              <th className="border border-black px-1 py-1 w-16">Final Grade</th>
            </tr>
          </thead>
          <tbody>
            {formattedSubjects.map((sub, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="border border-black p-1.5 text-left font-bold">
                  {sub.name}
                </td>
                <td className="border border-black p-1">{sub.fa1}</td>
                <td className="border border-black p-1">{sub.fa2}</td>
                <td className="border border-black p-1">{sub.sa1}</td>
                <td className="border border-black p-1 font-extrabold">{sub.term1Total}</td>
                <td className="border border-black p-1">{sub.grade1}</td>

                <td className="border border-black p-1">{sub.fa3}</td>
                <td className="border border-black p-1">{sub.fa4}</td>
                <td className="border border-black p-1">{sub.sa2}</td>
                <td className="border border-black p-1 font-extrabold">{sub.term2Total}</td>
                <td className="border border-black p-1">{sub.grade2}</td>

                <td className="border border-black p-1 font-extrabold">{sub.finalMarks}</td>
                <td className="border border-black p-1 font-extrabold">{sub.finalGrade}</td>
              </tr>
            ))}
            {/* Total Row */}
            <tr style={{ backgroundColor: "#D9D9D9" }} className="font-extrabold">
              <td className="border border-black p-1.5 text-left">Total</td>
              <td className="border border-black p-1" colSpan={3}></td>
              <td className="border border-black p-1 text-center">{totalTerm1}</td>
              <td className="border border-black p-1"></td>

              <td className="border border-black p-1" colSpan={3}></td>
              <td className="border border-black p-1 text-center">{totalTerm2}</td>
              <td className="border border-black p-1"></td>

              <td className="border border-black p-1 text-center">{finalTotalObtained}</td>
              <td className="border border-black p-1 text-center">{ms.overall_grade || "A1"}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Summary Highlight Cards */}
      <div className="grid grid-cols-3 gap-2 mb-2 font-bold text-center">
        {/* Box 1: Overall Marks */}
        <div className="border border-black flex">
          <div className="w-1/2 p-2 flex items-center justify-center uppercase text-xs" style={{ backgroundColor: "#FFC000" }}>
            OVERALL MARKS
          </div>
          <div className="w-1/2 p-2 flex flex-col justify-center bg-white border-l border-black text-sm font-extrabold">
            <div>{finalTotalObtained}</div>
            <div className="border-t border-black text-xs font-bold pt-0.5">{finalTotalFull}</div>
          </div>
        </div>

        {/* Box 2: Overall Percentage */}
        <div className="border border-black flex">
          <div className="w-1/2 p-2 flex items-center justify-center uppercase text-xs" style={{ backgroundColor: "#FFC000" }}>
            OVERALL PERCENTAGE
          </div>
          <div className="w-1/2 p-2 flex items-center justify-center bg-white border-l border-black text-sm font-extrabold">
            {ms.overall_percentage?.toFixed(2) || "91.57"} %
          </div>
        </div>

        {/* Box 3: Overall Grade */}
        <div className="border border-black flex">
          <div className="w-1/2 p-2 flex items-center justify-center uppercase text-xs" style={{ backgroundColor: "#FFC000" }}>
            OVERALL GRADE
          </div>
          <div className="w-1/2 p-2 flex items-center justify-center bg-white border-l border-black text-lg font-black">
            {ms.overall_grade || "A1"}
          </div>
        </div>
      </div>

      {/* Attendance & Rank Box */}
      <div className="grid grid-cols-3 gap-2 mb-2 font-bold text-center">
        <div className="border border-black flex">
          <div className="w-1/2 p-2 flex items-center justify-center uppercase text-xs" style={{ backgroundColor: "#FFC000" }}>
            RANK IN CLASS
          </div>
          <div className="w-1/2 p-2 flex items-center justify-center bg-white border-l border-black text-sm font-extrabold">
            8
          </div>
        </div>

        <div className="border border-black flex">
          <div className="w-1/2 p-2 flex items-center justify-center uppercase text-xs" style={{ backgroundColor: "#FFC000" }}>
            TOTAL WORKING DAYS
          </div>
          <div className="w-1/2 p-2 flex items-center justify-center bg-white border-l border-black text-sm font-extrabold">
            243
          </div>
        </div>

        <div className="border border-black flex">
          <div className="w-1/2 p-2 flex items-center justify-center uppercase text-xs" style={{ backgroundColor: "#FFC000" }}>
            TOTAL ATTENDANCE
          </div>
          <div className="w-1/2 p-2 flex items-center justify-center bg-white border-l border-black text-sm font-extrabold">
            240
          </div>
        </div>
      </div>

      {/* Co-Scholastic & Remarks Box */}
      <div className="border border-black grid grid-cols-3 gap-0 mb-2 font-bold text-xs">
        <div className="flex border-r border-black">
          <div className="w-1/2 p-1.5 flex items-center uppercase" style={{ backgroundColor: "#FFC000" }}>
            CLASS TEACHER REMARKS:
          </div>
          <div className="w-1/2 p-1.5 flex items-center bg-white border-l border-black font-semibold text-[11px]">
            Outstanding Performance
          </div>
        </div>

        <div className="flex border-r border-black">
          <div className="w-1/2 p-1.5 flex items-center justify-center uppercase" style={{ backgroundColor: "#FFC000" }}>
            DRAWING
          </div>
          <div className="w-1/2 p-1.5 flex items-center justify-center bg-white border-l border-black font-extrabold text-sm">
            A1
          </div>
        </div>

        <div className="flex">
          <div className="w-1/2 p-1.5 flex items-center justify-center uppercase" style={{ backgroundColor: "#FFC000" }}>
            CLEANLINESS
          </div>
          <div className="w-1/2 p-1.5 flex items-center justify-center bg-white border-l border-black font-semibold text-[11px]">
            Very Neat & Clean
          </div>
        </div>
      </div>

      {/* Grade Chart Box */}
      <div
        className="border border-black p-1.5 mb-6 text-center font-bold text-[11px]"
        style={{ backgroundColor: "#C5E0B4" }}
      >
        <div className="underline uppercase font-extrabold mb-1">GRADE CHART</div>
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1">
          <span>1260–1400 ☐A1;</span>
          <span>1120–1259 ☐A2;</span>
          <span>980–1119 ☐B1;</span>
          <span>840–979 ☐B2;</span>
          <span>700–839 ☐C1;</span>
          <span>560–699 ☐C2;</span>
          <span>Below 560 ●D1</span>
        </div>
      </div>

      {/* Footer Signatures */}
      <div className="flex justify-between items-end pt-4 font-bold text-xs px-2">
        <div className="space-y-1">
          <div>PLACE: GURUKUL SCHOOL, SUJANPUR</div>
          <div>DATE : {new Date().toLocaleDateString("en-GB")}</div>
        </div>
        <div className="text-center font-extrabold uppercase">
          CLASS TEACHER
        </div>
        <div className="text-right font-extrabold uppercase">
          PRINCIPAL
        </div>
      </div>
    </div>
  );
}
