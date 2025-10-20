import { User } from "../models/userModel.js";

// Get all addresses
export const getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ addresses: user.addresses });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Add a new address
export const addAddress = async (req, res) => {
  try {
    const { street, city, state, pincode, phone } = req.body;

    // Validate Coimbatore pincode
    if (!/^641\d{3}$/.test(pincode)) {
      return res.status(400).json({ message: "Only Coimbatore pincodes allowed" });
    }

    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({ message: "Phone must be 10 digits" });
    }

    const user = await User.findById(req.user.userId);
    user.addresses.push({ street, city, state, pincode, phone });
    await user.save();

    res.json({ addresses: user.addresses });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update an address
export const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const { street, city, state, pincode, phone } = req.body;

    const user = await User.findById(req.user.userId);
    const address = user.addresses.id(id);
    if (!address) return res.status(404).json({ message: "Address not found" });

    address.street = street;
    address.city = city;
    address.state = state;
    address.pincode = pincode;
    address.phone = phone;

    await user.save();
    res.json({ addresses: user.addresses });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete an address
export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.addresses = user.addresses.filter(a => a._id.toString() !== id);
    await user.save();

    res.json({ addresses: user.addresses });
  } catch (err) {
    console.error("❌ Delete Address Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// profileController.js
// ✅ profileController.js
export const updateUser = async (req, res) => {
  try {
    const userId = req.user.userId; // ✅ changed from _id to userId
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    console.error("❌ Update user error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

