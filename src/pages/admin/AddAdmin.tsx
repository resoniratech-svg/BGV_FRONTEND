import { useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";

function AddAdmin() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [access, setAccess] = useState("");
  const [status, setStatus] = useState("Active");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !role || !access) {
      toast.error("Please fill all fields");
      return;
    }
    const admins = JSON.parse(localStorage.getItem("admins") || "[]");
    const newAdmin = {
      id: `ADM-${Date.now()}`,
      name,
      role,
      access,
      status,
    };
    admins.push(newAdmin);
    localStorage.setItem("admins", JSON.stringify(admins));
    toast.success("Admin added successfully");
    navigate("/admin");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Add Admin</h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Access Level"
            value={access}
            onChange={(e) => setAccess(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="Active">Active</option>
            <option value="Restricted">Restricted</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-[#5B5FEF] hover:bg-[#4B4FD8] text-white font-bold py-2 px-4 rounded"
        >
          Add Admin
        </button>
      </form>
    </div>
  );
}

export default AddAdmin;
