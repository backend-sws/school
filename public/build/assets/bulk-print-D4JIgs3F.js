import{c as g,r as b,j as e,H as k}from"./app-CpL1Q3Bt.js";import{G as w}from"./GurukulReportCard-_eWbFwiL.js";import"./app-B7qWJiIz.js";function j(f){const t=g.c(17),{exam:n,marksheets:h}=f,[r,y]=b.useState("final");let p,m;t[0]===Symbol.for("react.memo_cache_sentinel")?(p=()=>{if(typeof window<"u"){const a=new URLSearchParams(window.location.search),u=a.get("report_type")||a.get("type");(u==="half_yearly"||u==="half")&&y("half_yearly")}const l=setTimeout(_,600);return()=>clearTimeout(l)},m=[],t[0]=p,t[1]=m):(p=t[0],m=t[1]),b.useEffect(p,m);const x=`Bulk Print (${r==="half_yearly"?"Half Yearly":"Annual"}): ${n.name}`;let i;t[2]!==x?(i=e.jsx(k,{title:x}),t[2]=x,t[3]=i):i=t[3];let d;t[4]===Symbol.for("react.memo_cache_sentinel")?(d=e.jsx("style",{dangerouslySetInnerHTML:{__html:`
        @page {
          size: A4 portrait;
          margin: 4mm 6mm;
        }
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          body { background: white !important; }
          .page-break { page-break-after: always; break-after: page; page-break-inside: avoid; break-inside: avoid; }
          .page-break:last-child { page-break-after: auto; break-after: auto; }
          #theme-root > div:last-child { display: none !important; }
          .printable-marksheet {
            border: 1px solid #000 !important;
            box-shadow: none !important;
            width: 100% !important;
            max-width: 100% !important;
            padding: 10px !important;
            margin: 0 auto !important;
          }
        }
      `}}),t[4]=d):d=t[4];let o;if(t[5]!==n||t[6]!==h||t[7]!==r){let l;t[9]!==n||t[10]!==r?(l=(a,u)=>e.jsx("div",{className:"page-break max-w-5xl mx-auto mb-10 print:mb-0",children:e.jsx(w,{reportType:r,institution:a.reportCardInstitution||a.institution,student:a.student,exam:n,marksheet:a.marksheet})},a.student?.id||u),t[9]=n,t[10]=r,t[11]=l):l=t[11],o=h.map(l),t[5]=n,t[6]=h,t[7]=r,t[8]=o}else o=t[8];let s;t[12]!==o?(s=e.jsx("div",{className:"bg-white min-h-screen text-black print:bg-transparent p-4",children:o}),t[12]=o,t[13]=s):s=t[13];let c;return t[14]!==i||t[15]!==s?(c=e.jsxs(e.Fragment,{children:[i,d,s]}),t[14]=i,t[15]=s,t[16]=c):c=t[16],c}function _(){window.print()}j.layout=f=>e.jsx(e.Fragment,{children:f});export{j as default};
