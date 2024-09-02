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
export const getImages = (page = 0, limit = 10, order = "DESC", breeds = []) =>
  instance.get(
    `images/search?has_breeds=true&limit=${limit}&page=${page}&order=${order}&breed_ids=${breeds.join(",")}`
  );

// Get Breeds
export const getBreeds = () => instance.get(`breeds`);
