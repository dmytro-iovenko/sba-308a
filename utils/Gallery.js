// The gallery element.
const gallery = document.querySelector(".gallery");

export function createGalleryItem() {
  const template = document.querySelector("#galleryItemTemplate");
  return template.content.firstElementChild.cloneNode(true);
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
