import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EmailConfirmedPage from './pages/EmailConfirmedPage';
import EmailErrorPage from './pages/EmailErrorPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ProfilePage from "./pages/ProfilePage";

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
        </Routes>
      </BrowserRouter>
  );
}

export default App;