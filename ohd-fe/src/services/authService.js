export function getAuth() {
  const data = localStorage.getItem("ohd_auth");
  return data ? JSON.parse(data) : null;
}

export function isLoggedIn() {
  return !!getAuth()?.token;
}

export function logout() {
  localStorage.removeItem("ohd_auth");
}