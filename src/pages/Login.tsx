import { useMsal } from "@azure/msal-react";
import { loginRequest } from "@/config/msalConfig";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Login = () => {
  const { instance, accounts } = useMsal();
  const navigate = useNavigate();

  useEffect(() => {
    if (accounts.length > 0) {
      navigate("/");
    }
  }, [accounts, navigate]);

  const handleLogin = async () => {
    try {
      await instance.loginPopup(loginRequest);
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
      <div className="fixed inset-0 bg-premium-gradient pointer-events-none" />
      <div className="fixed inset-0 bg-glow-gradient pointer-events-none" />
      
      <Card className="w-full max-w-md mx-4 relative z-10 bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-lg bg-accent/20 shadow-glow">
              <Settings className="w-8 h-8 text-accent" />
            </div>
          </div>
          <CardTitle className="text-2xl">Strategy Wizard Assistant</CardTitle>
          <CardDescription>Sign in with your Microsoft account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleLogin}
            className="w-full"
            size="lg"
          >
            Sign in with Microsoft
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
