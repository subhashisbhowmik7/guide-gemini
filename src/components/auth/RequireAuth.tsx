import { useMsal } from "@azure/msal-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface RequireAuthProps {
  children: React.ReactNode;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const { accounts } = useMsal();
  const navigate = useNavigate();

  useEffect(() => {
    if (accounts.length === 0) {
      navigate("/login");
    }
  }, [accounts, navigate]);

  if (accounts.length === 0) {
    return null;
  }

  return <>{children}</>;
};

export default RequireAuth;