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
export const getImages = (page = 0, limit = 10, order = "DESC", breeds = []) =>
  instance.get(
    `images/search?has_breeds=true&limit=${limit}&page=${page}&order=${order}&breed_ids=${breeds.join(",")}`
  );

// Get Breeds
export const getBreeds = () => instance.get(`breeds`);

// Get Favourites
export const getFavourites = () => instance.get("favourites");

// Add Favourite ID
export const addFavourite = (imgId) =>
  instance.post("favourites", {
    image_id: imgId,
    sub_id: "SBA 308A",
  });

// Delete Favourite ID
export const deleteFavourite = (imgId) => instance.delete(`favourites/${imgId}`);
