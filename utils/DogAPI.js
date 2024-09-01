// Set a default base URL and default header with API key
let instance = axios.create({
  baseURL: "https://api.thedogapi.com/v1/",
  headers: {
    common: {
      "x-api-key":
        "live_lnWw90LcX2Rest9Qu6uMcJcjLxcYpHjr9eHHKJ2Vu5YDThjBy8FAJSEXCPdL8qCb",
    },
  },
});
// Get Images
export const getImages = (page = 0, limit = 10, order = "DESC") =>
  instance.get(
    `images/search?has_breeds=true&limit=${limit}&page=${page}&order=${order}`
  );
