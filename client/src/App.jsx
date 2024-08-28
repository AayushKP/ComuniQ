import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Auth from "./pages/auth";
import Chat from "./pages/chat";
import Profile from "./pages/profile";
import { useEffect, useState } from "react";
import apiClient from "./lib/api-client";
import { GET_USER_INFO } from "./utils/constants";
import { SocketProvider } from "./context/SocketContext";
import { useAppStore } from "./store/slices";

const PrivateRoute = ({ children }) => {
  const userInfo = useAppStore();
  console.log(userInfo);
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

const AuthRoute = ({ children }) => {
  const userInfo = useAppStore();
  console.log(userInfo);
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to="/chat" /> : children;
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
        console.log("API Response:", res); // Debugging line
        if (res.status === 200 && res.data.id) {
          setUserInfo(res.data); // Setting user data
        } else {
          setUserInfo(null); // Ensuring null if user data is not valid
        }
      } catch (error) {
        console.error("Error fetching user data:", error); // Debugging line
        setUserInfo(null); // Set null on error
      } finally {
        setLoading(false);
      }
    };

    if (!userInfo) {
      getUserData(); // Fetch user data if not available
    } else {
      setLoading(false);
    }
  }, [userInfo, setUserInfo]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
};

export default App;
