import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import Login from "./pages/Auth/Login";
import Registration from "./pages/Auth/Registration";
import ResetPass from "./pages/Auth/ResetPass";
import HomePage from "./pages/Home/HomePage";
import NotFound from "./NotFound";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default Route */}
        <Route path="/" element={<Login />} />

        {/* Auth Routes */}
        <Route path="/register" element={<Registration />} />
        <Route path="/reset" element={<ResetPass />} />

        {/* Home Chat */}
        <Route path="/home" element={<HomePage />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;