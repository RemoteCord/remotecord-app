import { env } from "@/shared/env.config";
import { useAuth0 } from "@auth0/auth0-react";

const Auth = () => {
  //   login();
  const { loginWithRedirect, logout } = useAuth0();
  const handleLogout = async () => {
    await logout({
      logoutParams: { returnTo: "http://localhost:3006/" },
      clientId: env.VITE_AUTH0_CLIENT_ID,
    });
  };
  return (
    <div>
      <p>Auth</p>
      <a href="/">home</a>
      <div className={"flex flex-col"}>
        <button type={"button"} onClick={() => loginWithRedirect()}>
          login
        </button>
        <button type={"button"} onClick={() => handleLogout()}>
          logout
        </button>
      </div>
      {/* <Button variant="default">Default</Button> */}
    </div>
  );
};

export default Auth;
