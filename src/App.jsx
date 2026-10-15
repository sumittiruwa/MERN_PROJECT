import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./header.jsx";
import ProtectedRoute from "./components/ProtectedRoute";

import UserHome from "./UserHome.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Register from "./pages/Register.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        {/* Show UserHome first */}
        <Route path="/" element={<UserHome />} />

        {/* Pharmacy registration */}
        <Route
          path="/register-pharmacy"
          element={<Register />}
        />

        {/* Pharmacy dashboard after login */}
        <Route element={<ProtectedRoute allowedRole="pharmacy" />}>
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}