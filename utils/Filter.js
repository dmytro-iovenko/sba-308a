import { main, loadFilteredImagesToGallery } from "../index.js";

// Initialize current filters object and temporary filters object
let currentFilters = {};
let tempFilters = {};

// Create filter button
const filterButton = createFilterButton();
// Create filter container
const filterContainer = createFilter();

export function displayFilter() {
  // Append filter button to main element
  main.appendChild(filterButton);
  // Append filter container to main element
  main.appendChild(filterContainer);
  // Reset badge
  setBadge(false);
}

// Load filters
export function loadFilters(animalTypes) {
  // The filters element
  const filters = filterContainer.querySelector("#filters");
  // Clear old filters
  clearFilters(animalTypes);
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
  // Add event listener for filter button
  const button = filterButton.querySelector("button");
  button.addEventListener("click", handleFilterButtonClick);
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
  // Add or delete data in tempFilters based on type checkbox state
  !tempFilters[type] && (tempFilters[type] = new Set());
  breedboxes.forEach((checkbox) =>
    checkbox.checked
      ? tempFilters[type].add(checkbox.value)
      : tempFilters[type].delete(checkbox.value)
  );
  console.log("tempFilters:", tempFilters);
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
  // Add or delete data in tempFilters based on type checkbox state
  !tempFilters[type] && (tempFilters[type] = new Set());
  breedbox.checked
    ? tempFilters[type].add(breedbox.value)
    : tempFilters[type].delete(breedbox.value);
  console.log("tempFilters:", tempFilters);
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
  const selectedBreeds = JSON.parse(
    JSON.stringify(tempFilters, (_k, v) =>
      v instanceof Set ? [...v].sort() : v
    )
  );
  console.log("SelectedBreeds:", selectedBreeds);

  // Count total number of selected breeds
  let count = 0;
  for (const type in selectedBreeds) {
    selectedBreeds[type].forEach((_e) => count++);
  }
  if (count && JSON.stringify(selectedBreeds) !== JSON.stringify(currentFilters)) {
    // Set currentFilters to selectedBreeds
    currentFilters = selectedBreeds;
    // Set badge to filter button
    setBadge(count);
    // Hide filter canvas
    hideFilter();
    // Load filtered images to gallery
    loadFilteredImagesToGallery(true, selectedBreeds);
  }
}

function handleResetButtonClick(event) {
  console.log("ResetButtonClick");
  event.preventDefault();
  // Count total number of selected filters
  let count = 0;
  for (const type in currentFilters) {
    currentFilters[type].forEach((_e) => count++);
  }
  // If any filters selected, reset all of them
  if (count) {
    // Reset currentFilters
    currentFilters = {};
    // Reset all checkboxes
    resetAllCheckboxes();
    // Reset badge
    setBadge(false);
    // Hide filter canvas
    hideFilter();
    // Load images to gallery
    loadFilteredImagesToGallery(false);
  }
}

function createFilter() {
  const template = document.querySelector("#filterTemplate");
  const clone = template.content.firstElementChild.cloneNode(true);
  return clone;
}

function createFilterButton() {
  const template = document.querySelector("#filterButtonTemplate");
  const clone = template.content.firstElementChild.cloneNode(true);
  return clone;
}

function clearFilters(animalTypes) {
  const filters = filterContainer.querySelector("#filters");
  while (filters.firstChild) {
    filters.removeChild(filters.firstChild);
  }
  animalTypes.forEach((animal) => (currentFilters[animal.type] = new Set()));
}

function setBadge(value) {
  const button = filterButton.querySelector("button");
  button.innerHTML = value
    ? `Filter Images <span class="badge bg-danger">${value}</span>`
    : "Filter Images";
}

function handleFilterButtonClick() {
  // Reset all checkboxes before further process
  resetAllCheckboxes();
  console.log("currentFilters", currentFilters);
  for (const type in currentFilters) {
    console.log(`${type}: ${currentFilters[type]}`);
    tempFilters[type] = new Set(currentFilters[type]);
    currentFilters[type].forEach((breed) => {
      const checkbox = document.querySelector(
        `#filters .breed-checkbox[value="${breed}"]`
      );
      checkbox && (checkbox.checked = true);
    });
    const breedboxes = document.querySelectorAll(
      `#filters .breed-checkbox[data-type="${type}"]`
    );
    const all = Array.from(breedboxes).every((checkbox) => checkbox.checked);
    const any = Array.from(breedboxes).some((checkbox) => checkbox.checked);
    const typebox = document.querySelector(
      `#filters .type-checkbox[value="${type}"]`
    );
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
  showFilter();
}

function showFilter() {
  let myOffCanvas = document.getElementById("filterImages");
  console.log(myOffCanvas);
  let openedCanvas = new bootstrap.Offcanvas(myOffCanvas);
  openedCanvas.show();
}

function hideFilter() {
  let myOffCanvas = document.getElementById("filterImages");
  let openedCanvas = bootstrap.Offcanvas.getInstance(myOffCanvas);
  openedCanvas.hide();
  // Reset tempFilters
  tempFilters = {};
}

function resetAllCheckboxes() {
  document
    .querySelectorAll("#filters input[type=checkbox]")
    .forEach((checkbox) => {
      checkbox.checked = false;
      checkbox.indeterminate = false;
    });
  // Reset tempFilters
  tempFilters = {};
}
