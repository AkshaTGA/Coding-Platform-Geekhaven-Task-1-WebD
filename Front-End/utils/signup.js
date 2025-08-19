export const handlesignup = async (name, email, password) => {
  const payload = {
    username: name,
    email: email,
    password: password,
  };
  return await fetch("http://localhost:3000/api/v1/auth/register", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });
};
