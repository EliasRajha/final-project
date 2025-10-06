import { useContext, useState } from "react";
import PropTypes from "prop-types";
import { PiHeart, PiHeartFill } from "react-icons/pi";
import { Button, Tooltip, addToast } from "@heroui/react";
import { UserContext } from "@/context/UserContext";
import { addFavorite, removeFavorite } from "@/api/favoritesAPI";

function FavoriteButton({
  deckId,
  size = "sm",
  iconSize = 20,
  className = "",
  onChange,
}) {
  const { user, setIsLoginOpen, favoriteIds, addFavoriteId, removeFavoriteId } =
    useContext(UserContext);
  const [isBusy, setIsBusy] = useState(false);

  const isFav = favoriteIds?.has?.(deckId);

  const toggle = async (e) => {
    e?.stopPropagation?.();
    e?.preventDefault?.();

    if (!user) {
      setIsLoginOpen(true);
      addToast({
        title: "Login required",
        description: "Log in to save favorites.",
        color: "warning",
        radius: "full",
      });
      return;
    }

    try {
      setIsBusy(true);
      if (isFav) {
        await removeFavorite(deckId);
        removeFavoriteId(deckId);
        addToast({
          title: "Removed",
          description: "Removed from favorites.",
          color: "default",
          radius: "full",
        });
        onChange?.(false);
      } else {
        await addFavorite(deckId);
        addFavoriteId(deckId);
        addToast({
          title: "Saved",
          description: "Added to favorites.",
          color: "success",
          radius: "full",
        });
        onChange?.(true);
      }
    } catch (e) {
      addToast({
        title: "Error",
        description: e?.message || "Failed to update favorite",
        color: "danger",
        radius: "full",
      });
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <Tooltip
      content={isFav ? "Remove from favorites" : "Add to favorites"}
      showArrow
    >
      <Button
        as="div"
        isIconOnly
        size={size}
        radius="full"
        variant="faded"
        color={isFav ? "primary" : "secondary"}
        onPress={toggle}
        isDisabled={isBusy}
        aria-label={isFav ? "Unfavorite deck" : "Favorite deck"}
        className={className}
        onClick={(e) => e.stopPropagation()}
      >
        {isFav ? <PiHeartFill size={iconSize} /> : <PiHeart size={iconSize} />}
      </Button>
    </Tooltip>
  );
}

FavoriteButton.propTypes = {
  deckId: PropTypes.string.isRequired,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  iconSize: PropTypes.number,
  className: PropTypes.string,
  onChange: PropTypes.func,
};

export default FavoriteButton;
