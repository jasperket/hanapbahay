import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router";
import RootLayout from "@/routes/root";
import ProtectedRoute from "@/routes/ProtectedRoute";
import LandlordRoute from "@/routes/LandlordRoute";
import Home from "@/pages/Home";
import PropertyDetails from "@/pages/PropertyDetails";
import Account from "@/pages/Account";
import CreateProperty from "@/pages/CreateProperty";
import LandlordProperties from "@/pages/LandlordProperties";
import EditProperty from "@/pages/EditProperty";
import GuestRoute from "./routes/GuestRoute";
import { rootLoader } from "./routes/rootLoader";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route id="root" loader={rootLoader} element={<RootLayout />}>
      <Route element={<GuestRoute />}>
        <Route index element={<Home />} />
      </Route>
      <Route path="properties/:propertyId" element={<PropertyDetails />} />
      <Route element={<ProtectedRoute />}>
        <Route path="account" element={<Account />} />
        <Route element={<LandlordRoute />}>
          <Route path="properties" element={<LandlordProperties />} />
          <Route path="properties/new" element={<CreateProperty />} />
          <Route
            path="properties/:propertyId/edit"
            element={<EditProperty />}
          />
        </Route>
      </Route>
    </Route>,
  ),
);

export { router };
