<<<<<<<< HEAD:public/build/assets/readmissionApi-QJTEBzEe.js
import{a as s}from"./api-CmYH3cs1.js";const i="/readmissions",l={eligible:e=>s.get(i+"/eligible",{params:e}),prefill:e=>s.get(`${i}/prefill/${e}`),previewFees:(e,o)=>s.get(`${i}/preview-fees/${e}`,{params:{admission_head_id:o}}),process:e=>s.post(i+"/process",e),bulk:e=>s.post(i+"/bulk",e),history:e=>s.get(i+"/history",{params:e}),rollback:e=>s.post(`${i}/${e}/rollback`)};export{l as R};
========
import{a as s}from"./api-w-WR6HpR.js";const i="/readmissions",l={eligible:e=>s.get(i+"/eligible",{params:e}),prefill:e=>s.get(`${i}/prefill/${e}`),previewFees:(e,o)=>s.get(`${i}/preview-fees/${e}`,{params:{admission_head_id:o}}),process:e=>s.post(i+"/process",e),bulk:e=>s.post(i+"/bulk",e),history:e=>s.get(i+"/history",{params:e}),rollback:e=>s.post(`${i}/${e}/rollback`)};export{l as R};
>>>>>>>> b70cf2feb58b57d3010817f9fb9527c61b4dc6d5:public/build/assets/readmissionApi-BT52Ji6k.js
