import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function NewPlaygroundForm() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async () => {
    if (!name.trim()) {
      console.log("Playground name is required");
      return;
    }
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      // console.log("Token being sent:", token);
      const config = {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      };
      const res = await axios.post(
        "http://localhost:5000/api/playground",
        { name },
        config
      );
      console.log("Playground created");
      const id = res.data.id;
      navigate(`/playground?id=${id}`);
    } catch (err) {
      console.log(err);
      // console.error("Failed to create playground:", err);
      alert("Error creating playground");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-2xl font-semibold">Create New Playground</h1>
      <input
        type="text"
        placeholder="Enter playground name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border px-4 py-2 rounded w-64"
      />
      <button
        onClick={handleCreate}
        disabled={loading}
        className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Empty Playground"}
      </button>
    </div>
  );
}

export default NewPlaygroundForm;
