import { useParams } from "react-router-dom";
import { useState } from "react";

const ApplicationPage = () => {
  const { locationCode, slugAndId } = useParams();
  const [slug, id] = slugAndId.split("_");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    resume: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "resume") {
      setForm({ ...form, resume: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("phone", form.phone);
    formData.append("resume", form.resume);
    formData.append("jobId", id);
    formData.append("locationCode", locationCode);
    formData.append("slug", slug);

    console.log("Application submitted:", formData);

    alert(`Your application for job ${slug} (${id}) has been submitted!`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-lg text-white">
        <h1 className="text-3xl font-bold mb-6 text-emerald-400">
          Apply for Job
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-3 rounded bg-gray-700 text-white"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 rounded bg-gray-700 text-white"
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            className="w-full p-3 rounded bg-gray-700 text-white"
            required
          />
          <input
            type="file"
            name="resume"
            accept="application/pdf"
            onChange={handleChange}
            className="w-full text-gray-200"
            required
          />
          {form.resume && <p className="text-gray-300 text-sm mt-1">Selected file: {form.resume.name}</p>}
          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg font-semibold"
          >
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplicationPage;