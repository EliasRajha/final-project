import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Title from "@/components/Title";
import {
  addToast,
  Progress,
  Button,
  Link,
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
} from "@heroui/react";
import {
  PiShareNetwork,
  PiNotePencil,
  PiTrash,
  PiCards,
  PiExam,
  PiEnvelopeSimple,
  PiFacebookLogo,
  PiMessengerLogo,
  PiLinkedinLogo,
  PiTelegramLogo,
  PiThreadsLogo,
  PiXLogo,
  PiWhatsappLogo,
  PiRedditLogo,
} from "react-icons/pi";
import { DecksCard } from "@/components/Card";
import { getDeckById, deleteDeck } from "@/api/decksAPI";
import { getUserProgress } from "@/api/userAPI";
import { getCardsByDeckId } from "@/api/cardsAPI";
import { UserContext } from "@/context/UserContext";
import { ROUTES } from "@/routes/paths.js";
import StylishDiv from "@/components/StylishDiv";
import FavoriteButton from "@/components/FavoriteButton";
import {
  EmailShareButton,
  FacebookMessengerShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  TelegramShareButton,
  ThreadsShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  RedditShareButton,
} from "react-share";

const DeckPage = () => {
  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState(null);
  const [userProgress, setUserProgress] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isUserLoaded, forceLogin, setIsLoginOpen } =
    useContext(UserContext);
  const isOwner =
    user &&
    deck &&
    deck.userInfo &&
    user.userid ===
      (typeof deck.userInfo === "object" ? deck.userInfo._id : deck.userInfo);

  useEffect(() => {
    let isCancelled = false;

    const fetchDeckAndCards = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [deckResult, cardsResult] = await Promise.allSettled([
          getDeckById(id),
          getCardsByDeckId(id),
        ]);

        if (isCancelled) return;

        if (deckResult.status === "fulfilled" && deckResult.value) {
          setDeck(deckResult.value);
        } else {
          navigate(ROUTES.NOT_FOUND);
          return;
        }

        if (
          cardsResult.status === "fulfilled" &&
          Array.isArray(cardsResult.value)
        ) {
          setCards(cardsResult.value);
        } else {
          setCards([]);
        }
      } catch (e) {
        if (!isCancelled) {
          setError(e?.message || "Failed to load deck");
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    if (id) {
      fetchDeckAndCards();
    } else {
      navigate(ROUTES.NOT_FOUND);
    }

    return () => {
      isCancelled = true;
    };
  }, [id, navigate]);

  useEffect(() => {
    const fetchUserProgress = async () => {
      try {
        const progress = await getUserProgress(id);
        setUserProgress(progress);
      } catch (error) {
        setError(error.message || "Failed to load user progress");
      }
    };

    if (id && user && isUserLoaded) {
      fetchUserProgress();
    }
  }, [id, user, isUserLoaded]);

  const handleEditDeck = () => {
    if (!user) {
      forceLogin();
      return;
    }
    navigate(`/decks/${id}/edit`);
  };

  const handleDeleteDeck = () => {
    if (!user) {
      forceLogin();
      return;
    }
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteDeck = async () => {
    try {
      await deleteDeck(id);
      addToast({
        title: "Success",
        description: "Deck deleted successfully",
        color: "success",
        radius: "full",
      });
      navigate("/");
    } catch (error) {
      addToast({
        title: "Error",
        description: error.message || "Failed to delete deck",
        color: "danger",
        radius: "full",
      });
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center text-center">
        <Title
          breadcrumbs={[
            { label: "Home", path: ROUTES.HOME },
            location.state?.from === ROUTES.MY_DECKS
              ? { label: "My Decks", path: ROUTES.MY_DECKS }
              : { label: "Browse Decks", path: ROUTES.BROWSE },
            {
              label: `${deck?.title || (isLoading ? "Loading..." : "Deck")}`,
              path: `${ROUTES.DECK_DETAILS(id)}`,
            },
          ]}
        >
          {deck?.title || (isLoading ? "Loading..." : "")}
        </Title>
        {error && <p className="text-danger mt-2 text-sm">{error}</p>}
      </div>

      <StylishDiv className="mt-20 flex flex-col text-center md:text-left">
        <h3 className="text-secondary text-xl font-bold">Description</h3>
        <p>
          {deck?.description ||
            (isLoading
              ? "Fetching deck details..."
              : "No description available.")}
        </p>
      </StylishDiv>

      <div className="mt-4 flex flex-col items-stretch justify-center gap-4 md:flex-row">
        <StylishDiv className="flex flex-1 flex-col text-center md:text-left">
          <h3 className="text-secondary text-xl font-bold">
            Your Learning Progress
          </h3>
          {user ? (
            <Progress
              showValueLabel
              color="secondary"
              maxValue={
                deck?.cardsCount || (Array.isArray(cards) ? cards.length : 0)
              }
              label={`${userProgress || 0}/${deck?.cardsCount || (Array.isArray(cards) ? cards.length : 0)} cards`}
              value={userProgress || 0}
              classNames={{
                label: "text-sm",
                value: "text-sm",
                track: "bg-default",
              }}
            />
          ) : (
            <Button
              variant="flat"
              onPress={() => {
                setIsLoginOpen(true);
              }}
              radius="full"
              className="text-foreground bg-default"
            >
              Log in to see your progress
            </Button>
          )}
        </StylishDiv>

        <StylishDiv className="flex flex-1 flex-col text-center md:text-left">
          <h3 className="text-secondary text-xl font-bold">
            {deck?.language?.length > 1 ? "Languages" : "Language"}
          </h3>
          <div className="flex flex-col flex-wrap gap-2 capitalize md:flex-row">
            {deck?.language?.length > 0
              ? deck.language.map((lang) => (
                  <Button
                    key={lang}
                    variant="flat"
                    radius="full"
                    as={Link}
                    href={`${ROUTES.BROWSE}?language=${lang}`}
                    className="text-foreground bg-default md:flex-1"
                  >
                    {lang}
                  </Button>
                ))
              : isLoading
                ? "..."
                : "unknown"}
          </div>
        </StylishDiv>
      </div>

      <div className="mt-5 flex flex-col-reverse items-center justify-center gap-4 text-center md:mt-20 md:flex-row md:justify-between md:text-left">
        <div className="mt-10 flex flex-col md:mt-0">
          <h3 className="text-secondary text-xl font-bold">
            This Deck has{" "}
            <span className="text-primary">
              {deck?.cardsCount ??
                (Array.isArray(cards) ? cards.length : "no")}{" "}
            </span>
            cards
          </h3>
          <p>Start learning using our study modes!</p>
        </div>

        <div className="flex items-center gap-4">
          <FavoriteButton deckId={id} size="lg" iconSize={25} />
          <Tooltip
            content="Share Deck"
            showArrow={true}
            delay={0}
            closeDelay={0}
            radius="full"
          >
            <Button
              isIconOnly
              variant="faded"
              color="secondary"
              radius="full"
              size="lg"
              onPress={() => setIsShareModalOpen(true)}
            >
              <PiShareNetwork size={25} />
            </Button>
          </Tooltip>

          {isOwner && (
            <>
              <Tooltip
                content="Edit Deck"
                showArrow={true}
                delay={0}
                closeDelay={0}
                radius="full"
              >
                <Button
                  isIconOnly
                  variant="faded"
                  color="secondary"
                  radius="full"
                  size="lg"
                  onPress={handleEditDeck}
                >
                  <PiNotePencil size={25} />
                </Button>
              </Tooltip>

              <Tooltip
                content="Delete Deck"
                color="danger"
                showArrow={true}
                delay={0}
                closeDelay={0}
                radius="full"
              >
                <Button
                  isIconOnly
                  variant="faded"
                  color="secondary"
                  radius="full"
                  size="lg"
                  onPress={handleDeleteDeck}
                >
                  <PiTrash size={25} />
                </Button>
              </Tooltip>
            </>
          )}
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Button
          radius="full"
          size="lg"
          as={Link}
          href={ROUTES.DECK_CARD_MODE(id)}
          className="bg-default-100 from-secondary/15 to-default-100 ring-default hover:ring-primary hover:text-primary hover:from-primary/15 flex gap-4 bg-radial-[at_50%_0%] to-100% p-4 text-xl font-bold ring-1 transition duration-250 md:flex-1 md:p-8"
          startContent={<PiCards size={30} />}
        >
          Card Mode
        </Button>
        <Button
          radius="full"
          size="lg"
          as={Link}
          href={ROUTES.DECK_QUIZ_MODE(id)}
          className="bg-default-100 from-secondary/15 to-default-100 ring-default hover:ring-primary hover:text-primary hover:from-primary/15 flex gap-4 bg-radial-[at_50%_0%] to-100% p-4 text-xl font-bold ring-1 transition duration-250 md:flex-1 md:p-8"
          startContent={<PiExam size={30} />}
        >
          Quiz Mode
        </Button>
      </div>

      <div className="mt-20 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.isArray(cards) && cards.length > 0 ? (
          cards.map((card) => (
            <DecksCard
              key={card._id}
              front={card.question}
              back={card.answer}
            />
          ))
        ) : (
          <div className="flex w-full justify-center py-10">
            {isLoading ? (
              <Spinner size="lg" color="primary" />
            ) : (
              <p className="text-gray-500">No cards in this deck yet.</p>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <ModalContent>
          <ModalHeader className="text-danger font-bold">
            Delete Deck
          </ModalHeader>
          <ModalBody>
            <div>
              Are you sure you want to delete the deck{" "}
              <span className="text-danger font-bold capitalize">
                &quot;{deck?.title}&quot;
              </span>
              ? <br />
              <strong>This action cannot be undone.</strong>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button color="danger" onPress={confirmDeleteDeck}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Social Media Sharing Modal */}
      <Modal
        isOpen={isShareModalOpen}
        onOpenChange={setIsShareModalOpen}
        size="lg"
      >
        <ModalContent>
          <ModalHeader className="text-primary font-bold">
            Share Deck
          </ModalHeader>
          <ModalBody className="mb-5 flex flex-row justify-between gap-2">
            <Button
              isIconOnly
              radius="full"
              variant="ghost"
              onPress={() => setIsShareModalOpen(false)}
            >
              <EmailShareButton url={`https://c52b.hyf.dev/decks/${id}`}>
                <PiEnvelopeSimple size={25} />
              </EmailShareButton>
            </Button>

            <Button
              isIconOnly
              radius="full"
              variant="ghost"
              onPress={() => setIsShareModalOpen(false)}
            >
              <FacebookMessengerShareButton
                url={`https://c52b.hyf.dev/decks/${id}`}
              >
                <PiMessengerLogo size={25} />
              </FacebookMessengerShareButton>
            </Button>

            <Button
              isIconOnly
              radius="full"
              variant="ghost"
              onPress={() => setIsShareModalOpen(false)}
            >
              <FacebookShareButton url={`https://c52b.hyf.dev/decks/${id}`}>
                <PiFacebookLogo size={25} />
              </FacebookShareButton>
            </Button>

            <Button
              isIconOnly
              radius="full"
              variant="ghost"
              onPress={() => setIsShareModalOpen(false)}
            >
              <LinkedinShareButton url={`https://c52b.hyf.dev/decks/${id}`}>
                <PiLinkedinLogo size={25} />
              </LinkedinShareButton>
            </Button>

            <Button
              isIconOnly
              radius="full"
              variant="ghost"
              onPress={() => setIsShareModalOpen(false)}
            >
              <TelegramShareButton url={`https://c52b.hyf.dev/decks/${id}`}>
                <PiTelegramLogo size={25} />
              </TelegramShareButton>
            </Button>

            <Button
              isIconOnly
              radius="full"
              variant="ghost"
              onPress={() => setIsShareModalOpen(false)}
            >
              <ThreadsShareButton url={`https://c52b.hyf.dev/decks/${id}`}>
                <PiThreadsLogo size={25} />
              </ThreadsShareButton>
            </Button>

            <Button
              isIconOnly
              radius="full"
              variant="ghost"
              onPress={() => setIsShareModalOpen(false)}
            >
              <TwitterShareButton url={`https://c52b.hyf.dev/decks/${id}`}>
                <PiXLogo size={25} />
              </TwitterShareButton>
            </Button>

            <Button
              isIconOnly
              radius="full"
              variant="ghost"
              onPress={() => setIsShareModalOpen(false)}
            >
              <WhatsappShareButton url={`https://c52b.hyf.dev/decks/${id}`}>
                <PiWhatsappLogo size={25} />
              </WhatsappShareButton>
            </Button>

            <Button
              isIconOnly
              radius="full"
              variant="ghost"
              onPress={() => setIsShareModalOpen(false)}
            >
              <RedditShareButton url={`https://c52b.hyf.dev/decks/${id}`}>
                <PiRedditLogo size={25} />
              </RedditShareButton>
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DeckPage;
