import { main, favourite } from "../index.js";

// Create gallery element.
const gallery = createGallery();
// Create favourited gallery element.
const favouritedGallery = createGallery();

function createGallery() {
  const template = document.querySelector("#galleryTemplate");
  const clone = template.content.firstElementChild.cloneNode(true);
  return clone;
}

export function displayGallery(isFavourited = false) {
  const element = isFavourited ? favouritedGallery : gallery;
  main.appendChild(element);
  // Clear gallery content
  clear(isFavourited);
}

export function createGalleryItem(imgId, imgType) {
  const template = document.querySelector("#galleryItemTemplate");
  const clone = template.content.firstElementChild.cloneNode(true);

  const favBtn = clone.querySelector(".favourite-button");
  favBtn.addEventListener("click", () => {
    favourite(imgId, imgType);
  });

  return clone;
}

export function clear(isFavourited = false) {
  const element = isFavourited ? favouritedGallery : gallery;
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

export function appendGallery(item, isFavourited = false) {
  const element = isFavourited ? favouritedGallery : gallery;
  element.appendChild(item);
}

export async function loadImage(url, elem) {
  const img = elem.querySelector("img");
  return new Promise((resolve, reject) => {
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

export async function renderImage(id, type, url, isFavourited = false) {
  // Create gallery item using HTML template
  const galleryItem = createGalleryItem(id, type);
  // Append each of these new elements to the gallery
  appendGallery(galleryItem, isFavourited);
  // Wait until image loads and completely renders
  await loadImage(url, galleryItem);
  // Apply Masonry script to updated gallery
  new Masonry(".gallery", { percentPosition: true });
}
