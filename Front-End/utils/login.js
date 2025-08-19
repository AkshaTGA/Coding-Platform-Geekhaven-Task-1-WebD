export const handlelogin = async (email, password) => {
  const payload = {
    email: email,
    password: password,
  };
  return await fetch("http://localhost:3000/api/v1/auth/login", {
    method: "POST",
    credentials: "include",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  });
};
