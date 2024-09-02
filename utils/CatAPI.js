import * as ProgressBar from "./ProgressBar.js";

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

instance.interceptors.request.use(
  (config) => {
    config.metadata = { ...config.metadata, elapsedTime: {} };
    config.metadata.elapsedTime.start = Date.now();
    console.log("Axious request begins:", config);
    return config;
  },
  (error) => {
    console.log("Axious request failed:", error);
    return error;
  }
);

instance.interceptors.response.use(
  (response) => {
    const elapsedTime = response.config.metadata.elapsedTime;
    elapsedTime.end = Date.now();
    elapsedTime.total = elapsedTime.end - elapsedTime.start;
    console.log(`The request took ${elapsedTime.total} ms.`);
    return response;
  },
  (error) => {
    console.log("Axious response failed:", error);
    return error;
  }
);

function updateProgress(progressEvent) {
  console.log("ProgressEvent:", progressEvent);
  progressEvent.progress && ProgressBar.set(progressEvent.progress * 100);
}

// Get Images
export const getImages = (page = 0, limit = 10, order = "DESC", breeds = []) =>
  instance.get(
    `images/search?has_breeds=true&limit=${limit}&page=${page}&order=${order}&breed_ids=${breeds.join(
      ","
    )}`,
    {
      onDownloadProgress: updateProgress,
    }
  );

// Get Breeds
export const getBreeds = () => instance.get(`breeds`);

// Get Favourites
export const getFavourites = () =>
  instance.get("favourites", {
    onDownloadProgress: updateProgress,
  });

// Add Favourite ID
export const addFavourite = (imgId) =>
  instance.post("favourites", {
    image_id: imgId,
    sub_id: "SBA 308A",
  });

// Delete Favourite ID
export const deleteFavourite = (imgId) =>
  instance.delete(`favourites/${imgId}`);
