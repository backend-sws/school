import React from "react";

export interface GurukulSubject {
  subject_name: string;
  full_marks: number;
  pass_marks: number;
  is_absent: boolean;
  marks_obtained?: number;
  grade?: string;
  is_pass: boolean;
  fa1?: number;
  fa2?: number;
  sa1?: number;
  term1_total?: number;
  grade1?: string;
  fa3?: number;
  fa4?: number;
  sa2?: number;
  term2_total?: number;
  grade2?: string;
  final_marks?: number;
  final_grade?: string;
}

export interface GurukulReportCardProps {
  reportType?: "half_yearly" | "final" | "annual";
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
    subjects: GurukulSubject[];
    result_status: string;
    total_full_marks: number;
    total_obtained: number;
    overall_percentage: number;
    overall_grade: string;
    rank?: number | string;
    total_working_days?: number | string;
    total_attendance?: number | string;
    teacher_remarks?: string;
    drawing_grade?: string;
    behaviour_grade?: string;
    cleanliness_grade?: string;
  };
}

export function GurukulReportCard({
  reportType = "final",
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

  const isHalfYearly =
    reportType === "half_yearly" ||
    (ex.term?.name?.toLowerCase().includes("half") && reportType !== "final" && reportType !== "annual");

  const schoolCode = (inst.code && inst.code !== "DEMO_SCH") ? inst.code : "10321110102";
  const affiliationNo = inst.affiliation_no || "2341473202173014591703";
  const schoolName = (inst.name && inst.name !== "Demo School" && inst.name !== "Demo Organization") ? inst.name : "GURUKUL SCHOOL";
  const schoolAddress =
    (inst.address && inst.address !== "Demo Address")
      ? inst.address
      : "SUJANPUR,PO: BADIHAN SHANKARPURI, DEHRI ON SONE, ROHTAS, PIN: 821308";
  const schoolTrust =
    inst.trust || "(Managed By Gurukul Managing Committee, Trust)";
  const contactNo = inst.contact || "";
  const website = "gurukul.ojasvidya.com";
  const email = inst.email || "";
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

  const getCBSEGrade = (pct: number) => {
    if (pct >= 90) return "A1";
    if (pct >= 80) return "A2";
    if (pct >= 70) return "B1";
    if (pct >= 60) return "B2";
    if (pct >= 50) return "C1";
    if (pct >= 40) return "C2";
    if (pct >= 33) return "D";
    return "E";
  };

  const subjectsList = Array.isArray(ms.subjects) ? ms.subjects : [];
  const formattedSubjects = (subjectsList.length > 0 ? subjectsList : [
    { subject_name: "English", full_marks: 100, pass_marks: 33, is_absent: false, fa1: 9, fa2: 9, sa1: 30, fa3: 9, fa4: 8, sa2: 26, grade: "A1", is_pass: true },
    { subject_name: "Hindi", full_marks: 100, pass_marks: 33, is_absent: false, fa1: 10, fa2: 9, sa1: 31, fa3: 9, fa4: 9, sa2: 27, grade: "A1", is_pass: true },
    { subject_name: "Sanskrit", full_marks: 100, pass_marks: 33, is_absent: false, fa1: 9, fa2: 10, sa1: 30, fa3: 9, fa4: 9, sa2: 27, grade: "A1", is_pass: true },
    { subject_name: "Science", full_marks: 100, pass_marks: 33, is_absent: false, fa1: 8, fa2: 8, sa1: 28, fa3: 9, fa4: 8, sa2: 26, grade: "A2", is_pass: true },
    { subject_name: "Social Science", full_marks: 100, pass_marks: 33, is_absent: false, fa1: 9, fa2: 8, sa1: 29, fa3: 8, fa4: 9, sa2: 27, grade: "A2", is_pass: true },
    { subject_name: "Mathematics", full_marks: 100, pass_marks: 33, is_absent: false, fa1: 9, fa2: 9, sa1: 28, fa3: 9, fa4: 8, sa2: 27, grade: "A2", is_pass: true },
    { subject_name: "Computer Science", full_marks: 100, pass_marks: 33, is_absent: false, fa1: 10, fa2: 9, sa1: 32, fa3: 9, fa4: 10, sa2: 26, grade: "A1", is_pass: true },
  ]).map((sub) => {
    const fa1 = sub.is_absent ? 0 : (sub.fa1 ?? 0);
    const fa2 = sub.is_absent ? 0 : (sub.fa2 ?? 0);
    const sa1 = sub.is_absent ? 0 : (sub.sa1 ?? 0);
    const term1Total = sub.is_absent ? 0 : (sub.term1_total ?? (fa1 + fa2 + sa1));

    const fa3 = sub.is_absent ? 0 : (sub.fa3 ?? 0);
    const fa4 = sub.is_absent ? 0 : (sub.fa4 ?? 0);
    const sa2 = sub.is_absent ? 0 : (sub.sa2 ?? 0);
    const term2Total = sub.is_absent ? 0 : (sub.term2_total ?? (fa3 + fa4 + sa2));

    const finalMarks = sub.final_marks ?? (term1Total + term2Total);
    
    const grade1 = sub.grade1 || (sub.grade ? sub.grade : getCBSEGrade(term1Total));
    const grade2 = sub.grade2 || (sub.grade ? sub.grade : getCBSEGrade(term2Total));
    const finalGrade = sub.final_grade || (sub.grade ? sub.grade : getCBSEGrade((finalMarks / 200) * 100));

    return {
      name: sub.subject_name,
      fullMarks: sub.full_marks || 100,
      fa1,
      fa2,
      sa1,
      term1Total,
      grade1,
      fa3,
      fa4,
      sa2,
      term2Total,
      grade2,
      finalMarks,
      finalGrade,
    };
  });

  const totalFA1 = formattedSubjects.reduce((acc, curr) => acc + curr.fa1, 0);
  const totalFA2 = formattedSubjects.reduce((acc, curr) => acc + curr.fa2, 0);
  const totalSA1 = formattedSubjects.reduce((acc, curr) => acc + curr.sa1, 0);
  const totalTerm1 = formattedSubjects.reduce((acc, curr) => acc + curr.term1Total, 0);
  const term1FullMarks = formattedSubjects.reduce((acc, curr) => acc + (curr.fullMarks || 100), 0);
  const term1Percentage = term1FullMarks > 0 ? (totalTerm1 / term1FullMarks) * 100 : (ms.overall_percentage || 0);
  const term1Grade = getCBSEGrade(term1Percentage);

  const totalTerm2 = formattedSubjects.reduce((acc, curr) => acc + curr.term2Total, 0);
  const finalTotalObtained = formattedSubjects.reduce((acc, curr) => acc + curr.finalMarks, 0);
  const finalTotalFull = formattedSubjects.reduce((acc, curr) => acc + ((curr.fullMarks || 100) * 2), 0);
  const overallPercentage = finalTotalFull > 0 ? (finalTotalObtained / finalTotalFull) * 100 : (ms.overall_percentage || 0);
  const overallGrade = ms.overall_grade || getCBSEGrade(overallPercentage);

  const displayedObtained = isHalfYearly ? totalTerm1 : finalTotalObtained;
  const displayedFull = isHalfYearly ? term1FullMarks : finalTotalFull;
  const displayedPercentage = isHalfYearly ? term1Percentage : overallPercentage;
  const displayedGrade = isHalfYearly ? term1Grade : overallGrade;

  const rankDisplay = ms.rank !== undefined && ms.rank !== null ? String(ms.rank) : "—";
  const workingDaysDisplay = ms.total_working_days !== undefined && ms.total_working_days !== null ? String(ms.total_working_days) : "—";
  const attendanceDisplay = ms.total_attendance !== undefined && ms.total_attendance !== null ? String(ms.total_attendance) : "—";

  const maxMarks = isHalfYearly ? term1FullMarks : finalTotalFull;
  const a1Max = maxMarks;
  const a1Min = Math.round(maxMarks * 0.9);
  const a2Max = a1Min - 1;
  const a2Min = Math.round(maxMarks * 0.8);
  const b1Max = a2Min - 1;
  const b1Min = Math.round(maxMarks * 0.7);
  const b2Max = b1Min - 1;
  const b2Min = Math.round(maxMarks * 0.6);
  const c1Max = b2Min - 1;
  const c1Min = Math.round(maxMarks * 0.5);
  const c2Max = c1Min - 1;
  const c2Min = Math.round(maxMarks * 0.4);
  const d1Max = c2Min - 1;

  return (
    <div className="w-full bg-white dark:bg-white text-black dark:text-black p-4 md:p-6 rounded-none border border-black dark:border-black font-serif shadow-sm printable-marksheet text-xs select-none [&_th]:text-black [&_th]:dark:text-black [&_td]:text-black [&_td]:dark:text-black [&_div]:text-black [&_div]:dark:text-black [&_span]:text-black [&_span]:dark:text-black [&_p]:text-black [&_p]:dark:text-black [&_table]:bg-white [&_table]:dark:bg-white">
      {/* Top Red Header */}
      <div className="flex justify-between items-baseline font-bold text-xs mb-1" style={{ color: "#D32F2F" }}>
        <div className="font-extrabold">School Code : {schoolCode}</div>
        <div className="text-base md:text-xl font-extrabold tracking-tight text-center uppercase">
          {isHalfYearly ? "HALF YEARLY" : "ANNUAL"} REPORT CARD FOR ACADEMIC SESSION {sessionName}
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
          <p className="font-bold text-xs md:text-sm text-black dark:text-black uppercase">
            {schoolAddress}
          </p>
          <p className="font-bold text-xs text-black dark:text-black mt-0.5">
            {schoolTrust}
          </p>
        </div>
        <div className="w-28 flex-shrink-0" />
      </div>

      {/* Contact & Marksheet Info Row */}
      <div className="flex justify-between items-center text-xs font-bold py-1 mb-2 border-t border-b border-black dark:border-black text-black dark:text-black bg-white dark:bg-white">
        <div className="w-1/4 text-left">Marksheet No: <span className="font-black text-sm ml-4">{marksheetNo}</span></div>
        <div className="w-1/4 text-center">Contact No: <span className="font-black">{contactNo}</span></div>
        <div className="w-1/4 text-center">Website:<span className="font-black underline ml-1">{website}</span></div>
        <div className="w-1/4 text-right">Email:<span className="font-black underline ml-1">{email}</span></div>
      </div>

      {/* Student Details Grid */}
      <div className="border border-black dark:border-black p-2 mb-2 bg-white dark:bg-white text-black dark:text-black">
        <div className="grid grid-cols-2 gap-x-6 gap-y-1 font-bold text-xs">
          <div className="space-y-1">
            <div className="flex">
              <span className="w-36 text-black dark:text-black">STUDENT NAME</span>
              <span className="mr-2 text-black dark:text-black">:</span>
              <span className="uppercase font-extrabold text-black dark:text-black">{studentName}</span>
            </div>
            <div className="flex">
              <span className="w-36 text-black dark:text-black">MOTHER{"'"}S NAME</span>
              <span className="mr-2 text-black dark:text-black">:</span>
              <span className="uppercase text-black dark:text-black">{motherName}</span>
            </div>
            <div className="flex">
              <span className="w-36 text-black dark:text-black">FATHER{"'"}S NAME</span>
              <span className="mr-2 text-black dark:text-black">:</span>
              <span className="uppercase text-black dark:text-black">{fatherName}</span>
            </div>
            <div className="flex">
              <span className="w-36 text-black dark:text-black">DATE OF BIRTH</span>
              <span className="mr-2 text-black dark:text-black">:</span>
              <span className="text-black dark:text-black">{dob}</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex">
              <span className="w-32 text-black dark:text-black">SL.NO</span>
              <span className="mr-2 text-black dark:text-black">:</span>
              <span className="text-black dark:text-black">{slNo}</span>
            </div>
            <div className="flex">
              <span className="w-32 text-black dark:text-black">CLASS & SEC</span>
              <span className="mr-2 text-black dark:text-black">:</span>
              <span className="text-black dark:text-black">{className}</span>
            </div>
            <div className="flex">
              <span className="w-32 text-black dark:text-black">ROLL NO.</span>
              <span className="mr-2 text-black dark:text-black">:</span>
              <span className="text-black dark:text-black">{rollNo}</span>
            </div>
            <div className="flex">
              <span className="w-32 text-black dark:text-black">ADDRESS</span>
              <span className="mr-2 text-black dark:text-black">:</span>
              <span className="uppercase text-black dark:text-black">{address}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Marks Table */}
      <div className="overflow-x-auto mb-2">
        <table className="w-full border-collapse border border-black dark:border-black text-center text-xs font-bold text-black dark:text-black bg-white dark:bg-white">
          {isHalfYearly ? (
            <>
              <thead>
                <tr className="bg-white dark:bg-white text-black dark:text-black">
                  <th className="border border-black dark:border-black p-1 text-left text-black dark:text-black" rowSpan={2}>
                    Scholastic Areas
                    <div className="text-[10px] font-normal text-black dark:text-black">Subject Name</div>
                  </th>
                  <th className="border border-black dark:border-black p-1 text-black dark:text-black" colSpan={5}>
                    Term I ({term1FullMarks} Marks)
                  </th>
                </tr>
                <tr style={{ backgroundColor: "#FFC000", color: "#000000" }} className="text-black dark:text-black">
                  <th className="border border-black dark:border-black px-1 py-1 w-16 text-black dark:text-black">FA1 (10)</th>
                  <th className="border border-black dark:border-black px-1 py-1 w-16 text-black dark:text-black">FA2 (10)</th>
                  <th className="border border-black dark:border-black px-1 py-1 w-16 text-black dark:text-black">SA1 (80)</th>
                  <th className="border border-black dark:border-black px-1 py-1 w-20 text-black dark:text-black">Total</th>
                  <th className="border border-black dark:border-black px-1 py-1 w-16 text-black dark:text-black">Grade</th>
                </tr>
              </thead>
              <tbody>
                {formattedSubjects.map((sub, idx) => (
                  <tr key={idx} className="bg-white dark:bg-white text-black dark:text-black hover:bg-gray-50 dark:hover:bg-gray-100">
                    <td className="border border-black dark:border-black p-1.5 text-left font-bold text-black dark:text-black">
                      {sub.name}
                    </td>
                    <td className="border border-black dark:border-black p-1 text-black dark:text-black">{sub.fa1}</td>
                    <td className="border border-black dark:border-black p-1 text-black dark:text-black">{sub.fa2}</td>
                    <td className="border border-black dark:border-black p-1 text-black dark:text-black">{sub.sa1}</td>
                    <td className="border border-black dark:border-black p-1 font-extrabold text-black dark:text-black">{sub.term1Total}</td>
                    <td className="border border-black dark:border-black p-1 font-extrabold text-black dark:text-black">{sub.grade1}</td>
                  </tr>
                ))}
                {/* Total Row */}
                <tr style={{ backgroundColor: "#D9D9D9", color: "#000000" }} className="font-extrabold text-black dark:text-black">
                  <td className="border border-black dark:border-black p-1.5 text-left text-black dark:text-black">Total</td>
                  <td className="border border-black dark:border-black p-1 text-center text-black dark:text-black">{totalFA1}</td>
                  <td className="border border-black dark:border-black p-1 text-center text-black dark:text-black">{totalFA2}</td>
                  <td className="border border-black dark:border-black p-1 text-center text-black dark:text-black">{totalSA1}</td>
                  <td className="border border-black dark:border-black p-1 text-center text-black dark:text-black">{totalTerm1}</td>
                  <td className="border border-black dark:border-black p-1 text-center text-black dark:text-black"></td>
                </tr>
              </tbody>
            </>
          ) : (
            <>
              <thead>
                <tr className="bg-white dark:bg-white text-black dark:text-black">
                  <th className="border border-black dark:border-black p-1 text-left text-black dark:text-black" rowSpan={2}>
                    Scholastic Areas
                    <div className="text-[10px] font-normal text-black dark:text-black">Subject Name</div>
                  </th>
                  <th className="border border-black dark:border-black p-1 text-black dark:text-black" colSpan={5}>
                    Term I ({term1FullMarks} Marks)
                  </th>
                  <th className="border border-black dark:border-black p-1 text-black dark:text-black" colSpan={5}>
                    Term II ({term1FullMarks} Marks)
                  </th>
                  <th className="border border-black dark:border-black p-1 text-black dark:text-black" colSpan={2}>
                    Final Marks & Grade
                  </th>
                </tr>
                <tr style={{ backgroundColor: "#FFC000", color: "#000000" }} className="text-black dark:text-black">
                  <th className="border border-black dark:border-black px-1 py-1 w-12 text-black dark:text-black">FA-I (10)</th>
                  <th className="border border-black dark:border-black px-1 py-1 w-12 text-black dark:text-black">FA-II (10)</th>
                  <th className="border border-black dark:border-black px-1 py-1 w-12 text-black dark:text-black">SA-I (80)</th>
                  <th className="border border-black dark:border-black px-1 py-1 w-14 text-black dark:text-black">TOTAL</th>
                  <th className="border border-black dark:border-black px-1 py-1 w-12 text-black dark:text-black">GRADE</th>

                  <th className="border border-black dark:border-black px-1 py-1 w-12 text-black dark:text-black">FA-III (10)</th>
                  <th className="border border-black dark:border-black px-1 py-1 w-12 text-black dark:text-black">FA-IV (10)</th>
                  <th className="border border-black dark:border-black px-1 py-1 w-12 text-black dark:text-black">SA-II (80)</th>
                  <th className="border border-black dark:border-black px-1 py-1 w-14 text-black dark:text-black">TOTAL</th>
                  <th className="border border-black dark:border-black px-1 py-1 w-12 text-black dark:text-black">Grade</th>

                  <th className="border border-black dark:border-black px-1 py-1 w-16 text-black dark:text-black">Final Marks</th>
                  <th className="border border-black dark:border-black px-1 py-1 w-16 text-black dark:text-black">Final Grade</th>
                </tr>
              </thead>
              <tbody>
                {formattedSubjects.map((sub, idx) => (
                  <tr key={idx} className="bg-white dark:bg-white text-black dark:text-black hover:bg-gray-50 dark:hover:bg-gray-100">
                    <td className="border border-black dark:border-black p-1.5 text-left font-bold text-black dark:text-black">
                      {sub.name}
                    </td>
                    <td className="border border-black dark:border-black p-1 text-black dark:text-black">{sub.fa1}</td>
                    <td className="border border-black dark:border-black p-1 text-black dark:text-black">{sub.fa2}</td>
                    <td className="border border-black dark:border-black p-1 text-black dark:text-black">{sub.sa1}</td>
                    <td className="border border-black dark:border-black p-1 font-extrabold text-black dark:text-black">{sub.term1Total}</td>
                    <td className="border border-black dark:border-black p-1 text-black dark:text-black">{sub.grade1}</td>

                    <td className="border border-black dark:border-black p-1 text-black dark:text-black">{sub.fa3}</td>
                    <td className="border border-black dark:border-black p-1 text-black dark:text-black">{sub.fa4}</td>
                    <td className="border border-black dark:border-black p-1 text-black dark:text-black">{sub.sa2}</td>
                    <td className="border border-black dark:border-black p-1 font-extrabold text-black dark:text-black">{sub.term2Total}</td>
                    <td className="border border-black dark:border-black p-1 text-black dark:text-black">{sub.grade2}</td>

                    <td className="border border-black dark:border-black p-1 font-extrabold text-black dark:text-black">{sub.finalMarks}</td>
                    <td className="border border-black dark:border-black p-1 font-extrabold text-black dark:text-black">{sub.finalGrade}</td>
                  </tr>
                ))}
                {/* Total Row */}
                <tr style={{ backgroundColor: "#D9D9D9", color: "#000000" }} className="font-extrabold text-black dark:text-black">
                  <td className="border border-black dark:border-black p-1.5 text-left text-black dark:text-black">Total</td>
                  <td className="border border-black dark:border-black p-1 text-black dark:text-black" colSpan={3}></td>
                  <td className="border border-black dark:border-black p-1 text-center text-black dark:text-black">{totalTerm1}</td>
                  <td className="border border-black dark:border-black p-1 text-black dark:text-black"></td>

                  <td className="border border-black dark:border-black p-1 text-black dark:text-black" colSpan={3}></td>
                  <td className="border border-black dark:border-black p-1 text-center text-black dark:text-black">{totalTerm2}</td>
                  <td className="border border-black dark:border-black p-1 text-black dark:text-black"></td>

                  <td className="border border-black dark:border-black p-1 text-center text-black dark:text-black">{finalTotalObtained}</td>
                  <td className="border border-black dark:border-black p-1 text-center text-black dark:text-black">{overallGrade}</td>
                </tr>
              </tbody>
            </>
          )}
        </table>
      </div>

      {/* Summary Highlight Cards */}
      <div className="grid grid-cols-3 gap-2 mb-2 font-bold text-center text-black dark:text-black">
        {/* Box 1: Overall Marks */}
        <div className="border border-black dark:border-black flex text-black dark:text-black bg-white dark:bg-white">
          <div className="w-1/2 p-2 flex items-center justify-center uppercase text-xs text-black dark:text-black" style={{ backgroundColor: "#FFC000", color: "#000000" }}>
            OVERALL MARKS
          </div>
          <div className="w-1/2 p-2 flex flex-col justify-center bg-white dark:bg-white border-l border-black dark:border-black text-sm font-extrabold text-black dark:text-black">
            <div className="text-black dark:text-black">{displayedObtained}</div>
            <div className="border-t border-black dark:border-black text-xs font-bold pt-0.5 text-black dark:text-black">{displayedFull}</div>
          </div>
        </div>

        {/* Box 2: Overall Percentage */}
        <div className="border border-black dark:border-black flex text-black dark:text-black bg-white dark:bg-white">
          <div className="w-1/2 p-2 flex items-center justify-center uppercase text-xs text-black dark:text-black" style={{ backgroundColor: "#FFC000", color: "#000000" }}>
            OVERALL PERCENTAGE
          </div>
          <div className="w-1/2 p-2 flex items-center justify-center bg-white dark:bg-white border-l border-black dark:border-black text-sm font-extrabold text-black dark:text-black">
            {displayedPercentage.toFixed(2)} %
          </div>
        </div>

        {/* Box 3: Overall Grade */}
        <div className="border border-black dark:border-black flex text-black dark:text-black bg-white dark:bg-white">
          <div className="w-1/2 p-2 flex items-center justify-center uppercase text-xs text-black dark:text-black" style={{ backgroundColor: "#FFC000", color: "#000000" }}>
            OVERALL GRADE
          </div>
          <div className="w-1/2 p-2 flex items-center justify-center bg-white dark:bg-white border-l border-black dark:border-black text-lg font-black text-black dark:text-black">
            {displayedGrade}
          </div>
        </div>
      </div>

      {/* Attendance & Rank Box */}
      <div className="grid grid-cols-3 gap-2 mb-2 font-bold text-center text-black dark:text-black">
        <div className="border border-black dark:border-black flex text-black dark:text-black bg-white dark:bg-white">
          <div className="w-1/2 p-2 flex items-center justify-center uppercase text-xs text-black dark:text-black" style={{ backgroundColor: "#FFC000", color: "#000000" }}>
            RANK IN CLASS
          </div>
          <div className="w-1/2 p-2 flex items-center justify-center bg-white dark:bg-white border-l border-black dark:border-black text-sm font-extrabold text-black dark:text-black">
            {rankDisplay}
          </div>
        </div>

        <div className="border border-black dark:border-black flex text-black dark:text-black bg-white dark:bg-white">
          <div className="w-1/2 p-2 flex items-center justify-center uppercase text-xs text-black dark:text-black" style={{ backgroundColor: "#FFC000", color: "#000000" }}>
            TOTAL WORKING DAYS
          </div>
          <div className="w-1/2 p-2 flex items-center justify-center bg-white dark:bg-white border-l border-black dark:border-black text-sm font-extrabold text-black dark:text-black">
            {workingDaysDisplay}
          </div>
        </div>

        <div className="border border-black dark:border-black flex text-black dark:text-black bg-white dark:bg-white">
          <div className="w-1/2 p-2 flex items-center justify-center uppercase text-xs text-black dark:text-black" style={{ backgroundColor: "#FFC000", color: "#000000" }}>
            TOTAL ATTENDANCE
          </div>
          <div className="w-1/2 p-2 flex items-center justify-center bg-white dark:bg-white border-l border-black dark:border-black text-sm font-extrabold text-black dark:text-black">
            {attendanceDisplay}
          </div>
        </div>
      </div>

      {/* Co-Scholastic & Remarks Box */}
      <div className="border border-black dark:border-black grid grid-cols-3 gap-0 mb-2 font-bold text-xs text-black dark:text-black bg-white dark:bg-white">
        <div className="flex border-r border-black dark:border-black">
          <div className="w-1/2 p-1.5 flex items-center uppercase text-black dark:text-black" style={{ backgroundColor: "#FFC000", color: "#000000" }}>
            CLASS TEACHER REMARKS:
          </div>
          <div className="w-1/2 p-1.5 flex items-center justify-center bg-white dark:bg-white border-l border-black dark:border-black font-semibold text-[11px] text-black dark:text-black">
            {ms.teacher_remarks || (isHalfYearly ? "Average" : "Outstanding Performance")}
          </div>
        </div>

        <div className="flex border-r border-black dark:border-black">
          <div className="w-1/2 p-1.5 flex items-center justify-center uppercase text-black dark:text-black" style={{ backgroundColor: "#FFC000", color: "#000000" }}>
            {isHalfYearly ? "BEHAVIOUR" : "DRAWING"}
          </div>
          <div className="w-1/2 p-1.5 flex items-center justify-center bg-white dark:bg-white border-l border-black dark:border-black font-extrabold text-xs text-black dark:text-black uppercase">
            {isHalfYearly ? (ms.behaviour_grade || "GOOD") : (ms.drawing_grade || "A1")}
          </div>
        </div>

        <div className="flex">
          <div className="w-1/2 p-1.5 flex items-center justify-center uppercase text-black dark:text-black" style={{ backgroundColor: "#FFC000", color: "#000000" }}>
            CLEANLINESS
          </div>
          <div className="w-1/2 p-1.5 flex items-center justify-center bg-white dark:bg-white border-l border-black dark:border-black font-semibold text-[11px] text-black dark:text-black uppercase">
            {ms.cleanliness_grade || (isHalfYearly ? "GOOD" : "Very Neat & Clean")}
          </div>
        </div>
      </div>

      {/* Grade Chart Box */}
      <div
        className="border border-black dark:border-black p-1.5 mb-6 text-center font-bold text-[11px] text-black dark:text-black"
        style={{ backgroundColor: "#C5E0B4", color: "#000000" }}
      >
        <div className="underline uppercase font-extrabold mb-1 text-black dark:text-black">GRADE CHART</div>
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-black dark:text-black">
          <span>{a1Min}–{a1Max} ☐A1;</span>
          <span>{a2Min}–{a2Max} ☐A2;</span>
          <span>{b1Min}–{b1Max} ☐B1;</span>
          <span>{b2Min}–{b2Max} ☐B2;</span>
          <span>{c1Min}–{c1Max} ☐C1;</span>
          <span>{c2Min}–{c2Max} ☐C2;</span>
          <span>Below {c2Min} ●D1</span>
        </div>
      </div>

      {/* Footer Signatures */}
      <div className="flex justify-between items-end pt-4 font-bold text-xs px-2 text-black dark:text-black bg-white dark:bg-white">
        <div className="space-y-1 text-black dark:text-black">
          <div>PLACE: GURUKUL SCHOOL, SUJANPUR</div>
          <div>DATE : {new Date().toLocaleDateString("en-GB")}</div>
        </div>
        <div className="text-center font-extrabold uppercase text-black dark:text-black">
          CLASS TEACHER
        </div>
        <div className="text-right font-extrabold uppercase text-black dark:text-black">
          PRINCIPAL
        </div>
      </div>
    </div>
  );
}
