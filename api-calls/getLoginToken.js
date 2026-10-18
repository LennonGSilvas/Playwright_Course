import * as nodeFetch from "node-fetch";

export const getLoginToken = async (username, password) => {
  const response = await nodeFetch("http://localhost:2221/api/login", {
    method: "POST",
    body: JSON.stringify({ username: username, password: password }),
  });

  if (response.status !== 200) {
    throw new Error("Um erro ocorreu ao tentar retornar o token de login");
  }

  const body = await response.json();
  return body.token;
};
