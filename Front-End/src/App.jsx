import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HeroPage } from "./Pages/HeroPage";
import { Login } from "./Pages/Login";
import { Signup } from "./Pages/Signup";
import Problems from "./Pages/Problems";
import Dashboard from "./Pages/Dashboard";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <div>
          <HeroPage />
        </div>
      ),
    },
    {
      path: "/login",
      element: (
        <div>
          <Login />
        </div>
      ),
    },
    {
      path: "/signup",
      element: (
        <div>
          <Signup />
        </div>
      ),
    },
    {
      path: "/problems",
      element: (
        <div>
          <Problems />
        </div>
      ),
    },
    {
      path: "/dashboard",
      element: (
        <div>
          <Dashboard />
        </div>
      ),
    },
    
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
