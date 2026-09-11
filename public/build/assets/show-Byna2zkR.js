import{c as z,r as G,j as e,H as I}from"./app-BTJ-XKva.js";import{E as U}from"./breadcrumbs-68cs4gBf.js";import{M as L}from"./MainPageHeader-iH1OSA-A.js";import{B as Y}from"./button-BqFnQN07.js";import{G as D}from"./GurukulReportCard-CpQVcJbs.js";import{A as J}from"./award-Y3tEQqbN.js";import{F as K}from"./file-text-Ch1JnOBN.js";import{P as V}from"./printer-BTVJs0Um.js";import"./app-Cank25iK.js";import"./breadcrumb-KkMKripD.js";import"./chevron-right-CLkR0SF9.js";import"./index-DyVHCU3Y.js";import"./loader-circle-CgPIoltB.js";function lt(T){const t=z.c(42),{marksheet:v,exam:n,student:u,reportCardInstitution:F,institution:B}=T,[a,H]=G.useState("final"),P=u?.name||u?.user?.name||"RAJVEER KUMAR GUPTA",k=F||B,R=`Report Card: ${P} - ${n?.name||"Exam"}`;let r;t[0]!==R?(r=e.jsx(I,{title:R}),t[0]=R,t[1]=r):r=t[1];let h;t[2]===Symbol.for("react.memo_cache_sentinel")?(h=e.jsx("style",{dangerouslySetInnerHTML:{__html:`
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
      `}}),t[2]=h):h=t[2];const E=n?.name||"Exam",N=`/examination/exams/${n?.id||""}`;let o;t[3]!==E||t[4]!==N?(o={title:E,href:N},t[3]=E,t[4]=N,t[5]=o):o=t[5];let b;t[6]===Symbol.for("react.memo_cache_sentinel")?(b={title:"Report Card",href:"#"},t[6]=b):b=t[6];let i;t[7]!==o?(i=[...U,o,b],t[7]=o,t[8]=i):i=t[8];const S=`${P}'s Report Card`,A=`${n?.name||"Exam"} - ${n?.term?.name??"Academic Session"}`;let s;t[9]!==A||t[10]!==i||t[11]!==S?(s=e.jsx(L,{breadcrumbs:i,icon:J,title:S,subtitle:A}),t[9]=A,t[10]=i,t[11]=S,t[12]=s):s=t[12];let g;t[13]===Symbol.for("react.memo_cache_sentinel")?(g=e.jsxs("span",{className:"text-xs font-semibold text-muted-foreground flex items-center gap-1",children:[e.jsx(K,{className:"size-4"})," Report Card Format:"]}),t[13]=g):g=t[13];let y;t[14]===Symbol.for("react.memo_cache_sentinel")?(y=()=>H("half_yearly"),t[14]=y):y=t[14];const C=`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${a==="half_yearly"?"bg-primary text-primary-foreground shadow-sm":"text-muted-foreground hover:text-foreground hover:bg-background/50"}`;let l;t[15]!==C?(l=e.jsx("button",{type:"button",onClick:y,className:C,children:"Half Yearly Evaluation"}),t[15]=C,t[16]=l):l=t[16];let j;t[17]===Symbol.for("react.memo_cache_sentinel")?(j=()=>H("final"),t[17]=j):j=t[17];const $=`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${a==="final"?"bg-primary text-primary-foreground shadow-sm":"text-muted-foreground hover:text-foreground hover:bg-background/50"}`;let m;t[18]!==$?(m=e.jsx("button",{type:"button",onClick:j,className:$,children:"Annual / Final Evaluation"}),t[18]=$,t[19]=m):m=t[19];let d;t[20]!==l||t[21]!==m?(d=e.jsxs("div",{className:"flex items-center gap-2",children:[g,e.jsxs("div",{className:"inline-flex items-center p-1 rounded-lg bg-muted border",children:[l,m]})]}),t[20]=l,t[21]=m,t[22]=d):d=t[22];let w;t[23]===Symbol.for("react.memo_cache_sentinel")?(w=e.jsx(V,{className:"size-4 mr-2"}),t[23]=w):w=t[23];const M=a==="half_yearly"?"Half Yearly":"Annual";let p;t[24]!==M?(p=e.jsxs(Y,{variant:"default",onClick:X,className:"h-9 px-4 font-semibold shadow-sm",children:[w,"Print ",M," Report Card"]}),t[24]=M,t[25]=p):p=t[25];let c;t[26]!==d||t[27]!==p?(c=e.jsxs("div",{className:"no-print-bar flex flex-wrap items-center justify-between gap-4 bg-card p-3 rounded-xl border shadow-sm",children:[d,p]}),t[26]=d,t[27]=p,t[28]=c):c=t[28];let f;t[29]!==n||t[30]!==k||t[31]!==v||t[32]!==a||t[33]!==u?(f=e.jsx("div",{className:"printable-marksheet-wrapper flex justify-center w-full",children:e.jsx("div",{className:"max-w-5xl w-full mx-auto",children:e.jsx(D,{reportType:a,institution:k,student:u,exam:n,marksheet:v})})}),t[29]=n,t[30]=k,t[31]=v,t[32]=a,t[33]=u,t[34]=f):f=t[34];let x;t[35]!==s||t[36]!==c||t[37]!==f?(x=e.jsxs("div",{className:"space-y-6",children:[s,c,f]}),t[35]=s,t[36]=c,t[37]=f,t[38]=x):x=t[38];let _;return t[39]!==r||t[40]!==x?(_=e.jsxs(e.Fragment,{children:[r,h,x]}),t[39]=r,t[40]=x,t[41]=_):_=t[41],_}function X(){return window.print()}export{lt as default};
