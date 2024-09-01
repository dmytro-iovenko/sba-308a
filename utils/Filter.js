const dogBreeds = [
  { id: 1, name: "Affenpinscher", breed_group: "Toy" },
  { id: 2, name: "Afghan Hound", breed_group: "Hound" },
  { id: 3, name: "African Hunting Dog" },
  { id: 4, name: "Airedale Terrier", breed_group: "Terrier" },
];

const catBreeds = [
  { id: "abys", name: "Abyssinian" },
  { id: "aege", name: "Aegean" },
  { id: "abob", name: "American Bobtail" },
  { id: "acur", name: "American Curl" },
];

export function loadFilters() {
  // The filters element
  const filters = document.getElementById("filters");

  const animalTypes = [
    { type: "dogs", breeds: dogBreeds },
    { type: "cats", breeds: catBreeds },
  ];

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
    typeItem.appendChild(breedsContainer);
  });

  // Add event listeners for type checkboxes
  document.querySelectorAll(".type-checkbox").forEach((typeCheckbox) => {
    typeCheckbox.addEventListener("change", handleTypeCheckboxChange);
  });

  // Add event listeners for breed checkboxes
  document.querySelectorAll(".breed-checkbox").forEach((breedCheckbox) => {
    breedCheckbox.addEventListener("change", handleBreedCheckboxChange);
  });
}

// Function to set up filter type item from template
function createFilterTypeItem(type) {
  const template = document.getElementById("filterTypeItemTemplate");
  const clone = template.content.firstElementChild.cloneNode(true);
  const input = clone.querySelector("input");
  input.value = type;
  input.id = type;
  const label = clone.querySelector("label");
  label.for = type;
  label.textContent = type.charAt(0).toUpperCase() + type.slice(1);
  return clone;
}

// Function to set up filter breed item from template
function createBreedTypeItem(id, name, type) {
  const template = document.getElementById("filterBreedItemTemplate");
  const clone = template.content.firstElementChild.cloneNode(true);

  const input = clone.querySelector("input");
  input.dataset.type = type;
  input.value = id;
  input.id = type + id;

  const label = clone.querySelector("label");
  label.for = type + id;
  label.textContent = name;
  return clone;
}

// Handle changes to type checkboxes
function handleTypeCheckboxChange(event) {
  const typebox = event.target;
  const breedboxes = typebox.parentNode.querySelectorAll(`.breed-checkbox`);
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
