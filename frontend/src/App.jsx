import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

const router = createBrowserRouter(
  createRoutesFromElements([
    <Route path="/" element={<Landing />} />,
    <Route path="/login" element={<Login />} />,
    <Route path="/register" element={<Register />} />,
    <Route path="/home" element={<Home />} />,
    <Route path="/users" element={<Users />} />,
    <Route path="/users/:id" element={<User />} />,
    <Route path="/users/:id/edit" element={<EditUser />} />,
    <Route path="/listings" element={<Listings />} />,
    <Route path="/listings/:id" element={<Listing />} />,
    <Route path="/listings/:id/edit" element={<EditListing />} />,
    <Route path="/reset-password" element={<ResetPassword />} />,
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
