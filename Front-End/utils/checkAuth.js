export const isAuthenticated = async () => {
  const res = await fetch("http://localhost:3000/api/v1/auth/checkauth", {
    method: "GET",
    credentials: "include",
  });
  const data = await res.json();
  return data;
};
