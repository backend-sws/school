import{c as v,j as e,H as A}from"./app-BJxM59Bp.js";import{E}from"./breadcrumbs-CxqP3Ty0.js";import{M as C}from"./MainPageHeader-i1kq62yk.js";import{B as M}from"./button-BdXNpnTw.js";import{G as S}from"./GurukulReportCard-BL8uAlxI.js";import{A as N}from"./award-BIaIAlgP.js";import{P as $}from"./printer-YzthZnzT.js";import"./app-gSMFNvRx.js";import"./breadcrumb-BXhEeMkS.js";import"./chevron-right-9C-1WXpP.js";import"./index-C-tP_q8a.js";import"./loader-circle-BJHEKyyv.js";function V(y){const t=v.c(25),{marksheet:f,exam:n,student:l,reportCardInstitution:R,institution:_}=y,k=l?.name||l?.user?.name||"RAJVEER KUMAR GUPTA",x=R||_,h=`Report Card: ${k} - ${n?.name||"Exam"}`;let a;t[0]!==h?(a=e.jsx(A,{title:h}),t[0]=h,t[1]=a):a=t[1];let p;t[2]===Symbol.for("react.memo_cache_sentinel")?(p=e.jsx("style",{dangerouslySetInnerHTML:{__html:`
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
          aside, nav, header, button, [data-sidebar], .no-print, .MainPageHeader {
            display: none !important;
          }
          html, body, #theme-root, #app, main, .space-y-6 {
            background: white !important;
            color: black !important;
            height: auto !important;
            min-height: 0 !important;
            overflow: visible !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .printable-marksheet-wrapper {
            display: block !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .printable-marksheet {
            border: 1px solid #000 !important;
            box-shadow: none !important;
            width: 100% !important;
            max-width: 100% !important;
            padding: 10px !important;
            margin: 0 auto !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        }
      `}}),t[2]=p):p=t[2];const b=n?.name||"Exam",j=`/examination/exams/${n?.id||""}`;let i;t[3]!==b||t[4]!==j?(i={title:b,href:j},t[3]=b,t[4]=j,t[5]=i):i=t[5];let d;t[6]===Symbol.for("react.memo_cache_sentinel")?(d={title:"Report Card",href:"#"},t[6]=d):d=t[6];let r;t[7]!==i?(r=[...E,i,d],t[7]=i,t[8]=r):r=t[8];const g=`${k}'s Annual Report Card`,w=`${n?.name||"Exam"} - ${n?.term?.name??"Academic Session"}`;let o;t[9]!==w||t[10]!==r||t[11]!==g?(o=e.jsx(C,{breadcrumbs:r,icon:N,title:g,subtitle:w}),t[9]=w,t[10]=r,t[11]=g,t[12]=o):o=t[12];let c;t[13]===Symbol.for("react.memo_cache_sentinel")?(c=e.jsx("div",{className:"flex justify-end gap-2",children:e.jsxs(M,{variant:"outline",onClick:P,className:"h-10",children:[e.jsx($,{className:"size-4 mr-2"}),"Print Report Card"]})}),t[13]=c):c=t[13];let m;t[14]!==n||t[15]!==x||t[16]!==f||t[17]!==l?(m=e.jsx("div",{className:"printable-marksheet-wrapper flex justify-center w-full",children:e.jsx("div",{className:"max-w-5xl w-full mx-auto",children:e.jsx(S,{institution:x,student:l,exam:n,marksheet:f})})}),t[14]=n,t[15]=x,t[16]=f,t[17]=l,t[18]=m):m=t[18];let s;t[19]!==o||t[20]!==m?(s=e.jsxs("div",{className:"space-y-6",children:[o,c,m]}),t[19]=o,t[20]=m,t[21]=s):s=t[21];let u;return t[22]!==s||t[23]!==a?(u=e.jsxs(e.Fragment,{children:[a,p,s]}),t[22]=s,t[23]=a,t[24]=u):u=t[24],u}function P(){return window.print()}export{V as default};
