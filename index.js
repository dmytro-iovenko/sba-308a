import * as Gallery from "./utils/Gallery.js";
import * as CatAPI from "./utils/CatAPI.js";
import * as DogAPI from "./utils/DogAPI.js";

(function initialLoad() {
  // Clear galery before populate new items
  Gallery.clear();
  // Load images to gallery
  loadImagesToGallery();
})();

// Load images to gallery
async function loadImagesToGallery() {
  try {
    // Fetch images from Cat API and Dog API
    const catFetch = await CatAPI.getImages();
    const dogFetch = await DogAPI.getImages();
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
    images.forEach((image) => {
      // Create gallery item using HTML template
      const galleryItem = Gallery.createGalleryItem(image.url, "...", image.id);
      // Append each of these new elements to the gallery
      Gallery.appendGallery(galleryItem);
    });
  } catch (error) {
    console.log("ERROR:", error);
  }
}

// Function to shuffle images using the sort method with a random comparator
function shuffleImages(images) {
  return images.sort(() => Math.random() - 0.5);
}
