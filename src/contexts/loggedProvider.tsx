import { useAuth0 } from "@auth0/auth0-react";
import { useLayoutEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PROTECTED_ROUTES = ["/"];

export const LoggedProvider: React.FC<{
	children: React.ReactNode;
}> = ({ children }) => {
	const { isAuthenticated, user, isLoading } = useAuth0();
	const location = useLocation();
	const navigator = useNavigate();
	useLayoutEffect(() => {
		if (isLoading) return;

		console.log("location", location, isAuthenticated);
		const path = location.pathname;

		if (!PROTECTED_ROUTES.includes(path)) return;

		if (!isAuthenticated) navigator("/auth");
	}, [location, isLoading]);
	return <>{children}</>;
};
