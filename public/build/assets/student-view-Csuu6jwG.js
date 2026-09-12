import{c as H,r as M,j as e,H as P}from"./app-BZl-7ex2.js";import{S as F}from"./breadcrumbs-68cs4gBf.js";import{M as B}from"./MainPageHeader-ClYekXnt.js";import{B as U}from"./button-BJNI65VA.js";import{G as $}from"./GurukulReportCard-DxICECMG.js";import{A as z}from"./award-CNRiFBc-.js";import{F as G}from"./file-text-0ds7br1N.js";import{P as D}from"./printer-_WDYmrZC.js";import"./app-DyCJ9so6.js";import"./breadcrumb-5qPxJb3q.js";import"./chevron-right-CDeS_ByN.js";import"./index-B-EsgjT5.js";import"./loader-circle-CTCM0qWl.js";function nt(S){const t=H.c(35),{marksheet:w,exam:c,student:f,reportCardInstitution:C,institution:T}=S,[n,E]=M.useState("final");f?.name||f?.user?.name;const _=C||T,v=`Annual Report Card: ${c?.name||"Exam"}`;let r;t[0]!==v?(r=e.jsx(P,{title:v}),t[0]=v,t[1]=r):r=t[1];let u;t[2]===Symbol.for("react.memo_cache_sentinel")?(u=e.jsx("style",{dangerouslySetInnerHTML:{__html:`
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
          aside, nav, header, button, [data-sidebar], .no-print, .MainPageHeader, .no-print-bar {
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
      `}}),t[2]=u):u=t[2];let x;t[3]===Symbol.for("react.memo_cache_sentinel")?(x=[...F,{title:"Annual Report Card",href:"#"}],t[3]=x):x=t[3];const k=c?.name||"Exam";let a;t[4]!==k?(a=e.jsx(B,{breadcrumbs:x,icon:z,title:k,subtitle:"Annual Evaluation Report Card"}),t[4]=k,t[5]=a):a=t[5];let h;t[6]===Symbol.for("react.memo_cache_sentinel")?(h=e.jsxs("span",{className:"text-xs font-semibold text-muted-foreground flex items-center gap-1",children:[e.jsx(G,{className:"size-4"})," Report Card Format:"]}),t[6]=h):h=t[6];let b;t[7]===Symbol.for("react.memo_cache_sentinel")?(b=()=>E("half_yearly"),t[7]=b):b=t[7];const R=`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${n==="half_yearly"?"bg-primary text-primary-foreground shadow-sm":"text-muted-foreground hover:text-foreground hover:bg-background/50"}`;let o;t[8]!==R?(o=e.jsx("button",{type:"button",onClick:b,className:R,children:"Half Yearly Evaluation"}),t[8]=R,t[9]=o):o=t[9];let g;t[10]===Symbol.for("react.memo_cache_sentinel")?(g=()=>E("final"),t[10]=g):g=t[10];const A=`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${n==="final"?"bg-primary text-primary-foreground shadow-sm":"text-muted-foreground hover:text-foreground hover:bg-background/50"}`;let i;t[11]!==A?(i=e.jsx("button",{type:"button",onClick:g,className:A,children:"Annual / Final Evaluation"}),t[11]=A,t[12]=i):i=t[12];let s;t[13]!==o||t[14]!==i?(s=e.jsxs("div",{className:"flex items-center gap-2",children:[h,e.jsxs("div",{className:"inline-flex items-center p-1 rounded-lg bg-muted border",children:[o,i]})]}),t[13]=o,t[14]=i,t[15]=s):s=t[15];let y;t[16]===Symbol.for("react.memo_cache_sentinel")?(y=e.jsx(D,{className:"size-4 mr-2"}),t[16]=y):y=t[16];const N=n==="half_yearly"?"Half Yearly":"Annual";let l;t[17]!==N?(l=e.jsxs(U,{variant:"default",onClick:I,className:"h-9 px-4 font-semibold shadow-sm",children:[y,"Print ",N," Report Card"]}),t[17]=N,t[18]=l):l=t[18];let m;t[19]!==s||t[20]!==l?(m=e.jsxs("div",{className:"no-print-bar flex flex-wrap items-center justify-between gap-4 bg-card p-3 rounded-xl border shadow-sm",children:[s,l]}),t[19]=s,t[20]=l,t[21]=m):m=t[21];let p;t[22]!==c||t[23]!==_||t[24]!==w||t[25]!==n||t[26]!==f?(p=e.jsx("div",{className:"printable-marksheet-wrapper flex justify-center w-full",children:e.jsx("div",{className:"max-w-5xl w-full mx-auto",children:e.jsx($,{reportType:n,institution:_,student:f,exam:c,marksheet:w})})}),t[22]=c,t[23]=_,t[24]=w,t[25]=n,t[26]=f,t[27]=p):p=t[27];let d;t[28]!==m||t[29]!==p||t[30]!==a?(d=e.jsxs("div",{className:"space-y-6",children:[a,m,p]}),t[28]=m,t[29]=p,t[30]=a,t[31]=d):d=t[31];let j;return t[32]!==r||t[33]!==d?(j=e.jsxs(e.Fragment,{children:[r,u,d]}),t[32]=r,t[33]=d,t[34]=j):j=t[34],j}function I(){return window.print()}export{nt as default};
