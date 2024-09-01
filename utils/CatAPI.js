// Set a default base URL and default header with API key
axios.defaults.headers.common["x-api-key"] =
  "live_Hm391sKMhBqYEpN9XJcKzg37xzH2hacFsgFUv0pkJEF7bZ6CZGfybxg0LpRR5Rfm";
axios.defaults.baseURL = "https://api.thecatapi.com/v1/";

// Get Images
export const getImages = (limit = 20) =>
  axios.get(`images/search?limit=${limit}`);
