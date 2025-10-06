import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import { useAuthStore } from "../store/authStore";

const API_URL = "http://localhost:5000/api/availability";

const AdminCalendar = () => {
  const [dates, setDates] = useState([]);
  const { user } = useAuthStore();

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      const res = await axios.get(API_URL, { withCredentials: true });
      setDates(res.data);
    } catch (err) {
      console.error("Error fetching availability:", err);
    }
  };

  const toggleDate = async (date) => {
    if (!user?.isAdmin) return alert("Only admins can edit availability");
    try {
      await axios.post(
        `${API_URL}/toggle`,
        { date },
        { withCredentials: true }
      );
      fetchAvailability();
    } catch (err) {
      console.error("Error updating availability:", err);
    }
  };

  const isAvailable = (date) => {
    return dates.some(
      (d) =>
        new Date(d.date).toDateString() === date.toDateString() && d.isAvailable
    );
  };

  return (
    <div className="p-6 bg-gray-900 text-white rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Admin Availability Calendar</h2>
      <Calendar
        onClickDay={(date) => toggleDate(date)}
        tileClassName={({ date }) =>
          isAvailable(date)
            ? "bg-green-500 text-white rounded-md"
            : "bg-red-500 text-white rounded-md"
        }
      />
      <p className="mt-4 text-gray-400">Click a date to toggle availability.</p>
    </div>
  );
};

export default AdminCalendar;
