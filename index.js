import * as Gallery from "./utils/Gallery.js";
import * as Filter from "./utils/Filter.js";
import * as CatAPI from "./utils/CatAPI.js";
import * as DogAPI from "./utils/DogAPI.js";

// Flag to check if a lazy load request is already running
let isLazyLoad = false;

// Create galery params to use them in fetch
let params = {};

// The navbar element.
const navbar = document.querySelector(".navbar");

// Add click event for navbar elements
navbar.addEventListener("click", (e) => {
  console.log(e.target);
  // Immediately return if the element clicked was not an <a> element.
  if (e.target.tagName.toLowerCase() !== "a") return;
  // Call the event object's preventDefault() method
  e.preventDefault();
  // Add the active class to the <a> element that was clicked
  e.target.classList.add("active");
  // Convert href to Url object
  const url = new URL(e.target.href);
  switch (url.hash) {
    case "#favourites":
      getFavourites();
      break;
    default:
  }
});

// Add scroll event for lazy load
window.addEventListener("scroll", lazyLoad);

(function initialLoad() {
  // Clear galery before populate new items
  Gallery.clear();
  // Initialize params
  params = {
    page: 0,
    limit: 10,
    order: "DESC",
    breeds: {},
    isFiltered: false,
    isNextPage: true,
  };
  // Load images to gallery
  loadImagesToGallery(params);
  // Load Filters
  loadFilters();
})();

// Load filters
async function loadFilters() {
  try {
    // Fetch breeds from Cat API and Dog API
    const catFetch = await CatAPI.getBreeds();
    const dogFetch = await DogAPI.getBreeds();
    console.log(catFetch, dogFetch);
    // Get breeds data simultaneously
    const [catData, dogData] = await Promise.all([catFetch, dogFetch]);
    console.log(catData, dogData);
    // Parse JSON responses from fetched data into objects arrays
    const catBreeds = await catData.data;
    const dogBreeds = await dogData.data;
    console.log(catBreeds, dogBreeds);
    // Load Filters
    Filter.loadFilters([
      { type: "cats", breeds: catBreeds },
      { type: "dogs", breeds: dogBreeds },
    ]);
  } catch (error) {
    console.log("ERROR:", error);
  }
}

// Load filtered images to gallery
export function loadFilteredImagesToGallery(isFiltered = true, breeds = {}) {
  // Clear galery before populate new items
  Gallery.clear();
  // Load images to gallery
  params.page = 0;
  params.isFiltered = isFiltered;
  params.breeds = breeds;
  loadImagesToGallery(params);
}

// Load images to gallery
async function loadImagesToGallery(params) {
  try {
    const { page, limit, order, breeds, isFiltered } = params;
    // Fetch images from Cat API and Dog API
    const catFetch = isFiltered
      ? CatAPI.getImages(page, limit, order, breeds.cats || ["none"])
      : CatAPI.getImages(page, limit, order);
    const dogFetch = isFiltered
      ? DogAPI.getImages(page, limit, order, breeds.dogs || ["none"])
      : DogAPI.getImages(page, limit, order);
    console.log(catFetch, dogFetch);
    // Get images data simultaneously
    const [catData, dogData] = await Promise.all([catFetch, dogFetch]);
    console.log(catData, dogData);
    // Parse JSON responses from fetched data into objects arrays
    const catImages = await catData.data.map((i) => ({ ...i, type: "cats" }));
    const dogImages = await dogData.data.map((i) => ({ ...i, type: "dogs" }));
    console.log(catImages, dogImages);
    // Combine and shuffle all images using spread operator
    const images = shuffleImages([...catImages, ...dogImages]);
    // If return images, set isNextPage to true, otherwise false
    params.isNextPage = images.length > 0;
    // For each image in the response array, create a new element and append it to the carousel
    images.forEach(async (image) => {
      // Create gallery item using HTML template
      const galleryItem = Gallery.createGalleryItem(image.id, image.type);
      // Append each of these new elements to the gallery
      Gallery.appendGallery(galleryItem);
      // Wait until image loads and completely renders
      await Gallery.loadImage(image.url, galleryItem);
      // Apply Masonry script to updated gallery
      new Masonry(".gallery", { percentPosition: true });
    });
  } catch (error) {
    console.log("ERROR:", error);
  } finally {
    // Reset isLazyLoadStarted flag
    isLazyLoad = false;
  }
}

// Function to shuffle images using the sort method with a random comparator
function shuffleImages(images) {
  return images.sort(() => Math.random() - 0.5);
}

// Function that loads pack of images if the scrolled height is bigger than the whole scroll height of the body minus 5 pixels.
function lazyLoad() {
  const scrolledHeight = window.innerHeight + window.scrollY;
  const totalHeight = document.body.offsetHeight - 5;
  const isNextPage = params.isNextPage;
  if (isNextPage && !isLazyLoad && scrolledHeight > totalHeight) {
    isLazyLoad = true;
    params.page++;
    console.log(params);
    loadImagesToGallery(params);
  }
}

export async function favourite(imgId, imgType) {
  console.log("favourite():", imgId, imgType);
  try {
    const favouriteId = await getFavouriteId(imgId, imgType);
    if (favouriteId) {
      const response =
        imgType === "cats"
          ? await CatAPI.deleteFavourite(favouriteId)
          : await DogAPI.deleteFavourite(favouriteId);
      console.log("favourite() DELETE response:", response);
    } else {
      const response =
        imgType === "cats"
          ? await CatAPI.addFavourite(imgId)
          : await DogAPI.addFavourite(imgId);
      console.log("favourite() POST response:", response);
      const data = await response.data;
      console.log("favourite() POST data:", data);
    }
  } catch (error) {
    console.log("favourite() ERROR:", error);
  }

  async function getFavouriteId(imgId, imgType) {
    try {
      const response =
        imgType === "cats"
          ? await CatAPI.getFavourites()
          : await DogAPI.getFavourites();
      console.log("getFavouriteId() response:", response);
      const data = await response.data;
      console.log("favourite() POST data:", data);
      const favouriteId = data
        .filter((item) => item.image_id === imgId)
        .reduce((id, item) => item.id, null);
      console.log("getFavouriteId() return:", favouriteId);
      return favouriteId;
    } catch (error) {
      console.log("getFavouriteId() ERROR:", error);
    }
  }
}

getFavouritesBtn.addEventListener("click", getFavourites);

async function getFavourites() {
  // Disable Lazy Load
  params.isNextPage = false;
  // Clear galery before populate new items
  Gallery.clear();
  try {
    // Fetch breeds from Cat API and Dog API
    const catFetch = await CatAPI.getFavourites();
    const dogFetch = await DogAPI.getFavourites();
    console.log("getFavourites() fetch:", catFetch, dogFetch);
    // Get images data simultaneously
    const [catData, dogData] = await Promise.all([catFetch, dogFetch]);
    console.log("getFavourites() data:", catData, dogData);
    // Parse JSON responses from fetched data into objects arrays
    const catImages = await catData.data.map((i) => ({ ...i, type: "cats" }));
    const dogImages = await dogData.data.map((i) => ({ ...i, type: "dogs" }));
    console.log("getFavourites() images:", catImages, dogImages);
    // Combine and shuffle all images using spread operator
    const favourites = shuffleImages([...catImages, ...dogImages]);
    // For each image in the response array, create a new element and append it to the carousel
    favourites.forEach(async (fav) => {
      // Create gallery item using HTML template
      const galleryItem = Gallery.createGalleryItem(fav.image_id, fav.type);
      // Append each of these new elements to the gallery
      Gallery.appendGallery(galleryItem);
      // Wait until image loads and completely renders
      await Gallery.loadImage(fav.image.url, galleryItem);
      // Apply Masonry script to updated gallery
      new Masonry(".gallery", { percentPosition: true });
    });
  } catch (error) {
    console.log("getFavourites() ERROR:", error);
  }
}
