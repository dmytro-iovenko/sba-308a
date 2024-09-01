// The gallery element.
const gallery = document.querySelector(".gallery");

export function createGalleryItem(imgSrc, imgAlt, imgId) {
  const template = document.querySelector("#galleryItemTemplate");
  const clone = template.content.firstElementChild.cloneNode(true);

  const img = clone.querySelector("img");
  img.src = imgSrc;
  img.alt = imgAlt;

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
