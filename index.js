import * as Gallery from "./utils/Gallery.js";
import * as CatAPI from "./utils/CatAPI.js";

const images = [
  { src: "https://via.placeholder.com/150", alt: "Image 1" },
  { src: "https://via.placeholder.com/150", alt: "Image 2" },
  { src: "https://via.placeholder.com/150", alt: "Image 3" },
  { src: "https://via.placeholder.com/150", alt: "Image 4" },
  { src: "https://via.placeholder.com/150", alt: "Image 5" },
  { src: "https://via.placeholder.com/150", alt: "Image 6" },
  { src: "https://via.placeholder.com/150", alt: "Image 7" },
  { src: "https://via.placeholder.com/150", alt: "Image 8" },
  { src: "https://via.placeholder.com/150", alt: "Image 9" },
  { src: "https://via.placeholder.com/150", alt: "Image 10" },
  { src: "https://via.placeholder.com/150", alt: "Image 11" },
  { src: "https://via.placeholder.com/150", alt: "Image 12" },
  { src: "https://via.placeholder.com/150", alt: "Image 13" },
  { src: "https://via.placeholder.com/150", alt: "Image 14" },
  { src: "https://via.placeholder.com/150", alt: "Image 15" },
  { src: "https://via.placeholder.com/150", alt: "Image 16" },
  { src: "https://via.placeholder.com/150", alt: "Image 17" },
  { src: "https://via.placeholder.com/150", alt: "Image 18" },
  { src: "https://via.placeholder.com/150", alt: "Image 19" },
  { src: "https://via.placeholder.com/150", alt: "Image 20" },
];

(function initialLoad() {
  // Clear galery before populate new items
  Gallery.clear();
  // Load images to gallery
  loadImagesToGallery();
})();

// Load images to gallery
async function loadImagesToGallery() {
  // Get images Cat API
  const catData = await CatAPI.getImages();
  console.log(catData)
  // Parse the JSON response from the info data into info object
  const catImages = await catData.data;
  console.log(catImages)

  // For each image in the response array, create a new element and append it to the carousel
  catImages.forEach((image) => {
    // Create gallery item using HTML template
    const galleryItem = Gallery.createGalleryItem(image.url, "...", image.id);
    // Append each of these new elements to the gallery
    Gallery.appendGallery(galleryItem);
  });
}
