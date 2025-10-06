import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
} from "@heroui/react";
import { UserContext } from "@/context/UserContext";
import SignupModal from "@/components/Modals/SignupModal";
import LoginModal from "@/components/Modals/LoginModal";
import ResetPasswordModal from "./Modals/ResetPasswordModal";
import { ROUTES } from "@/routes/paths.js";

const UserAuth = () => {
  const {
    user,
    logoutUser,
    isSignupOpen,
    setIsSignupOpen,
    isLoginOpen,
    setIsLoginOpen,
    isResetPasswordOpen,
    setIsResetPasswordOpen,
  } = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <>
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <Avatar
            isFocusable
            showFallback
            className="hover:bg-primary hover:text-default cursor-pointer transition"
            color="default"
            name={user?.username?.charAt(0) ?? ""}
            src={user?.profilePictureUrl}
            size="sm"
          />
        </DropdownTrigger>
        {user ? (
          <DropdownMenu
            aria-label="Profile Actions"
            disabledKeys={["loggedIn"]}
            variant="faded"
          >
            <DropdownItem
              key="loggedIn"
              className="font-bold"
              textValue={`Logged in as @${user.username}`}
            >
              Logged in as @{user.username}
            </DropdownItem>
            <DropdownItem
              key="profile"
              onPress={() => navigate(ROUTES.PROFILE)}
            >
              Profile
            </DropdownItem>

            <DropdownItem
              key="myDecks"
              onPress={() => navigate(ROUTES.MY_DECKS)}
            >
              My Decks
            </DropdownItem>

            <DropdownItem
              key="favorites"
              onPress={() => navigate(ROUTES.FAVORITES)}
            >
              My Favorites
            </DropdownItem>

            <DropdownItem
              key="logout"
              color="danger"
              onPress={() => logoutUser()}
            >
              Log out
            </DropdownItem>
          </DropdownMenu>
        ) : (
          <DropdownMenu aria-label="Profile Actions" variant="faded">
            <DropdownItem key="login" onPress={() => setIsLoginOpen(true)}>
              Log in
            </DropdownItem>
            <DropdownItem key="signup" onPress={() => setIsSignupOpen(true)}>
              Sign up
            </DropdownItem>
          </DropdownMenu>
        )}
      </Dropdown>

      <LoginModal isLoginOpen={isLoginOpen} setIsLoginOpen={setIsLoginOpen} />

      <SignupModal
        isSignupOpen={isSignupOpen}
        setIsSignupOpen={setIsSignupOpen}
      />

      <ResetPasswordModal
        isResetPasswordOpen={isResetPasswordOpen}
        setIsResetPasswordOpen={setIsResetPasswordOpen}
      />
    </>
  );
};

export default UserAuth;
