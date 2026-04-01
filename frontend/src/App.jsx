import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import States from "./pages/States";
import StateDetails from "./pages/StateDetails";
import PlaceDetails from "./pages/PlaceDetails";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function AppLayout() {
  const location = useLocation();
  const hideFooter =
    location.pathname === "/admin/dashboard" ||
    location.pathname === "/admin/login";

  return (
    <>
      <Navbar />
      <main className="page-content">
        <Routes>
          <Route path="/" element={<States />} />
          <Route path="/state/:id" element={
              <ProtectedRoute>
                <States />
              </ProtectedRoute>
            } />
          <Route path="/destination/:id" element={<PlaceDetails />} />
          <Route path="/place/:id" element={<PlaceDetails />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      {!hideFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
