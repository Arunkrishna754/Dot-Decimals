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
    // 🧩 Step 1: Validate profile fields
    if (!user.name || !user.email) {
      return toast.error("Please fill name and email");
    }

    // 🧩 Step 2: Validate address fields
    if (!form.street.trim()) {
      return toast.error("Street field is required");
    }
    if (!form.pincode.trim()) {
      return toast.error("Pincode field is required");
    }
    if (!form.phone.trim()) {
      return toast.error("Phone number is required");
    }
    if (pinError) {
      return toast.error("Only Coimbatore pincodes allowed");
    }
    if (!/^\d{10}$/.test(form.phone)) {
      return toast.error("Enter a valid 10-digit phone number");
    }

    // ✅ If all validation passed
    setLoading(true);

    try {
      // 🧩 Step 3: Update user profile
      await API.put("/profile", user, headers);
      localStorage.setItem("userName", user.name);
      localStorage.setItem("userEmail", user.email);
      toast.success("Profile updated");

      // 🧩 Step 4: Add or update address
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
      toast.error(err.response?.data?.message || "Error saving profile or address");
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
        <h2 className="text-2xl font-semibold mb-6 text-[#FFD700]">Profile</h2>
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
          className="mt-4 bg-[#FFD700] hover:bg-green-500 text-black px-6 py-2 rounded-lg transition"
        >
          Save Profile
        </button>
      </div>

      {/* Address Form */}
      <div className="w-full max-w-4xl bg-gray-900 rounded-2xl shadow-lg p-8 mb-4">
        <h2 className="text-xl font-semibold mb-2 text-[#FFD700]">
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
          className="mt-4 bg-[#FFD700]  text-black px-6 py-2 rounded-lg transition"
        >
          {loading ? "Saving..." : editId ? "Update Address" : "Add Address"}
        </button>
      </div>

      {/* Address Table / Cards */}
      <div className="w-[97%] sm:w-[95%] lg:w-[92%] xl:w-[85%] mx-auto bg-gray-900 rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-800">
        <h2 className="text-2xl font-semibold mb-6 text-white text-center sm:text-left text-[#FFD700]">
          Saved Addresses
        </h2>

        {/* Desktop Table (≥1024px) */}
        <div className="hidden lg:block overflow-x-auto rounded-lg">
          <table className="w-full min-w-[950px] border border-gray-700 text-sm sm:text-base text-gray-200">
            <thead>
              <tr className="bg-gray-800 text-[#FFD700] font-semibold uppercase">
                <th className="border border-gray-700 px-4 py-3 text-left whitespace-nowrap">Street</th>
                <th className="border border-gray-700 px-4 py-3 text-left whitespace-nowrap">City</th>
                <th className="border border-gray-700 px-4 py-3 text-left whitespace-nowrap">State</th>
                <th className="border border-gray-700 px-4 py-3 text-left whitespace-nowrap">Pincode</th>
                <th className="border border-gray-700 px-4 py-3 text-left whitespace-nowrap">Phone</th>
                <th className="border border-gray-700 px-4 py-3 text-center whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {addresses.length > 0 ? (
                addresses.map((addr) => (
                  <tr key={addr._id} className="hover:bg-gray-800 transition-colors duration-200">
                    <td className="border border-gray-700 px-4 py-3 break-words">{addr.street}</td>
                    <td className="border border-gray-700 px-4 py-3 break-words">{addr.city}</td>
                    <td className="border border-gray-700 px-4 py-3 break-words">{addr.state}</td>
                    <td className="border border-gray-700 px-4 py-3 break-words">{addr.pincode}</td>
                    <td className="border border-gray-700 px-4 py-3 break-words">{addr.phone}</td>
                    <td className="border border-gray-700 px-4 py-3 text-center">
                      {/* Keep buttons in single line */}
                      <div className="flex justify-center items-center gap-3 flex-nowrap">
                        <button
                          onClick={() => handleEdit(addr)}
                          className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-1.5 rounded text-sm font-medium transition whitespace-nowrap"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(addr._id)}
                          className="bg-red-600 hover:bg-red-500 text-white px-4 py-1.5 rounded text-sm font-medium transition whitespace-nowrap"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-400">
                    No addresses added
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile / Tablet Cards (≤1023px) */}
        <div className="lg:hidden flex flex-col gap-4 mt-4">
          {addresses.length > 0 ? (
            addresses.map((addr) => (
              <div
                key={addr._id}
                className="bg-gray-800 rounded-xl p-5 shadow border border-gray-700 text-gray-200 transition hover:border-gray-500"
              >
                <div className="space-y-2 text-sm sm:text-base">
                  <p><span className="font-semibold text-gray-300">Street:</span> {addr.street}</p>
                  <p><span className="font-semibold text-gray-300">City:</span> {addr.city}</p>
                  <p><span className="font-semibold text-gray-300">State:</span> {addr.state}</p>
                  <p><span className="font-semibold text-gray-300">Pincode:</span> {addr.pincode}</p>
                  <p><span className="font-semibold text-gray-300">Phone:</span> {addr.phone}</p>
                </div>

                <div className="mt-3 flex justify-end gap-3">
                  <button
                    onClick={() => handleEdit(addr)}
                    className="bg-yellow-500 text-black px-4 py-1.5 rounded text-sm font-medium hover:bg-yellow-400 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(addr._id)}
                    className="bg-red-600 text-white px-4 py-1.5 rounded text-sm font-medium hover:bg-red-500 transition"
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
