import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import apiClient from "@/lib/api-client";
import { useAppStore } from "@/store/slices";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/utils/constants";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

function Auth() {
  const { setUserInfo } = useAppStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);

  // Email validation function
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateSignup = () => {
    if (!email.length || !password.length || !confirmPassword.length) {
      toast.error("All fields are required!");
      return false;
    }
    if (!isValidEmail(email)) {
      toast.error("Please enter valid email!");
      return false;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    return true;
  };

  const validateLogin = () => {
    if (!email.length || !password.length) {
      toast.error("Email and Password are required!");
      return false;
    }
    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email!");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateLogin()) return;
    setLoginLoading(true);
    try {
      const res = await apiClient.post(
        LOGIN_ROUTE,
        { email, password },
        { withCredentials: true }
      );
      if (res.data.user.id) {
        setUserInfo(res.data.user);
        toast.success("Logged In");
        navigate(res.data.user.profileSetup ? "/chat" : "/profile");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed!");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!validateSignup()) return;
    setSignupLoading(true);
    try {
      const res = await apiClient.post(
        SIGNUP_ROUTE,
        { email, password },
        { withCredentials: true }
      );
      if (res.status === 201) {
        setUserInfo(res.data.user);
        toast.success("Account Created");
        navigate("/profile");
      }
    } catch (error) {
      toast.error(error.response?.message || "Signup failed!");
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center font-poppins">
      <div className="w-full max-w-md md:max-w-lg min-h-[500px] p-10 bg-neutral-950 text-white rounded-2xl shadow-md">
        <h2 className="text-center text-2xl font-semibold">ComuniQ</h2>
        <p className="text-center text-gray-400 mt-1 mb-6 text-sm">
          Enter your credentials to continue
        </p>

        <Tabs defaultValue="login">
          <TabsList className="flex justify-between bg-transparent mb-4">
            <TabsTrigger
              value="login"
              className="w-1/2 text-center data-[state=active]:text-white data-[state=active]:bg-black data-[state=active]:rounded-lg border-b rounded-none bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-b-amber-400"
            >
              Login
            </TabsTrigger>
            <TabsTrigger
              value="signup"
              className="w-1/2 text-center data-[state=active]:text-white data-[state=active]:bg-black data-[state=active]:rounded-lg border-b rounded-none bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-b-amber-400"
            >
              Signup
            </TabsTrigger>
          </TabsList>

          {/* Login Form */}
          <TabsContent value="login">
            <Input
              placeholder="Email"
              type="email"
              className="mb-4 bg-neutral-900 border-none p-3 text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="Password"
              type="password"
              className="mb-4 bg-neutral-900 border-none p-3 text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              className="w-full bg-white hover:bg-neutral-500 text-black py-3 rounded-lg"
              onClick={handleLogin}
              disabled={loginLoading}
            >
              {loginLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Sign In"
              )}
            </Button>
          </TabsContent>

          {/* Signup Form */}
          <TabsContent value="signup">
            <Input
              placeholder="Email"
              type="email"
              className="mb-4 bg-neutral-900 border-none p-3 text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="Password"
              type="password"
              className="mb-4 bg-neutral-900 border-none p-3 text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Input
              placeholder="Confirm Password"
              type="password"
              className="mb-4 bg-neutral-900 border-none p-3 text-white"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button
              className="w-full bg-white hover:bg-neutral-500 text-black py-3 rounded-lg"
              onClick={handleSignup}
              disabled={signupLoading}
            >
              {signupLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Create Account"
              )}
            </Button>
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center text-gray-400 text-sm">
          OR CONTINUE WITH
        </div>

        <div className="flex justify-center gap-4 mt-4">
          <Button
            className="bg-neutral-900 text-white py-3 w-1/2"
            onClick={() => {
              toast.error("Feature not available yet");
            }}
          >
            Google
          </Button>
          <Button
            className="bg-neutral-900 text-white py-3 w-1/2"
            onClick={() => {
              toast.error("Feature not available yet");
            }}
          >
            GitHub
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Auth;
