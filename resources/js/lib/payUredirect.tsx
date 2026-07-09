const redirectToPayU = (paymentData: any) => {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = paymentData.payment_url;

  Object.entries(paymentData.params).forEach(([key, value]) => {
    if (value === null) return;

    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = String(value);
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
};

export default redirectToPayU;
