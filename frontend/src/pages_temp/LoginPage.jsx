import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Loader } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";  // ⬅️ added useNavigate + useLocation
import Input from "../components/Input";
import { useAuthStore } from "../store/authStore";
import Footer from "../components/Footer";
import "../../styles/home-page-styles.css";
import rkLogo from "../images/RK Sprinklers.png";
import avatarLogo from "../images/avatar-icon.png";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 700);

  const { login, isLoading, error } = useAuthStore();

  const navigate = useNavigate();
  const location = useLocation();

  	useEffect(() => {
	document.title = "RK Sprinklers – Login";
	}, []);

  // Handle responsive detection
  useEffect(() => {
    const media = window.matchMedia("(max-width: 700px)");
    const handleChange = (e) => setIsMobile(e.matches);
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

const handleLogin = async (e) => {
  e.preventDefault();
  try {
    await login(email, password);

    const user = useAuthStore.getState().user;

    if (!user?.isVerified) {
      navigate("/verify-email", { replace: true });
    } else {
      const redirectPath = location.state?.from || "/dashboard";
      navigate(redirectPath, { replace: true });
    }
  } catch (err) {
    console.error("Login failed", err);
  }
};


  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex flex-col min-h-screen">
      {/* --- Mobile Avatar Bar --- */}
      <div className="mobile-avatar-bar">
        <Link
          to="/login"
          state={{ from: "/dashboard" }} // ⬅️ ensures customer portal login goes to dashboard
          className="mobile-avatar-link"
          aria-label="Customer Portal"
        >
          <img
            src={avatarLogo}
            alt="Customer Portal Avatar"
            className="mobile-avatar-img"
          />
        </Link>
      </div>

      {/* --- Top Navbar --- */}
      <header className="top-navbar">
        <Link to="/home" className="logo-link">
          <img
            src={rkLogo}
            alt="RK Sprinklers Logo"
            className="topnav-logo"
          />
        </Link>

        {isMobile && (
          <button
            id="open-sidebar-button"
            onClick={openSidebar}
            aria-label="Open sidebar"
            aria-expanded={isSidebarOpen}
            aria-controls="navbar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#c9c9c9">
              <path d="M165.13-254.62q-10.68 0-17.9-7.26-7.23-7.26-7.23-18t7.23-17.86q7.22-7.13 17.9-7.13h629.74q10.68 0 17.9 7.26 7.23 7.26 7.23 18t-7.23 17.87q-7.22 7.12-17.9 7.12H165.13Zm0-200.25q-10.68 0-17.9-7.27-7.23-7.26-7.23-17.99 0-10.74 7.23-17.87 7.22-7.13 17.9-7.13h629.74q10.68 0 17.9 7.27 7.23 7.26 7.23 17.99 0 10.74-7.23 17.87-7.22 7.13-17.9 7.13H165.13Zm0-200.26q-10.68 0-17.9-7.26-7.23-7.26-7.23-18t7.23-17.87q7.22-7.12 17.9-7.12h629.74q10.68 0 17.9 7.26 7.23 7.26 7.23 18t-7.23 17.86q-7.22 7.13-17.9 7.13H165.13Z"/>
            </svg>
          </button>
        )}

        {isMobile && (
          <a href="tel:5867138783" className="mobile-call-icon" aria-label="Call RK Sprinklers">
            📞
          </a>
        )}

        {!isMobile && (
          <div className="top-navbar-right">
            <a href="tel:5867138783" className="phone-link">586-713-8783</a>
            <Link
              to="/login"
              state={{ from: "/dashboard" }} // ⬅️ ensures desktop "Customer Portal" goes to dashboard
              className="portal-link"
            >
              <span className="portal-icon">👤</span>
              Customer Portal
            </Link>
          </div>
        )}
      </header>

      {/* --- Second Navbar --- */}
      <nav id="navbar" className={isSidebarOpen ? "show" : ""}>
        <ul>
          {isMobile && (
            <li>
              <button
                id="close-sidebar-button"
                onClick={closeSidebar}
                aria-label="Close sidebar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#c9c9c9">
                  <path d="m480-444.62-209.69 209.7q-7.23 7.23-17.5 7.42-10.27.19-17.89-7.42-7.61-7.62-7.61-17.7 0-10.07 7.61-17.69L444.62-480l-209.7-209.69q-7.23-7.23-7.42-17.5-.19-10.27 7.42-17.89 7.62-7.61 17.7-7.61 10.07 0 17.69 7.61L480-515.38l209.69-209.7q7.23-7.23 17.5-7.42 10.27-.19 17.89 7.42 7.61 7.62 7.61 17.7 0 10.07-7.61 17.69L515.38-480l209.7 209.69q7.23 7.23 7.42 17.5.19 10.27-7.42 17.89-7.62 7.61-17.7 7.61-10.07 0-17.69-7.61L480-444.62Z"/>
                </svg>
              </button>
            </li>
          )}
          <li className="home-li"><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/services">Services</Link></li>
          <li><Link to="/careers">Careers</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </nav>

      {isSidebarOpen && <div id="overlay" onClick={closeSidebar} aria-hidden="true"></div>}

      {/* --- Login Form --- */}
      <main className="flex flex-1 items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="p-8">
            <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
              Welcome Back
            </h2>
            <form onSubmit={handleLogin}>
              <Input icon={Mail} type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Input icon={Lock} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <div className="flex items-center mb-6">
                <Link to="/forgot-password" className="text-sm text-green-400 hover:underline">
                  Forgot password?
                </Link>
              </div>
              {error && <p className="text-red-500 font-semibold mb-2">{error}</p>}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? <Loader className="w-6 h-6 animate-spin mx-auto" /> : "Login"}
              </motion.button>
            </form>
          </div>
          <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
            <p className="text-sm text-gray-400">
              Don't have an account?{" "}
              <Link to="/signup" className="text-green-400 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </motion.div>
      </main>

      {/* --- Footer --- */}
      <Footer />
    </div>
  );
};

export default LoginPage;
