import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import toast, { Toaster } from "react-hot-toast";
import "./CalendarPage.css"; // custom styles
import { useAuthStore } from "../store/authStore";
import { useNavigate, Link } from "react-router-dom";
import Footer from "../components/Footer";
import rkLogo from "../images/RK Sprinklers.png";
import avatarLogo from "../images/avatar-icon.png";

const API_BASE_URL = import.meta.env.VITE_API_URL;


export default function CalendarPage() {
  const { user, isAuthenticated } = useAuthStore();
  const userId = user?._id;
  const isAdmin = user?.isAdmin;
  const navigate = useNavigate();

  const [date, setDate] = useState(new Date());
  const [selectedSlots, setSelectedSlots] = useState({});
  const [submittedSlots, setSubmittedSlots] = useState({});
  const [allSlots, setAllSlots] = useState([]);
  const [availability, setAvailability] = useState({});

  const isUntoggled = (date) => {
    const key = date.toDateString();
    return availability[key] === undefined;
  };

  const isUnavailable = (date) => {
    const key = date.toDateString();
    return availability[key] === false;
  };  

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 700);

  	useEffect(() => {
	document.title = "RK Sprinklers – Calendar";
	}, []);
  
  useEffect(() => {
    const media = window.matchMedia("(max-width: 700px)");
    const handleChange = (e) => setIsMobile(e.matches);
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  const slots = ["Slot 1", "Slot 2", "Slot 3"];
  const dateKey = date.toDateString();

  // Fetch all slots
  useEffect(() => {
    if (!userId) return;

    const fetchAllSlots = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/slots`, {
          credentials: "include"
        });
        const data = await res.json();

      if (!Array.isArray(data)) {
        console.error("Expected array from /api/slots:", data);
        return;
      } 
        
        setAllSlots(data);

        const userSlots = {};
        data.forEach((slot) => {
          const key = new Date(slot.slotDate).toDateString();
          if (slot.userId === userId) {
            if (isAdmin) {
              if (!userSlots[key]) userSlots[key] = { slots: [] };
              userSlots[key].slots.push({ slot: `Slot ${slot.slotNumber}`, eventId: slot._id });
            } else {
              userSlots[key] = { slot: `Slot ${slot.slotNumber}`, eventId: slot._id };
            }
          }
        });
        setSubmittedSlots(userSlots);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load all slots.");
      }
    };

    fetchAllSlots();
  }, [userId, isAdmin]);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/availability`, {
          credentials: "include"
        });
        const data = await res.json();

      if (!Array.isArray(data)) {
        console.error("Expected array from /api/availability:", data);
        return;
      }

        const availByDate = {};
        data.forEach((a) => {
          const key = new Date(a.date).toDateString();
          availByDate[key] = a.isAvailable;
        });
        setAvailability(availByDate);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load availability.");
      }
    };

    if (isAuthenticated) {
      fetchAvailability();
    }
  }, [isAuthenticated, userId]);

  // Toggle availability (admin only)
  const toggleAvailability = async (dateToToggle) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/availability/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: dateToToggle.toISOString() }),
        credentials: "include",
      });
      const data = await res.json();
      const key = new Date(data.date).toDateString();

      setAvailability((prev) => ({ ...prev, [key]: data.isAvailable }));

      toast(
        `Date ${key} is now ${data.isAvailable ? "available" : "unavailable"}`
      );

      // Remove all slots if marking unavailable
      if (data.isAvailable === false) {
        const slotsToDelete = allSlots.filter(
          (s) => new Date(s.slotDate).toDateString() === key
        );
        for (let slot of slotsToDelete) {
          try {
            await fetch(`${API_BASE_URL}/api/slots/${slot._id}`, { 
              method: "DELETE",
              credentials: "include" 
            });
          } catch (err) {
            console.error("Failed to delete slot:", err);
          }
        }
        setAllSlots((prev) =>
          prev.filter((s) => new Date(s.slotDate).toDateString() !== key)
        );
        setSubmittedSlots((prev) => {
          const updated = { ...prev };
          delete updated[key];

        Object.keys(updated).forEach((dateKey) => {
          if (dateKey === key) delete updated[dateKey];
        });          

          return updated;
        });
        toast("All slots removed for this unavailable date.", { icon: "🗑️" });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update availability.");
    }
  };

const handleSlotClick = (slot) => {
  const isUnavailable = availability[dateKey] === false;
  if (isUnavailable && !isAdmin) return;

  if (!isAdmin && submittedSlots[dateKey]) {
    toast.error("You can only have one slot per day. Remove existing slot to change.");
    return;
  }

  setSelectedSlots((prev) => {
    if (isAdmin) {
      const currentSlots = prev[dateKey] || [];
      if (currentSlots.includes(slot)) {
        return { ...prev, [dateKey]: currentSlots.filter((s) => s !== slot) };
      } else {
        return { ...prev, [dateKey]: [...currentSlots, slot] };
      }
    } else {
      if (prev[dateKey] === slot) {
        const updated = { ...prev };
        delete updated[dateKey];
        return updated;
      } else {
        return { ...prev, [dateKey]: slot };
      }
    }
  });
};


  // Handle slot submission
  const handleSubmit = async () => {
  if (isUntoggled(date) && !isAdmin) {
    toast("⚠️ This day isn’t confirmed as available yet. Please check back later.");
    return;
  }

    if (!selectedSlots[dateKey] || !userId) {
      toast.error("Please select a slot before submitting.");
      return;
    }

    const slotsToSubmit = isAdmin
      ? selectedSlots[dateKey].filter(
          (slot) =>
            !allSlots.some(
              (s) =>
                new Date(s.slotDate).toDateString() === dateKey &&
                s.slotNumber === parseInt(slot.split(" ")[1]) &&
                s.userId === userId
            )
        )
      : selectedSlots[dateKey] ? [selectedSlots[dateKey]] : [];

    if (slotsToSubmit.length === 0) {
      toast.error("No new slots selected.");
      return;
    }

    for (let slot of slotsToSubmit) {
      const slotNumber = parseInt(slot.split(" ")[1]);
      const slotDateISO = date.toISOString();
      try {
        const res = await fetch(`${API_BASE_URL}/api/slots`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, slotDate: slotDateISO, slotNumber }),
          credentials: "include",
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.message || "Slot submission failed");

        setSubmittedSlots((prev) => {
          if (isAdmin) {
            const prevSlots = prev[dateKey]?.slots || [];
            return {
              ...prev,
              [dateKey]: { slots: [...prevSlots, { slot, eventId: result._id }] },
            };
          } else {
            return { ...prev, [dateKey]: { slot, eventId: result._id } };
          }
        });

        setAllSlots((prev) => [...prev, result]);
        toast.success(`Slot ${slot} submitted successfully!`);
      } catch (err) {
        toast.error(err.message);
      }
    }

    setSelectedSlots((prev) => {
      const updated = { ...prev };
      delete updated[dateKey];
      return updated;
    });
  };

  const handleRemoveChoice = async (slotToRemove, eventId = null) => {
    const submitted = submittedSlots[dateKey];

    if (!isAdmin && !window.confirm("Are you sure you want to remove this submitted slot?")) return;

    try {
      const idToDelete = eventId || (isAdmin
        ? submitted.slots.find((s) => s.slot === slotToRemove)?.eventId
        : submitted.eventId);

      await fetch(`${API_BASE_URL}/api/slots/${idToDelete}`, { 
        method: "DELETE",
        credentials: "include", 
      });

      setAllSlots((prev) => prev.filter((s) => s._id !== idToDelete));

      if (!isAdmin) {
        setSubmittedSlots((prev) => {
          const updated = { ...prev };
          delete updated[dateKey];
          return updated;
        });
      } else {
        setSubmittedSlots((prev) => {
          const updated = { ...prev };
          if (updated[dateKey]?.slots) {
            updated[dateKey].slots = updated[dateKey].slots.filter(
              (s) => s.slot !== slotToRemove
            );
            if (updated[dateKey].slots.length === 0) delete updated[dateKey];
          }
          return updated;
        });
      }

      toast("Removed slot.", { icon: "🗑️" });
    } catch (err) {
      toast.error("Failed to remove slot.");
    }
  };

  const renderSlotButton = (slot) => {
    const isUnavailable = availability[dateKey] === false;
    const slotNumber = parseInt(slot.split(" ")[1]);
    const isTakenByOthers = allSlots.some(
      (s) =>
        new Date(s.slotDate).toDateString() === dateKey &&
        s.slotNumber === slotNumber &&
        s.userId !== userId
    );

    let isSelected = false;
    let isSubmitted = false;

    if (isAdmin) {
      const adminSlots = submittedSlots[dateKey]?.slots || [];
      isSelected = selectedSlots[dateKey]?.includes(slot);
      isSubmitted = adminSlots.some((s) => s.slot === slot);
    } else {
      isSelected = selectedSlots[dateKey] === slot;
      isSubmitted = submittedSlots[dateKey]?.slot === slot;
    }

    return (
      <button
        key={slot}
        onClick={() => handleSlotClick(slot)}
        disabled={isSubmitted || isTakenByOthers || (isUnavailable && !isAdmin)}
        className={`p-4 rounded-xl border text-white shadow-md transition 
          ${
            isSubmitted
              ? "bg-green-600 border-green-400 cursor-not-allowed"
              : isTakenByOthers
              ? "bg-gray-600 border-gray-500 cursor-not-allowed opacity-50"
              : isSelected
              ? "bg-green-400 border-green-200"
              : isUnavailable
              ? "bg-gray-500 border-gray-400 opacity-70 cursor-not-allowed"
              : "bg-gray-800 border-gray-700 hover:bg-gray-700 hover:scale-105"
          }`}
      >
        {slot}
      </button>
    );
  };

return (
  <div className="flex flex-col min-h-screen">
    {/* ✅ Mobile Avatar Bar */}
      <div className="mobile-avatar-bar">
        {isAuthenticated ? (
          <span className="mobile-avatar-link">
            <img src={avatarLogo} alt="Customer Avatar" className="mobile-avatar-img" />
            <span className="ml-2">Welcome, {user?.name}!</span>
          </span>
        ) : (
          <Link to="/login" className="mobile-avatar-link" aria-label="Customer Portal">
            <img src={avatarLogo} alt="Customer Portal Avatar" className="mobile-avatar-img" />
          </Link>
        )}
      </div>

      {/* ✅ Top Navbar */}
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
            {/* Hamburger Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="40px"
              viewBox="0 -960 960 960"
              width="40px"
              fill="#c9c9c9"
            >
              <path d="M165.13-254.62q-10.68 0-17.9-7.26-7.23-7.26-7.23-18t7.23-17.86q7.22-7.13 17.9-7.13h629.74q10.68 0 17.9 7.26 7.23 7.26 7.23 18t-7.23 17.87q-7.22 7.12-17.9 7.12H165.13Zm0-200.25q-10.68 0-17.9-7.27-7.23-7.26-7.23-17.99 0-10.74 7.23-17.87 7.22-7.13 17.9-7.13h629.74q10.68 0 17.9 7.27 7.23 7.26 7.23 17.99 0 10.74-7.23 17.87-7.22 7.13-17.9 7.13H165.13Zm0-200.26q-10.68 0-17.9-7.26-7.23-7.26-7.23-18t7.23-17.87q7.22-7.12 17.9-7.12h629.74q10.68 0 17.9 7.26 7.23 7.26 7.23 18t-7.23 17.86q-7.22 7.13-17.9 7.13H165.13Z" />
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
            <a href="tel:5867138783" className="phone-link">
              586-713-8783
            </a>
            {isAuthenticated ? (
              <Link to="/login" className="portal-link">
                <span className="portal-icon">👤</span>
                Welcome, {user?.name}!
              </Link>
            ) : (
              <Link to="/login" className="portal-link">
                <span className="portal-icon">👤</span>
                Customer Portal
              </Link>
            )}
          </div>
        )}
      </header>

      {/* ✅ Second Navbar */}
      <nav id="navbar" className={isSidebarOpen ? "show" : ""}>
        <ul>
          {isMobile && (
            <li>
              <button id="close-sidebar-button" onClick={closeSidebar} aria-label="Close sidebar">
                {/* Close Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="40px"
                  viewBox="0 -960 960 960"
                  width="40px"
                  fill="#c9c9c9"
                >
                  <path d="m480-444.62-209.69 209.7q-7.23 7.23-17.5 7.42-10.27.19-17.89-7.42-7.61-7.62-7.61-17.7 0-10.07 7.61-17.69L444.62-480l-209.7-209.69q-7.23-7.23-7.42-17.5-.19-10.27 7.42-17.89 7.62-7.61 17.7-7.61 10.07 0 17.69 7.61L480-515.38l209.69-209.7q7.23-7.23 17.5-7.42 10.27-.19 17.89 7.42 7.61 7.62 7.61 17.7 0 10.07-7.61 17.69L515.38-480l209.7 209.69q7.23 7.23 7.42 17.5.19 10.27-7.42 17.89-7.62 7.61-17.7 7.61-10.07 0-17.69-7.61L480-444.62Z" />
                </svg>
              </button>
            </li>
          )}
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/services">Services</Link>
          </li>
          <li>
            <Link to="/careers">Careers</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
      </nav>

      {isSidebarOpen && <div id="overlay" onClick={closeSidebar} aria-hidden="true"></div>}      

    <main className="flex-grow">
      <div className="max-w-2xl w-full mx-auto mt-12 p-10 bg-gray-900 bg-opacity-80 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-800 text-center">
        <Toaster position="top-center" reverseOrder={false} />

        {/* ✅ Back to Dashboard Arrow */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center text-green-400 hover:text-green-300 mb-6"
        >
          ← Back to Dashboard
        </button>

        <h1 className="text-4xl font-extrabold mb-6 bg-gradient-to-r from-green-400 to-emerald-600 text-transparent bg-clip-text">
          Calendar
        </h1>

        {isAdmin ? (
          <p className="text-yellow-400 font-semibold mb-4">🔑 Admin Access</p>
        ) : (
          <p className="text-gray-400 mb-4">👤 User Access</p>
        )}

    <div className="flex justify-center mb-4">
      <Calendar
        onChange={(newDate) => setDate(newDate)}
        value={date}
        tileDisabled={({ date: tileDate }) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const checkDate = new Date(tileDate);
          checkDate.setHours(0, 0, 0, 0);

          if (checkDate < today) return true;
          if (!isAdmin && isUnavailable(tileDate)) return true;
          return false;
        }}
        tileClassName={({ date: tileDate }) => {
          const key = tileDate.toDateString();
          if (availability[key] === false) return "admin-unavailable";
          if (availability[key] === true) return "admin-available";
          if (isAdmin && isUntoggled(tileDate)) return "admin-untoggled";
          return "";
        }}
        className="rounded-xl shadow-lg p-4 bg-gray-800 text-white border border-gray-700"
      />
    </div>

        {isAdmin && isUntoggled(date) && (
          <p className="mt-2 text-yellow-400 font-semibold">
            ⚠️ This date has not been toggled. Please mark it as Available or Unavailable.
            </p>
          )}

        {isAdmin && (
          <button
            onClick={() => toggleAvailability(date)}
            className={`mt-4 px-6 py-3 rounded-xl font-semibold shadow-md text-white transition ${
              availability[dateKey] === false
                ? "bg-green-600 hover:bg-green-500"
                : "bg-red-600 hover:bg-red-500"
            }`}
          >
            {availability[dateKey] === false ? "Mark Available" : "Mark Unavailable"}
          </button>
        )}

        <p className="mt-2 text-lg text-gray-300">
          Selected date:{" "}
          <span className="font-semibold text-green-400">{dateKey}</span>
        </p>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {slots.map(renderSlotButton)}
        </div>

        {selectedSlots[dateKey] && (
          <p className="mt-4 text-lg text-gray-300">
            Selected slot{isAdmin ? "s" : ""}:{" "}
            <span className="font-semibold text-green-400">
              {isAdmin ? selectedSlots[dateKey].join(", ") : selectedSlots[dateKey]}
            </span>
          </p>
        )}

        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-md transition"
          >
            Submit Slot
          </button>

          {submittedSlots[dateKey] &&
            (isAdmin
              ? submittedSlots[dateKey].slots.map((s) => (
                  <button
                    key={s.slot}
                    onClick={() => handleRemoveChoice(s.slot)}
                    className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl shadow-md transition"
                  >
                    Remove {s.slot}
                  </button>
                ))
              : (
                <button
                  onClick={handleRemoveChoice}
                  className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl shadow-md transition"
                >
                  Remove Choice
                </button>
              ))}
        </div>

        {/* Admin-only "All Slots on Date" panel */}
        {isAdmin && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-green-400 mb-4">
              All Slots on {dateKey}
            </h2>
            <div className="space-y-3">
              {allSlots
                .filter((s) => new Date(s.slotDate).toDateString() === dateKey)
                .map((s) => (
                  <div
                    key={s._id}
                    className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700"
                  >
                    <div>
                      <p className="text-white font-semibold">
                        Slot {s.slotNumber}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {s.userName || "Unknown User"} – {s.userPhone || "No phone"}
                      </p>
                      <p className="text-gray-500 text-xs">{s.userAddress}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveChoice(`Slot ${s.slotNumber}`, s._id)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg shadow-md"
                    >
                      Delete
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </main>

    {/* Footer stays at bottom */}
    <Footer />
  </div>
);
}