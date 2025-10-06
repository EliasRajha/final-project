import apiRequest from "./index";

export const getFavorites = async () => {
  return await apiRequest("/favorites", "GET", null, true);
};

export const addFavorite = async (deckId) => {
  return await apiRequest(`/favorites/${deckId}`, "POST", null, true);
};

export const removeFavorite = async (deckId) => {
  return await apiRequest(`/favorites/${deckId}`, "DELETE", null, true);
};
