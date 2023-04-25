import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Landing from "./components/pages/Landing/Landing";
import Auth from "./components/pages/Auth/Auth";
import Users from "./components/pages/Users/Users";
import User from "./components/pages/User/User";
import EditUser from "./components/pages/EditUser/EditUser";
import Listings from "./components/pages/Listings/Listings";
import Listing from "./components/pages/Listing/Listing";
import EditListing from "./components/pages/EditListing/EditListing";
import ResetPassword from "./components/pages/ResetPassword/ResetPassword";
import NotFound from "./components/pages/NotFound/NotFound";
import MarketLayout from "./components/Layouts/MarketLayout";
import TermsOfService from "./components/pages/TermsOfService/TermsOfService";
import PrivacyPolicy from "./components/pages/PrivacyPolicy/PrivacyPolicy";
import Acknowledgements from "./components/pages/Acknowledgements/Acknowledgements";
import { ProSidebarProvider } from "react-pro-sidebar";

import "./App.css";
import { AuthContext } from "./shared/context/auth-context";
import { parseJwt } from "./shared/utils/utils";
import { useCallback, useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

const router = createBrowserRouter(
  createRoutesFromElements([
    <Route path="/" element={<Landing />} />,
    <Route path="/auth" element={<Auth />} />,
    <Route path="/market" element={<MarketLayout />}>
      {/* sidebar is included under these routes: */}
      <Route index element={<Listings />} />
      <Route path="listings/*" element={<Listings />} />
      <Route path="listings/:id" element={<Listing />} />
      <Route path="listings/:id/edit" element={<EditListing />} />
      <Route path="users/*" element={<Users />} />
      <Route path="users/:id" element={<User />} />
      <Route path="users/:id/edit" element={<EditUser />} />
    </Route>,
    <Route path="/reset-password" element={<ResetPassword />} />,
    <Route path="/tos" element={<TermsOfService />} />,
    <Route path="/privacy" element={<PrivacyPolicy />} />,
    <Route path="/acknowledgements" element={<Acknowledgements />} />,
    <Route path="*" element={<NotFound />} />,
  ])
);

const App = () => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [roles, setRoles] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  /**
   * Login function. Stores user data in local storage and sets state.
   * @param {string} uid - User ID
   * @param {string} token - Auth token
   * @param {string[]} roles - User roles
   * @param {number} tokenExpiration - Token expiration timestamp in seconds
   */
  const login = useCallback((uid, token, roles, tokenExpiration = null) => {
    setUserId(uid);
    setToken(token);
    setRoles(roles);
    setIsAdmin(roles.includes("admin"));
    const tokenExpirationTimestamp = tokenExpiration || parseJwt(token).exp; // get expiration from token if not passed

    localStorage.setItem(
      "userAuthData",
      JSON.stringify({
        userId: uid,
        token: token,
        roles: roles,
        expiration: tokenExpirationTimestamp,
      })
    );
  }, []);

  // get auth token from local storage on page load
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userAuthData"));
    if (
      storedData &&
      storedData.token &&
      storedData.userId &&
      storedData.roles &&
      storedData.expiration * 1000 > new Date().getTime() // allow if token not expired. storedData.expiration is in seconds, getTime() is in milliseconds
    ) {
      // if token not expired, login using stored data
      login(
        storedData.userId,
        storedData.token,
        storedData.roles,
        storedData.expiration
      );
    }
  }, [login]);

  /**
   * Logout function. Clears userAuthData from local storage and clears states.
   */
  const logout = useCallback(() => {
    setUserId(null);
    setToken(null);
    setRoles([]);
    setIsAdmin(false);
    localStorage.removeItem("userAuthData");
  }, []);

  // auto logout when token expires
  let logoutTimer;
  useEffect(() => {
    // if token, set timer
    if (token) {
      // calculate remaining milliseconds until token expires
      const remainingMilliseconds =
        parseJwt(token).exp * 1000 - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingMilliseconds);
    } else {
      // if no token (logged out), remove logout timer
      clearTimeout(logoutTimer);
    }
  }, [token, logout]); // re-run when token changes

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: Boolean(token),
        token: token,
        userId: userId,
        roles: roles,
        isAdmin: isAdmin,
        login: login,
        logout: logout,
      }}
    >
      <QueryClientProvider client={queryClient}>
        <ProSidebarProvider>
          <div className="App">
            <RouterProvider router={router} />
          </div>
        </ProSidebarProvider>
      </QueryClientProvider>
    </AuthContext.Provider>
  );
};

export default App;
