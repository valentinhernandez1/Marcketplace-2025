import { mockUsers } from "../../../core/models/User.js";

function simulateDelay(ms = 350) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function loginApi(email, password) {
  await simulateDelay();

  const user = mockUsers.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    throw new Error("Credenciales incorrectas");
  }

  return {
    ...user,
    token: "fake-jwt-token-" + user.id,
  };
}

export async function getProfileApi(token) {
  await simulateDelay();

  const id = token?.replace("fake-jwt-token-", "");
  return mockUsers.find((u) => u.id === id) || null;
}
