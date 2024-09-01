// Set a default base URL and default header with API key
const instance = axios.create({
  baseURL: "https://api.thecatapi.com/v1/",
  headers: {
    common: {
      "x-api-key":
        "live_Hm391sKMhBqYEpN9XJcKzg37xzH2hacFsgFUv0pkJEF7bZ6CZGfybxg0LpRR5Rfm",
    },
  },
});

// Get Images
export const getImages = (limit = 20) =>
  instance.get(`images/search?limit=${limit}`);
