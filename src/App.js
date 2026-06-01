import './App.css';
import Home from './pages/Home';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AboutUs from "./pages/AboutUs";
import Contacts from "./pages/Contacts";
import {BrowserRouter, Routes, Route, Scripts} from 'react-router-dom';
import TripsPage from "./pages/TripsPage";
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EmailConfirmedPage from './pages/EmailConfirmedPage';
import EmailErrorPage from './pages/EmailErrorPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ProfilePage from "./pages/ProfilePage";
import Scroll from "./components/layout/Scroll";

function App() {
  return (
      <BrowserRouter>
          <Scroll />
            <div className="app-wrapper">
                <Navbar />
                <main className="main-content">
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/" element={<Home />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/email-confirmed" element={<EmailConfirmedPage />} />
                        <Route path="/email-error" element={<EmailErrorPage />} />
                        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                        <Route path="/reset-password" element={<ResetPasswordPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/trips" element={<TripsPage />} />
                        <Route path="/about" element={<AboutUs />} />
                        <Route path="/contact" element={<Contacts />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </BrowserRouter> )
}

export default App;