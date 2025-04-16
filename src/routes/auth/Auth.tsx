import { env } from "@/shared/env.config";
import { useAuth0 } from "@auth0/auth0-react";

const Auth = () => {
  //   login();
  const { loginWithRedirect, logout } = useAuth0();
  const handleLogout = async () => {
    await logout({
      logoutParams: {
        returnTo: import.meta.env.PROD
          ? "http://tauri.localhost/"
          : "http://localhost:3006/",
      },
      clientId: env.VITE_AUTH0_CLIENT_ID,
    });
  };
  return (
    <div className={"flex flex-col items-center justify-center h-full"}>
      <button
        type={"button"}
        onClick={() => loginWithRedirect()}
        className={
          "mb-20 px-8 py-4 border-2 rounded-lg text-2xl hover:bg-border transition-all duration-200 font-[300] "
        }
      >
        LOGIN
      </button>
      {/* <button type={"button"} onClick={() => handleLogout()}>
          logout
        </button> */}

      {/* <Button variant="default">Default</Button> */}
    </div>
  );
};

export default Auth;
