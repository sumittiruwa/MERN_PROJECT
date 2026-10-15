import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserHome from "./UserHome.jsx";
import Register from "./pages/Register.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserHome />} />
        <Route
          path="/register-pharmacy"
          element={<Register />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
