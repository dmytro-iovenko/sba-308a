import * as Gallery from "./utils/Gallery.js";
import * as CatAPI from "./utils/CatAPI.js";
import * as DogAPI from "./utils/DogAPI.js";

// Set initial page number
let page = 0;

// Flag to check if a lazy load request is already running
let isLazyLoad = false;

// Add scroll event for lazy load
window.addEventListener("scroll", lazyLoad);

(function initialLoad() {
  // Clear galery before populate new items
  Gallery.clear();
  // Load images to gallery
  loadImagesToGallery();
})();

// Load images to gallery
async function loadImagesToGallery(page = 0, limit = 10, order = "DESC") {
  try {
    // Fetch images from Cat API and Dog API
    const catFetch = await CatAPI.getImages(page, limit, order);
    const dogFetch = await DogAPI.getImages(page, limit, order);
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
    // Reset isLazyLoadStarted flag
    isLazyLoad = false;
  } catch (error) {
    console.log("ERROR:", error);
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
  if (!isLazyLoad && scrolledHeight > totalHeight) {
    isLazyLoad = true;
    loadImagesToGallery(++page);
  }
}
