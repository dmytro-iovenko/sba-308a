import { loadFilteredImagesToGallery } from "../index.js";

// Load filters
export function loadFilters(animalTypes) {
  // The filters element
  const filters = document.getElementById("filters");
  // Create and append filter items for each animal type
  animalTypes.forEach((animal) => {
    const typeItem = createFilterTypeItem(animal.type);
    filters.appendChild(typeItem);
    const breedsContainer = typeItem.querySelector("#breeds");
    // Create and append filter items for each breed
    animal.breeds.forEach((breed) => {
      const breedItem = createBreedTypeItem(breed.id, breed.name, animal.type);
      breedsContainer.appendChild(breedItem);
    });
  });
  // Add event listeners for type checkboxes
  document.querySelectorAll(".type-checkbox").forEach((typeCheckbox) => {
    typeCheckbox.addEventListener("change", handleTypeCheckboxChange);
    typeCheckbox.addEventListener("click", (event) => {
      console.log("OK");
      event.stopImmediatePropagation();
    });
  });
  // Add event listeners for breed checkboxes
  document.querySelectorAll(".breed-checkbox").forEach((breedCheckbox) => {
    breedCheckbox.addEventListener("change", handleBreedCheckboxChange);
  });
  // Add event listener for apply filter button
  const applyButton = document.querySelector("button#apply");
  applyButton.addEventListener("click", handleApplyButtonClick);
  // Add event listener for reset filter button
  const resetButton = document.querySelector("button#reset");
  resetButton.addEventListener("click", handleResetButtonClick);
}

// Function to set up filter type item from template
function createFilterTypeItem(type) {
  const template = document.getElementById("filterTypeItemTemplate");
  const clone = template.content.firstElementChild.cloneNode(true);
  const input = clone.querySelector("input");
  input.value = type;
  const label = clone.querySelector("label");
  label.innerHTML += type.charAt(0).toUpperCase() + type.slice(1);
  const accordionButton = clone.querySelector(".accordion-button");
  console.log(accordionButton.dataset);
  accordionButton.dataset.bsToggle = "collapse";
  accordionButton.dataset.bsTarget = `#collapse${type}`;
  const accordionCollapse = clone.querySelector(".accordion-collapse");
  accordionCollapse.id = `collapse${type}`;
  return clone;
}

// Function to set up filter breed item from template
function createBreedTypeItem(id, name, type) {
  const template = document.getElementById("filterBreedItemTemplate");
  const clone = template.content.firstElementChild.cloneNode(true);
  const input = clone.querySelector("input");
  input.dataset.type = type;
  input.value = id;
  const label = clone.querySelector("label");
  label.innerHTML += name;
  return clone;
}

// Handle changes to type checkboxes
function handleTypeCheckboxChange(event) {
  const typebox = event.target;
  const type = typebox.value;
  const breedboxes = document.querySelectorAll(
    `#filters .breed-checkbox[data-type="${type}"]`
  );
  // Check or uncheck all breed checkboxes based on type checkbox state
  breedboxes.forEach((checkbox) => (checkbox.checked = typebox.checked));
  // Update appearance of type checkbox
  updateTypeCheckboxAppearance(typebox);
}

// Handle changes to breed checkboxes
function handleBreedCheckboxChange(event) {
  const breedbox = event.target;
  const type = breedbox.getAttribute("data-type");
  const typebox = document.querySelector(
    `#filters .type-checkbox[value="${type}"]`
  );
  // Update appearance of type checkbox
  updateTypeCheckboxAppearance(typebox);
}

// Update appearance of type checkbox based on breed checkboxes' states
function updateTypeCheckboxAppearance(typebox) {
  const breedboxes = document.querySelectorAll(
    `#filters .breed-checkbox[data-type="${typebox.value}"]`
  );
  const all = Array.from(breedboxes).every((checkbox) => checkbox.checked);
  const any = Array.from(breedboxes).some((checkbox) => checkbox.checked);
  // Update type checkbox based on breed checkboxes' states
  switch (true) {
    case all:
      typebox.checked = true;
      typebox.indeterminate = false;
      break;
    case any:
      typebox.checked = true;
      typebox.indeterminate = true;
      break;
    default:
      typebox.checked = false;
      typebox.indeterminate = false;
  }
}

function handleApplyButtonClick(event) {
  event.preventDefault();
  const selectedBreeds = {};

  document
    .querySelectorAll("#filters input[type=checkbox]:checked")
    .forEach((input) => {
      console.log(input);
      if (input.classList.contains("breed-checkbox")) {
        const type = input.dataset.type;
        if (!selectedBreeds[type]) selectedBreeds[type] = [];
        selectedBreeds[type].push(input.value);
      }
    });

  console.log(selectedBreeds);
  // Load filtered images to gallery
  loadFilteredImagesToGallery(true, selectedBreeds);
}

function handleResetButtonClick(event) {
  console.log("ResetButtonClick");
  event.preventDefault();
  document
    .querySelectorAll("#filters input[type=checkbox]")
    .forEach((checkbox) => {
      checkbox.checked = false;
      checkbox.indeterminate = false;
    });
  // Load images to gallery
  loadFilteredImagesToGallery(false);
}
