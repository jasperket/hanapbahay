import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router";
import RootLayout, { loader as rootLoader } from "@/routes/root";
import ProtectedRoute from "@/routes/ProtectedRoute";
import Home from "@/pages/Home";
import Account from "@/pages/Account";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route id="root" loader={rootLoader} element={<RootLayout />}>
      <Route index element={<Home />} />
      <Route element={<ProtectedRoute />}>
        <Route path="account" element={<Account />} />
      </Route>
    </Route>,
  ),
);

export { router };
