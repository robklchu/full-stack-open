import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;

async function getAll() {
  const response = await axios.get(baseUrl);
  return response.data;
}

function setToken(newToken) {
  token = `Bearer ${newToken}`;
}

async function create(newObject) {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
}

async function update(id, updatedObject) {
  const response = await axios.put(`${baseUrl}/${id}`, updatedObject);
  return response.data;
}

export default { getAll, setToken, create, update };
