import PropTypes from "prop-types";
import { useContext } from "react";
import { UserContext } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  Button,
  Chip,
  Link,
} from "@heroui/react";
import cn from "@/util/cn";
import { ROUTES } from "@/routes/paths.js";
import { PiCaretRightBold } from "react-icons/pi";
import FavoriteButton from "@/components/FavoriteButton";

const Deck = ({ deck, className, from }) => {
  const { user: currentUser } = useContext(UserContext);
  const {
    _id: deckID,
    title,
    description,
    userInfo: user,
    cardsCount: numCards,
  } = deck;

  const isMine = from === ROUTES.MY_DECKS || !user;

  const displayName = isMine
    ? currentUser?.username || "You"
    : user?.username || "Unknown";

  const avatarSrc = isMine
    ? currentUser?.profilePictureUrl || ""
    : user?.profilePictureUrl || "";

  const navigate = useNavigate();

  return (
    <Card
      isPressable
      shadow="none"
      className={cn(
        "ring-default-300 hover:ring-primary hover:shadow-primary/20 min-h-[250px] max-w-[400px] min-w-[200px] flex-1 px-3 py-2 ring-2 transition duration-250 hover:shadow-lg",
        className
      )}
      classNames={{ base: "rounded-[20px] md:rounded-[35px]" }}
      onPress={() =>
        navigate(
          ROUTES.DECK_DETAILS(deckID),
          from ? { state: { from } } : undefined
        )
      }
    >
      <CardHeader className="flex items-start justify-between gap-4 pb-0">
        <p className="text-secondary line-clamp-2 text-left font-bold">
          {title}
        </p>

        <div
          className="flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <Chip size="sm" variant="faded">
            {numCards} Cards
          </Chip>
          <FavoriteButton deckId={deck._id} size="sm" iconSize={18} />
        </div>
      </CardHeader>

      <CardBody>
        <p className="line-clamp-3">{description}</p>
      </CardBody>

      <CardFooter className="justify-between">
        <div className="flex gap-3">
          <Avatar
            showFallback
            isBordered
            color="primary"
            radius="full"
            size="md"
            src={avatarSrc}
            name={displayName?.[0] || ""}
          />
          <div className="flex flex-col items-start justify-center">
            <h4 className="text-default-700 text-xs leading-none font-semibold">
              Created by
            </h4>
            <h5 className="text-primary">{displayName}</h5>
          </div>
        </div>

        <Button
          isIconOnly
          as={Link}
          color="primary"
          radius="full"
          size="md"
          variant="ghost"
          onPress={(e) => {
            e?.stopPropagation?.();
            navigate(
              ROUTES.DECK_DETAILS(deckID),
              from ? { state: { from } } : undefined
            );
          }}
        >
          <PiCaretRightBold size={20} />
        </Button>
      </CardFooter>
    </Card>
  );
};

Deck.propTypes = {
  deck: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    userInfo: PropTypes.shape({
      username: PropTypes.string,
      profilePictureUrl: PropTypes.string,
    }),
    cardsCount: PropTypes.number.isRequired,
  }).isRequired,
  className: PropTypes.string,
  from: PropTypes.string,
};

export default Deck;
