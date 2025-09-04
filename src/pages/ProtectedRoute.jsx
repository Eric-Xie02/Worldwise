import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import SpinnerFullPage from "../components/SpinnerFullPage";

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading: isLoadingUser } = useUser();
  const navigate = useNavigate();

  if (isLoadingUser) return <SpinnerFullPage />;

  if (!isAuthenticated) navigate("/");

  return isAuthenticated ? children : null;
}

export default ProtectedRoute;
