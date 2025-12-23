export const redirectWithPost = (url, data = {}) => {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = url;

  Object.keys(data).forEach((key) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = data[key];
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
};
