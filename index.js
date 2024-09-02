import * as Gallery from "./utils/Gallery.js";
import * as Filter from "./utils/Filter.js";
import * as CatAPI from "./utils/CatAPI.js";
import * as DogAPI from "./utils/DogAPI.js";

// Set initial page number
let page = 0;

// Flag to check if a lazy load request is already running
let isLazyLoad = false;

// Create galery params to use them in fetch
let params = {};

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
    const catImages = await catData.data;
    const dogImages = await dogData.data;
    console.log(catImages, dogImages);
    // Combine and shuffle all images using spread operator
    const images = shuffleImages([...catImages, ...dogImages]);
    // If return images, set isNextPage to true, otherwise false
    params.isNextPage = images.length > 0;
    // For each image in the response array, create a new element and append it to the carousel
    images.forEach(async (image) => {
      // Create gallery item using HTML template
      const galleryItem = Gallery.createGalleryItem(image.url, "...", image.id);
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
