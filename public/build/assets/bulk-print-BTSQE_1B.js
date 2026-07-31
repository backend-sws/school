import{c as b,r as f,j as e,H as h}from"./app-BJxM59Bp.js";import{G as k}from"./GurukulReportCard-BL8uAlxI.js";import"./app-gSMFNvRx.js";function g(o){const t=b.c(14),{exam:n,marksheets:c}=o;let m;t[0]===Symbol.for("react.memo_cache_sentinel")?(m=[],t[0]=m):m=t[0],f.useEffect(j,m);const u=`Bulk Print: ${n.name}`;let a;t[1]!==u?(a=e.jsx(h,{title:u}),t[1]=u,t[2]=a):a=t[2];let l;t[3]===Symbol.for("react.memo_cache_sentinel")?(l=e.jsx("style",{dangerouslySetInnerHTML:{__html:`
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
      `}}),t[3]=l):l=t[3];let r;if(t[4]!==n||t[5]!==c){let d;t[7]!==n?(d=(s,x)=>e.jsx("div",{className:"page-break max-w-5xl mx-auto mb-10 print:mb-0",children:e.jsx(k,{institution:s.reportCardInstitution||s.institution,student:s.student,exam:n,marksheet:s.marksheet})},s.student.id||x),t[7]=n,t[8]=d):d=t[8],r=c.map(d),t[4]=n,t[5]=c,t[6]=r}else r=t[6];let i;t[9]!==r?(i=e.jsx("div",{className:"bg-white min-h-screen text-black print:bg-transparent p-4",children:r}),t[9]=r,t[10]=i):i=t[10];let p;return t[11]!==a||t[12]!==i?(p=e.jsxs(e.Fragment,{children:[a,l,i]}),t[11]=a,t[12]=i,t[13]=p):p=t[13],p}function j(){const o=setTimeout(w,600);return()=>clearTimeout(o)}function w(){window.print()}g.layout=o=>e.jsx(e.Fragment,{children:o});export{g as default};
