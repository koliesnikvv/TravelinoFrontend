import './App.css';
import Home from './pages/Home';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AboutUs from "./pages/AboutUs";
import Contacts from "./pages/Contacts";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TripsPage from "./pages/TripsPage";
import ProfilePage from './pages/user/ProfilePage';
import LoginPage from './pages/user/LoginPage';
import RegisterPage from './pages/user/RegisterPage';
import EmailConfirmedPage from './pages/user/EmailConfirmedPage';
import EmailErrorPage from './pages/user/EmailErrorPage';
import ForgotPasswordPage from './pages/user/ForgotPasswordPage';
import ResetPasswordPage from "./pages/user/ResetPasswordPage";
import Scroll from "./components/layout/Scroll";
import CreateTripPage from "./pages/trips/CreateTripPage";
import TripPage from "./pages/trips/TripPage";
import AcceptInvitePage from "./pages/user/AcceptInvitePage";
import TransportSearchPage from "./pages/trips/TransportSearchPage";
import AccommodationSearchPage from './pages/trips/AccommodationSearchPage';
import ActivitySearchPage from './pages/trips/ActivitySearchPage';

function App() {
    return (
        <BrowserRouter>
            <Scroll />
            <div className="app-wrapper">
                <Navbar />
                <main className="main-content">
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/email-confirmed" element={<EmailConfirmedPage />} />
                        <Route path="/email-error" element={<EmailErrorPage />} />
                        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                        <Route path="/reset-password/:uid/:token" element={<ResetPasswordPage />} />
                        <Route path="/invite/accept" element={<AcceptInvitePage />} />
                        <Route path="/about" element={<AboutUs />} />
                        <Route path="/contact" element={<Contacts />} />

                        <Route path="/" element={<Home />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/trips" element={<TripsPage />} />
                        <Route path="/trips/new" element={<CreateTripPage />} />
                        <Route path="/trips/:id" element={<TripPage />} />                       
                       
                        <Route path="/trips/:id/transport/search" element={<TransportSearchPage />} />
                        <Route path="/trips/:id/accommodation/search" element={<AccommodationSearchPage />} />
                        <Route path="/trips/:id/activities/search" element={<ActivitySearchPage />} />

                    </Routes>
                </main>
                <Footer />
            </div>
        </BrowserRouter>
    );
}

export default App;