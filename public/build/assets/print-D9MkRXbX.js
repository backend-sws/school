import{c as f,r as h,j as e,H as g}from"./app-Cm9FiIg0.js";import{G as k}from"./GurukulAdmitCard-DWHThKxC.js";import"./app-CO_KHxlD.js";function j(s){const t=f.c(14),{exam:a,lmsClass:x,admitCards:c}=s;let o;t[0]===Symbol.for("react.memo_cache_sentinel")?(o=[],t[0]=o):o=t[0],h.useEffect(w,o);const u=`Admit Cards - ${x?.name} (${a?.name})`;let n;t[1]!==u?(n=e.jsx(g,{title:u}),t[1]=u,t[2]=n):n=t[2];let m;t[3]===Symbol.for("react.memo_cache_sentinel")?(m=e.jsx("style",{dangerouslySetInnerHTML:{__html:`
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
            border: 2px solid #000 !important;
            box-shadow: none !important;
            width: 100% !important;
            max-width: 100% !important;
            padding: 10px !important;
            margin: 0 auto !important;
          }
        }
      `}}),t[3]=m):m=t[3];let r;if(t[4]!==c||t[5]!==a){let d;t[7]!==a?(d=(p,b)=>e.jsx("div",{className:"page-break max-w-4xl mx-auto mb-10 print:mb-0",children:e.jsx(k,{institution:p.institution,student:p.student,exam:a,schedules:p.schedules})},p.student?.id||b),t[7]=a,t[8]=d):d=t[8],r=c.map(d),t[4]=c,t[5]=a,t[6]=r}else r=t[6];let i;t[9]!==r?(i=e.jsx("div",{className:"bg-white min-h-screen text-black print:bg-transparent p-4",children:r}),t[9]=r,t[10]=i):i=t[10];let l;return t[11]!==n||t[12]!==i?(l=e.jsxs(e.Fragment,{children:[n,m,i]}),t[11]=n,t[12]=i,t[13]=l):l=t[13],l}function w(){const s=setTimeout(_,600);return()=>clearTimeout(s)}function _(){window.print()}j.layout=s=>e.jsx(e.Fragment,{children:s});export{j as default};
