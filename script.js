// ChatGPT Conversation Links:
// 1.https://chatgpt.com/share/67ff0480-02a0-8003-9788-517a6f519be7


// PokeAPI - https://pokeapi.co/

const searchButton = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");
const loadingSpinner = document.getElementById("loading");
const pokemonDetails = document.getElementById("pokemon-details");
const modal = document.getElementById("pokemon-modal");
const closeModal = document.getElementById("close-modal");
const favouritesButton = document.getElementById("toggle-favourites");

const favouritesKey = "pokemonFavourites";
let favourites = JSON.parse(localStorage.getItem(favouritesKey)) || [];

// Event listeners
searchButton.addEventListener("click", searchPokemon);
favouritesButton.addEventListener("click", toggleFavouritesView);
closeModal.addEventListener("click", closeModalWindow);

// Search Pokémon by name or ID
async function searchPokemon() {
  const query = searchInput.value.toLowerCase().trim();
  if (!query) return;

  loadingSpinner.classList.remove("hidden");
  pokemonDetails.innerHTML = "";

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`);
    if (!response.ok) {
      throw new Error("Pokémon not found");
    }

    const data = await response.json();
    displayPokemonCard(data);
    loadingSpinner.classList.add("hidden");
  } catch (error) {
    loadingSpinner.classList.add("hidden");
    pokemonDetails.innerHTML = `<p style="color: red;">${error.message}</p>`;
  }
}

// Display Pokémon info card
function displayPokemonCard(data) {
  const card = document.createElement("div");
  card.classList.add("pokemon-card");

  // Pokémon Image
  const img = document.createElement("img");
  img.src = data.sprites.front_default;
  img.alt = data.name;
  card.appendChild(img);

  // Pokémon Name and ID (ID: 25)
  const name = document.createElement("h2");
  name.textContent = data.name;
  card.appendChild(name);

  // Display ID as "ID: 25" on the main search screen
  const id = document.createElement("p");
  id.textContent = `ID: ${data.id}`;  // Display as "ID: 25"
  card.appendChild(id);

  // Pokémon Types
  const types = document.createElement("p");
  types.textContent = `Types: ${data.types.map(type => type.type.name).join(", ")}`;
  card.appendChild(types);

  // Pokémon Abilities
  const abilities = document.createElement("p");
  abilities.textContent = `Abilities: ${data.abilities.map(ability => ability.ability.name).join(", ")}`;
  card.appendChild(abilities);

  // More Info button
  const moreInfoButton = document.createElement("button");
  moreInfoButton.textContent = "More Info";
  moreInfoButton.classList.add("more-info-button");
  moreInfoButton.addEventListener("click", () => openModal(data));  // Opens the modal for more details
  card.appendChild(moreInfoButton);

  // Add to Favourites button (only for search screen)
  const addToFavouritesButton = document.createElement("button");
  addToFavouritesButton.textContent = "Add to Favourites";
  addToFavouritesButton.classList.add("add-to-favourites-button");
  addToFavouritesButton.addEventListener("click", () => addToFavourites(data));  // Adds to favourites
  card.appendChild(addToFavouritesButton);

  pokemonDetails.appendChild(card);
}

// Open modal with more Pokémon details
function openModal(data) {
  const modalName = document.getElementById("modal-name");
  const modalId = document.getElementById("modal-id");
  const modalImg = document.getElementById("modal-img");
  const modalTypes = document.getElementById("modal-types");
  const modalHeight = document.getElementById("modal-height");
  const modalWeight = document.getElementById("modal-weight");
  const modalAbilities = document.getElementById("modal-abilities");
  const modalStats = document.getElementById("modal-stats");

  modalName.textContent = data.name;

  // Display ID as "#025" in the modal (formatted with leading zeros)
  modalId.textContent = `#${data.id.toString().padStart(3, '0')}`;  // Format as "#025"

  modalImg.src = data.sprites.front_default;
  modalTypes.innerHTML = data.types.map(type => `<span class="type-badge type-${type.type.name}">${type.type.name}</span>`).join(" ");
  modalHeight.innerHTML = `Height: ${data.height / 10} m`;
  modalWeight.innerHTML = `Weight: ${data.weight / 10} kg`;
  modalAbilities.innerHTML = `Abilities: ${data.abilities.map(ability => ability.ability.name).join(", ")}`;

  // Base stats
  modalStats.innerHTML = data.stats.map(stat => {
    const statName = stat.stat.name;
    const statValue = stat.base_stat;
    return `
      <div class="stat-row">
        <span class="stat-name">${statName}</span>
        <div class="stat-bar"><div class="stat-fill" style="width: ${statValue}%"></div></div>
        <span class="stat-value">${statValue}</span>
      </div>
    `;
  }).join(" ");

  modal.classList.remove("hidden");
}

// Close modal
function closeModalWindow() {
  modal.classList.add("hidden");
}

// Add Pokémon to Favourites
function addToFavourites(pokemon) {
  // Check if the Pokémon is already in favourites
  const isAlreadyInFavourites = favourites.some(fav => fav.id === pokemon.id);

  if (isAlreadyInFavourites) {
    alert(`${pokemon.name} is already in favourites!`);
    return;  // Exit the function early if already in favourites
  }

  // Check if we can add more Pokémon to favourites (maximum 6)
  if (favourites.length >= 6) {
    alert("You can only add up to 6 Pokémon to favourites.");
    return;
  }

  // Add to favourites if not already present
  favourites.push(pokemon);
  localStorage.setItem(favouritesKey, JSON.stringify(favourites));
  alert(`${pokemon.name} added to favourites!`);
}

// Toggle between favourites and search view
function toggleFavouritesView() {
  if (favouritesButton.textContent === "View Favourites") {
    // Hide search elements and show "Back to Search" button
    searchInput.style.display = "none";
    searchButton.style.display = "none";
    favouritesButton.textContent = "Back to Search"; // Change button text
    displayFavourites();
  } else {
    // Show search elements and hide "Back to Search" button
    searchInput.style.display = "block";
    searchButton.style.display = "block";
    favouritesButton.textContent = "View Favourites"; // Change button text back
    pokemonDetails.innerHTML = "";
  }
}

// Display Favourites
function displayFavourites() {
  pokemonDetails.innerHTML = ""; // Clear the pokemon details area

  // If there are no favourites, show a message
  if (favourites.length === 0) {
    pokemonDetails.innerHTML = "<p>No favourites added yet!</p>";
  } else {
    // Loop through each favourite and display it as a card
    favourites.forEach(fav => {
      const card = document.createElement("div");
      card.classList.add("pokemon-card");

      // Pokémon Image
      const img = document.createElement("img");
      img.src = fav.sprites.front_default;
      img.alt = fav.name;
      img.classList.add("pokemon-image");
      card.appendChild(img);

      // Pokémon Name
      const name = document.createElement("h2");
      name.textContent = fav.name;
      card.appendChild(name);

      // Pokémon ID (ID: 25)
      const id = document.createElement("p");
      id.textContent = `ID: ${fav.id}`;  // Display as "ID: 25"
      id.classList.add("pokemon-id");
      card.appendChild(id);

      // Pokémon Types
      const types = document.createElement("p");
      types.textContent = `Types: ${fav.types.map(type => type.type.name).join(", ")}`;
      types.classList.add("types");
      card.appendChild(types);

      // Pokémon Abilities
      const abilities = document.createElement("p");
      abilities.textContent = `Abilities: ${fav.abilities.map(ability => ability.ability.name).join(", ")}`;
      abilities.classList.add("abilities");
      card.appendChild(abilities);

      // More Info button (only in favourites)
      const moreInfoButton = document.createElement("button");
      moreInfoButton.textContent = "More Info";
      moreInfoButton.classList.add("more-info-button");
      moreInfoButton.addEventListener("click", () => openModal(fav));  // Opens the modal for more details
      card.appendChild(moreInfoButton);

      // Add to the pokemon details area
      pokemonDetails.appendChild(card);
    });
  }
}
