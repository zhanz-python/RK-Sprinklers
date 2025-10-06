import { useState, useEffect } from "react";
import { motion } from "framer-motion"; 
import { useAuthStore } from "../store/authStore.js";
import { useNavigate, Link } from "react-router-dom";
import Footer from "../components/Footer";
import rkLogo from "../../src/images/RK Sprinklers.png";
import avatarLogo from "../../src/images/avatar-icon.png";
import "../../styles/footer.css";

const DashboardPage = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 700);


	useEffect(() => {
	document.title = "RK Sprinklers – Dashboard";
	}, []);  

  useEffect(() => {
    const media = window.matchMedia("(max-width: 700px)");
    const handleChange = (e) => setIsMobile(e.matches);
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  const handleLogout = () => logout();
  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex flex-col min-h-screen">
      {/* --- Mobile Avatar Bar --- */}
      <div className="mobile-avatar-bar">
        {user ? (
          <span className="mobile-avatar-link">
            <img src={avatarLogo} alt="Customer Avatar" className="mobile-avatar-img" />
            <span className="ml-2">Welcome, {user?.name}!</span>
          </span>
        ) : (
          <Link to="/login" className="mobile-avatar-link">
            <img src={avatarLogo} alt="Customer Portal Avatar" className="mobile-avatar-img" />
          </Link>
        )}
      </div>

      {/* --- Top Navbar --- */}
      <header className="top-navbar">
        <Link to="/" className="logo-link">
          <img src={rkLogo} alt="RK Sprinklers Logo" className="topnav-logo" />
        </Link>

        {isMobile && (
          <button
            id="open-sidebar-button"
            onClick={openSidebar}
            aria-label="Open sidebar"
            aria-expanded={isSidebarOpen}
            aria-controls="navbar"
          >
            {/* Hamburger Menu Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#c9c9c9">
              <path d="M165.13-254.62q-10.68 0-17.9-7.26-7.23-7.26-7.23-18t7.23-17.86q7.22-7.13 17.9-7.13h629.74q10.68 0 17.9 7.26 7.23 7.26 7.23 18t-7.23 17.87q-7.22 7.12-17.9 7.12H165.13Zm0-200.25q-10.68 0-17.9-7.27-7.23-7.26-7.23-17.99 0-10.74 7.23-17.87 7.22-7.13 17.9-7.13h629.74q10.68 0 17.9 7.27 7.23 7.26 7.23 17.99 0 10.74-7.23 17.87-7.22 7.13-17.9 7.13H165.13Zm0-200.26q-10.68 0-17.9-7.26-7.23-7.26-7.23-18t7.23-17.87q7.22-7.12 17.9-7.12h629.74q10.68 0 17.9 7.26 7.23 7.26 7.23 18t-7.23 17.86q-7.22 7.13-17.9 7.13H165.13Z" />
            </svg>
          </button>
        )}

        {isMobile && (
          <a href="tel:5867138783" className="mobile-call-icon">
            📞
          </a>
        )}

        {!isMobile && (
          <div className="top-navbar-right">
            <a href="tel:5867138783" className="phone-link">
              586-713-8783
            </a>

            {user ? (
              <span className="portal-link">
                <span className="portal-icon">👤</span> Welcome, {user?.name}!
              </span>
            ) : (
              <Link to="/login" className="portal-link">
                <span className="portal-icon">👤</span> Customer Portal
              </Link>
            )}
          </div>
        )}
      </header>

      {/* --- Sidebar Navbar --- */}
      <nav id="navbar" className={isSidebarOpen ? "show" : ""}>
        <ul>
          {isMobile && (
            <li>
              <button id="close-sidebar-button" onClick={closeSidebar} aria-label="Close sidebar">
                ✕
              </button>
            </li>
          )}
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/services">Services</Link></li>
          <li><Link to="/careers">Careers</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </nav>

      {isSidebarOpen && <div id="overlay" onClick={closeSidebar} aria-hidden="true"></div>}

      {/* --- Dashboard Content --- */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl w-full mx-auto mt-12 p-10 bg-gray-900 bg-opacity-80 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-800 flex-1 mb-12"
      >
        <h2 className="text-4xl font-extrabold mb-2 text-center bg-gradient-to-r from-green-400 to-emerald-600 text-transparent bg-clip-text">
          Welcome{user?.name ? `, ${user.name}` : ""}!
        </h2>

        <p className="text-gray-300 text-center mb-10 text-lg">
          This is your personal dashboard. Access your calendar and useful tips below.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <motion.div className="p-6 bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700 hover:border-green-500 hover:bg-gray-700 transition cursor-default" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h3 className="text-xl font-semibold text-green-400 mb-2">Welcome Message</h3>
            <p className="text-gray-300">Here you can check your calendar and see helpful tips about managing your account.</p>
          </motion.div>

          <motion.div className="p-6 bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700 hover:border-green-500 hover:bg-gray-700 transition cursor-default" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <h3 className="text-xl font-semibold text-green-400 mb-2">Tip</h3>
            <p className="text-gray-300">You can explore the calendar to manage your appointments or check updates here.</p>
          </motion.div>
        </div>

        <motion.div onClick={() => navigate("/calendar")} className="cursor-pointer p-6 mt-6 bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700 hover:border-green-500 hover:bg-gray-700 transition" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} whileHover={{ scale: 1.03 }}>
          <h3 className="text-2xl font-semibold text-green-400 mb-2">Calendar</h3>
          <p className="text-gray-300">View and manage your upcoming appointments.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="mt-10">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleLogout} className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900">
            Logout
          </motion.button>
        </motion.div>
      </motion.div>

      {/* --- Footer --- */}
      <Footer />
    </div>
  );
};

export default DashboardPage;
