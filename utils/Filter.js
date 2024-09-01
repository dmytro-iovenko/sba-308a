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

  animalTypes.forEach((animal) => {
    const typeItem = createFilterTypeItem(animal.type);
    filters.appendChild(typeItem);
    const breedsContainer = typeItem.querySelector("#breeds");
    animal.breeds.forEach((breed) => {
      const breedItem = createBreedTypeItem(breed.id, breed.name, animal.type);
      breedsContainer.appendChild(breedItem);
    });
    typeItem.appendChild(breedsContainer);
  });
}

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
