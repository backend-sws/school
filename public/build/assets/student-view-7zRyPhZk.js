import{c as w,j as n,H as g}from"./app-BJxM59Bp.js";import{S as k}from"./breadcrumbs-CxqP3Ty0.js";import{M as R}from"./MainPageHeader-i1kq62yk.js";import{B as y}from"./button-BdXNpnTw.js";import{G as _}from"./GurukulReportCard-BL8uAlxI.js";import{A as v}from"./award-BIaIAlgP.js";import{D as A}from"./download-wBvQKbkj.js";import"./app-gSMFNvRx.js";import"./breadcrumb-BXhEeMkS.js";import"./chevron-right-9C-1WXpP.js";import"./index-C-tP_q8a.js";import"./loader-circle-BJHEKyyv.js";function I(h){const t=w.c(18),{marksheet:c,exam:o,student:m,reportCardInstitution:b,institution:j}=h;m?.name||m?.user?.name;const u=b||j,f=`Annual Report Card: ${o?.name||"Exam"}`;let e;t[0]!==f?(e=n.jsx(g,{title:f}),t[0]=f,t[1]=e):e=t[1];let s;t[2]===Symbol.for("react.memo_cache_sentinel")?(s=n.jsx("style",{dangerouslySetInnerHTML:{__html:`
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
      `}}),t[2]=s):s=t[2];let l;t[3]===Symbol.for("react.memo_cache_sentinel")?(l=[...k,{title:"Annual Report Card",href:"#"}],t[3]=l):l=t[3];const x=o?.name||"Exam";let a;t[4]!==x?(a=n.jsx(R,{breadcrumbs:l,icon:v,title:x,subtitle:"Annual Evaluation Report Card"}),t[4]=x,t[5]=a):a=t[5];let p;t[6]===Symbol.for("react.memo_cache_sentinel")?(p=n.jsx("div",{className:"flex justify-end gap-2",children:n.jsxs(y,{variant:"outline",onClick:E,children:[n.jsx(A,{className:"size-4 mr-2"}),"Print / Download Report Card"]})}),t[6]=p):p=t[6];let i;t[7]!==o||t[8]!==u||t[9]!==c||t[10]!==m?(i=n.jsx("div",{className:"printable-marksheet-wrapper flex justify-center w-full",children:n.jsx("div",{className:"max-w-5xl w-full mx-auto",children:n.jsx(_,{institution:u,student:m,exam:o,marksheet:c})})}),t[7]=o,t[8]=u,t[9]=c,t[10]=m,t[11]=i):i=t[11];let r;t[12]!==a||t[13]!==i?(r=n.jsxs("div",{className:"space-y-6",children:[a,p,i]}),t[12]=a,t[13]=i,t[14]=r):r=t[14];let d;return t[15]!==e||t[16]!==r?(d=n.jsxs(n.Fragment,{children:[e,s,r]}),t[15]=e,t[16]=r,t[17]=d):d=t[17],d}function E(){return window.print()}export{I as default};
