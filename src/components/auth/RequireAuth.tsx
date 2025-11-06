import { useMsal } from "@azure/msal-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface RequireAuthProps {
  children: React.ReactNode;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const { accounts } = useMsal();
  const navigate = useNavigate();
  const isDevMode = import.meta.env.VITE_DEV_MODE === 'true';

  useEffect(() => {
    // Skip auth check in dev mode
    if (isDevMode) {
      return;
    }
    
    if (accounts.length === 0) {
      navigate("/login");
    }
  }, [accounts, navigate, isDevMode]);

  // Allow access in dev mode even without auth
  if (isDevMode) {
    return <>{children}</>;
  }

  if (accounts.length === 0) {
    return null;
  }

  return <>{children}</>;
};

export default RequireAuth;