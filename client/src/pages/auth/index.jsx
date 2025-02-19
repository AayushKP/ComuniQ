import Background from "@/assets/Login2.png";
import Victory from "@/assets/victory.svg";
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

  // Loading states for each action
  const [loginLoading, setLoginLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);

  const validateSignup = () => {
    if (!email.length) {
      toast.error("Email is required!");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required!");
      return false;
    }
    if (!confirmPassword.length) {
      toast.error("Confirm Password is empty!");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Password and Confirm Password must be the same");
      return false;
    }
    return true;
  };

  const validateLogin = () => {
    if (!email.length) {
      toast.error("Email is required!");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required!");
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
        if (res.data.user.profileSetup) {
          navigate("/chat");
        } else {
          navigate("/profile");
        }
      }
      console.log(res);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "An error occurred during login.";
      console.log("error", message);
      toast.error(message);
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
        toast.success("Signed Up");
        navigate("/profile");
      }
    } catch (error) {
      const message =
        error.response?.message || "An error occurred during signup.";
      toast.error(message);
      console.log("hi");
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <div className="h-[100vh] w-[100vw] flex items-center justify-center">
      <div className="h-[80vh] bg-white border-white text-opacity-90 shadow-2xl w-[90vw] md:w-[80vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2 ">
        <div className="flex flex-col gap-10 items-center justify-center">
          <div className="flex items-center justify-center flex-col">
            <div className="flex items-center justify-center">
              <h1 className="text-5xl font-bold md:-text-6xl">Welcome</h1>
              <img src={Victory} alt="Victory emoji" className="h-[100px]" />
            </div>
            <p className="font-medium text-center">
              Fill in the details to get started!
            </p>
          </div>
          <div className="flex items-center justify-center w-full">
            <Tabs className="w-3/4" defaultValue="login">
              <TabsList className="bg-transparent rounded-none w-full">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:text-black border-b-2 rounded-none w-full data-[state=active]:border-b-purple-500 transition-all duration-300"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:text-black border-b-2 rounded-none w-full data-[state=active]:border-b-purple-500 transition-all duration-300"
                >
                  Signup
                </TabsTrigger>
              </TabsList>
              <TabsContent className="flex flex-col gap-5 mt-10" value="login">
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-full p-6"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-full p-6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  className="rounded-full p-6 text-white bg-black hover:bg-gray-800"
                  onClick={handleLogin}
                  disabled={loginLoading}
                >
                  {loginLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </TabsContent>

              <TabsContent className="flex flex-col gap-5" value="signup">
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-full p-6"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-full p-6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Input
                  placeholder="Confirm Password"
                  type="password"
                  className="rounded-full p-6"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button
                  className="rounded-full p-6 text-white bg-black hover:bg-gray-800"
                  onClick={handleSignup}
                  disabled={signupLoading}
                >
                  {signupLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Signup"
                  )}
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="hidden xl:flex justify-center px-3 items-center">
          <img src={Background} alt="background-login" />
        </div>
      </div>
    </div>
  );
}

export default Auth;
