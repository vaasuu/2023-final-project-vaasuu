import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Landing from "./components/pages/Landing/Landing";
import Login from "./components/pages/Login/Login";
import Register from "./components/pages/Register/Register";
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

const router = createBrowserRouter(
  createRoutesFromElements([
    <Route path="/" element={<Landing />} />,
    <Route path="/login" element={<Login />} />,
    <Route path="/register" element={<Register />} />,
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
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
