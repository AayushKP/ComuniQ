import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useEffect, useState, lazy, Suspense } from "react";
import apiClient from "./lib/api-client";
import { GET_USER_INFO } from "./utils/constants";
import { useAppStore } from "./store/slices";
import { ClipLoader } from "react-spinners"; // Importing a spinner from react-spinners

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
      <div className="text-white flex h-screen justify-center items-center text-4xl font-semibold font-mono">
        Loading...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="flex h-screen justify-center items-center">
            <ClipLoader color="#3498db" size={50} /> {/* Using the spinner */}
          </div>
        }
      >
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
