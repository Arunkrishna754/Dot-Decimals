import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { API } from "../../api";

const ProfilePage = () => {
  const [user, setUser] = useState({
    name: localStorage.getItem("userName") || "",
    email: localStorage.getItem("userEmail") || "",
  });

  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState({
    street: "",
    city: "Coimbatore",
    state: "Tamil Nadu",
    pincode: "",
    phone: ""
  });
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [pinError, setPinError] = useState(false);

  const token = localStorage.getItem("token");
  const headers = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await API.get("/profile/addresses", headers);
      setAddresses(res.data.addresses || []);
    } catch (err) {
      toast.error("Failed to fetch addresses");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // update user for name/email
    if (name === "name" || name === "email") {
      setUser({ ...user, [name]: value });
      return;
    }

    setForm({ ...form, [name]: value });

    if (name === "pincode") {
      setPinError(!/^641\d{3}$/.test(value));
    }
  };

  const handleSave = async () => {
    // Update user info
    if (!user.name || !user.email) {
      return toast.error("Please fill name and email");
    }
    try {
      await API.put("/profile", user, headers);
      localStorage.setItem("userName", user.name);
      localStorage.setItem("userEmail", user.email);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error updating profile");
    }

    // Address validation
    if (!form.street || !form.pincode || !form.phone) {
      return toast.error("Please fill all mandatory fields (*)");
    }

    if (pinError) return toast.error("Only Coimbatore pincodes allowed");
    if (!/^\d{10}$/.test(form.phone)) return toast.error("Enter valid 10-digit phone");

    setLoading(true);
    try {
      let res;
      if (editId) {
        res = await API.put(`/profile/addresses/${editId}`, form, headers);
        toast.success("Address updated");
      } else {
        res = await API.post("/profile/addresses", form, headers);
        toast.success("Address added");
      }
      setAddresses(res.data.addresses || []);
      setForm({ street: "", city: "Coimbatore", state: "Tamil Nadu", pincode: "", phone: "" });
      setEditId(null);
      setPinError(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving address");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (addr) => {
    setForm(addr);
    setEditId(addr._id);
    setPinError(!/^641\d{3}$/.test(addr.pincode));
  };

  const handleDelete = async (id) => {
    try {
      const res = await API.delete(`/profile/addresses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses(res.data.addresses || []);
      toast.success("Address deleted");
    } catch (err) {
      console.error("❌ Delete error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to delete address");
    }
  };

  const handleProfileSave = async () => {
  if (!user.name || !user.email) {
    return toast.error("Please fill name and email");
  }
  try {
    await API.put("/profile", user, headers);
    localStorage.setItem("userName", user.name);
    localStorage.setItem("userEmail", user.email);
    toast.success("Profile updated");
  } catch (err) {
    toast.error(err.response?.data?.message || "Error updating profile");
  }
};


  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center py-12 px-4 mt-20">
      {/* User Info */}
      <div className="w-full max-w-4xl bg-gray-900 rounded-2xl shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-semibold mb-6 text-white">Profile</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 mb-1">Name *</label>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              className="p-3 bg-gray-800 text-gray-200 border border-gray-700 rounded w-full"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Email *</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              className="p-3 bg-gray-800 text-gray-200 border border-gray-700 rounded w-full"
            />
          </div>
        </div>
        <button
          onClick={handleProfileSave}
          className="mt-4 bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg transition"
        >
          Save Profile
        </button>
      </div>

      {/* Address Form */}
      <div className="w-full max-w-4xl bg-gray-900 rounded-2xl shadow-lg p-8 mb-4">
        <h2 className="text-xl font-semibold mb-2 text-white">
          {editId ? "Edit Address" : "Add New Address"}
        </h2>
        <p className="text-gray-400 mb-4 text-sm">
          Currently, the products are available only in Coimbatore location.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 mb-1">Street *</label>
            <input
              name="street"
              value={form.street}
              onChange={handleChange}
              placeholder="Street"
              className="p-3 bg-gray-800 text-gray-200 border border-gray-700 rounded w-full"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">City</label>
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="City"
              className="p-3 bg-gray-800 text-gray-200 border border-gray-700 rounded w-full"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">State</label>
            <input
              name="state"
              value={form.state}
              onChange={handleChange}
              placeholder="State"
              className="p-3 bg-gray-800 text-gray-200 border border-gray-700 rounded w-full"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Pincode *</label>
            <input
              name="pincode"
              value={form.pincode}
              onChange={handleChange}
              placeholder="Pincode"
              className={`p-3 bg-gray-800 text-gray-200 border rounded w-full ${pinError ? "border-red-500" : "border-gray-700"
                }`}
            />
            {pinError && (
              <p className="text-red-500 text-sm mt-1">
                Only Coimbatore pincodes allowed
              </p>
            )}
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Phone *</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="p-3 bg-gray-800 text-gray-200 border border-gray-700 rounded w-full"
            />
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="mt-4 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg transition"
        >
          {loading ? "Saving..." : editId ? "Update Address" : "Add Address"}
        </button>
      </div>

      {/* Address Table / Cards */}
      <div className="w-full max-w-4xl bg-gray-900 rounded-2xl shadow-lg p-8">
        <h2 className="text-xl font-semibold mb-4 text-white">Saved Addresses</h2>

        {/* Desktop Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full border border-gray-700">
            <thead>
              <tr className="bg-gray-800 text-gray-300">
                <th className="border border-gray-700 px-2 py-2">Street</th>
                <th className="border border-gray-700 px-2 py-2">City</th>
                <th className="border border-gray-700 px-2 py-2">State</th>
                <th className="border border-gray-700 px-2 py-2">Pincode</th>
                <th className="border border-gray-700 px-2 py-2">Phone</th>
                <th className="border border-gray-700 px-2 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {addresses.length > 0 ? (
                addresses.map((addr) => (
                  <tr key={addr._id} className="hover:bg-gray-800">
                    <td className="border border-gray-700 px-2 py-2">{addr.street}</td>
                    <td className="border border-gray-700 px-2 py-2">{addr.city}</td>
                    <td className="border border-gray-700 px-2 py-2">{addr.state}</td>
                    <td className="border border-gray-700 px-2 py-2">{addr.pincode}</td>
                    <td className="border border-gray-700 px-2 py-2">{addr.phone}</td>
                    <td className="border border-gray-700 px-2 py-2 space-x-2">
                      <button
                        onClick={() => handleEdit(addr)}
                        className="bg-yellow-500 hover:bg-yellow-400 text-black px-3 py-1 rounded transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(addr._id)}
                        className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-3 text-gray-400">
                    No addresses added
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="sm:hidden flex flex-col gap-4">
          {addresses.length > 0 ? (
            addresses.map((addr) => (
              <div key={addr._id} className="bg-gray-800 rounded-lg p-4 shadow border border-gray-700">
                <p><span className="font-semibold">Street:</span> {addr.street}</p>
                <p><span className="font-semibold">City:</span> {addr.city}</p>
                <p><span className="font-semibold">State:</span> {addr.state}</p>
                <p><span className="font-semibold">Pincode:</span> {addr.pincode}</p>
                <p><span className="font-semibold">Phone:</span> {addr.phone}</p>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => handleEdit(addr)}
                    className="bg-yellow-500 text-black px-3 py-1 rounded hover:bg-yellow-400"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(addr._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400">No addresses added</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
