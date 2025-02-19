import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useEffect, useState, lazy, Suspense } from "react";
import apiClient from "./lib/api-client";
import { GET_USER_INFO } from "./utils/constants";
import { useAppStore } from "./store/slices";
import { ClipLoader } from "react-spinners"; 
import Loader from "./components/ui/Loader";

// Lazy-loaded components
const Auth = lazy(() => import("./pages/auth"));
const Chat = lazy(() => import("./pages/chat"));
const Profile = lazy(() => import("./pages/profile"));

const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  return userInfo ? children : <Navigate to="/auth" />;
};

const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  return userInfo ? <Navigate to="/chat" /> : children;
};

const App = () => {
  const { userInfo, setUserInfo } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const res = await apiClient.get(GET_USER_INFO, {
          withCredentials: true,
        });

        if (res.status === 200 && res.data.id) {
          setUserInfo(res.data);
        } else {
          setUserInfo(null);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserInfo(null);
      } finally {
        setLoading(false);
      }
    };

    if (!userInfo) {
      getUserData();
    } else {
      setLoading(false);
    }
  }, [userInfo, setUserInfo]);

  if (loading) {
    return (
      <div>
        {" "}
        <ClipLoader
          color="#ffffff"
          size={50}
          speedMultiplier={0.8}
          className="mb-4"
        />
        <p className="text-white font-mono text-lg animate-pulse">
          Server setting up...
        </p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Suspense fallback={Loader}>
        <Routes>
          <Route
            path="/auth"
            element={
              <AuthRoute>
                <Auth />
              </AuthRoute>
            }
          />
          <Route path="*" element={<Navigate to="/auth" />} />
          <Route
            path="/chat"
            element={
              <PrivateRoute>
                <Chat />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
