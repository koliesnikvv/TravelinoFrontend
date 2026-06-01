import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/user/LoginPage';
import RegisterPage from './pages/user/RegisterPage';
import EmailConfirmedPage from './pages/user/EmailConfirmedPage';
import EmailErrorPage from './pages/user/EmailErrorPage';
import ForgotPasswordPage from './pages/user/ForgotPasswordPage';
import ResetPasswordPage from "./pages/user/ResetPasswordPage";
import ProfilePage from "./pages/user/ProfilePage";
import CreateTripPage from "./pages/trips/CreateTripPage";
import TripPage from "./pages/trips/TripPage";

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/email-confirmed" element={<EmailConfirmedPage />} />
            <Route path="/email-error" element={<EmailErrorPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/profile" element={<ProfilePage />} />

            <Route path="/trips/new" element={<CreateTripPage />} />
            <Route path="/trips/:id" element={<TripPage />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;