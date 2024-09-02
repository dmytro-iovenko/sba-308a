import { favourite } from "../index.js";

// The gallery element.
const gallery = document.querySelector(".gallery");

export function createGalleryItem(imgId, imgType) {
  const template = document.querySelector("#galleryItemTemplate");
  const clone = template.content.firstElementChild.cloneNode(true);

  const favBtn = clone.querySelector(".favourite-button");
  favBtn.addEventListener("click", () => {
    favourite(imgId, imgType);
  });

  return clone;
}

export function clear() {
  while (gallery.firstChild) {
    gallery.removeChild(gallery.firstChild);
  }
}

export function appendGallery(element) {
  gallery.appendChild(element);
}

export async function loadImage(url, elem) {
  const img = elem.querySelector("img");
  return new Promise((resolve, reject) => {
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}
