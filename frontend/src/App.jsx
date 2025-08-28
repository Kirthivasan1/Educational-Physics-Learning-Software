import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import ViewPlaygrounds from "./components/ViewPlaygrounds";
// import SimulationCanvas from "./components/Playground";
import Playground from "./components/Playground";
import NewPlaygroundForm from "./components/NewPlaygroundForm";
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import Logout from "./components/Logout";
import HomePage from "./components/HomePage";

const isAuthenticated = () => !!localStorage.getItem("token");

function PrivateRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/signin" replace />;
  }
  return children;
}

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
      index: true,
    },
    {
      path: "/playground/:id?", // optional playground ID param for existing or new playground
      element: (
        <PrivateRoute>
          <Playground />
        </PrivateRoute>
      ),
    },
    {
      path: "/new",
      element: (
        <PrivateRoute>
          <NewPlaygroundForm />
        </PrivateRoute>
      ),
    },
    {
      path: "/viewplaygrounds",
      element: (
        <PrivateRoute>
          <ViewPlaygrounds />
        </PrivateRoute>
      ),
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/signin",
      element: <Signin />,
    },
    {
      path: "/logout",
      element: (
        <PrivateRoute>
          <Logout />
        </PrivateRoute>
      ),
    },
    // Catch all for unknown routes
    {
      path: "*",
      element: <Navigate to="/" replace />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;