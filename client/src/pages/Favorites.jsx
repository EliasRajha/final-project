import { useEffect, useState, useContext } from "react";
import Title from "@/components/Title";
import Deck from "@/components/Deck";
import StylishDiv from "@/components/StylishDiv";
import { Spinner, Alert } from "@heroui/react";
import { ROUTES } from "@/routes/paths";
import { getFavorites } from "@/api/favoritesAPI";
import { UserContext } from "@/context/UserContext";

const Favorites = () => {
  const { user, isUserLoaded, forceLogin, favoriteIds } =
    useContext(UserContext);

  const [decks, setDecks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isUserLoaded && !user) forceLogin();
  }, [isUserLoaded, user, forceLogin]);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      setIsLoading(true);
      setError("");
      try {
        const res = await getFavorites();
        setDecks(res?.items || []);
      } catch (e) {
        setError(e?.message || "Failed to load favorites");
        setDecks([]);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [user]);

  useEffect(() => {
    setDecks((prev) => prev.filter((d) => favoriteIds?.has?.(d._id)));
  }, [favoriteIds]);

  if (!user) return null;

  return (
    <>
      <div className="flex flex-col justify-center text-center">
        <Title
          breadcrumbs={[
            { label: "Home", path: ROUTES.HOME },
            { label: "Favorites", path: ROUTES.FAVORITES },
          ]}
        >
          Favorites
        </Title>
      </div>

      <StylishDiv className="mt-20 flex flex-col items-center text-center md:items-start md:text-left">
        <h3 className="text-secondary text-xl font-bold">MY favorite decks</h3>
        <p className="text-gray-500">
          {isLoading
            ? "Loading your favorites..."
            : `${decks.length} deck${decks.length === 1 ? "" : "s"} found`}
        </p>
      </StylishDiv>

      {error && (
        <div className="mt-4">
          <Alert color="danger" title={error} />
        </div>
      )}

      {isLoading ? (
        <div className="flex w-full justify-center py-20">
          <Spinner size="lg" color="primary" />
        </div>
      ) : decks.length === 0 ? (
        <div className="text-foreground-500 py-20 text-center">
          You don’t have any favorite decks yet.
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {decks.map((deck) => (
            <Deck
              key={deck._id}
              deck={deck}
              className="max-w-full"
              from={ROUTES.FAVORITES}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default Favorites;
