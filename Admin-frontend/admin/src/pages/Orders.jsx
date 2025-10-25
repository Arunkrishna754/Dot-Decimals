import { useEffect, useState, useRef } from "react";
import API from "../api/api";
import React from "react";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [soundEnabled, setSoundEnabled] = useState(
        localStorage.getItem("soundEnabled") === "true"
    );
    const [filterStatus, setFilterStatus] = useState("All"); // ✅ NEW
    const previousOrdersRef = useRef([]);
    const audioRef = useRef(null);

    const getAuthHeaders = () => {
        const token = localStorage.getItem("adminToken");
        if (!token) return null;
        return { headers: { Authorization: `Bearer ${token}` } };
    };

    // ✅ Function to play alarm for 5 seconds
    const playAlarm = () => {
        if (!soundEnabled || !audioRef.current) return;
        const audio = audioRef.current;
        let count = 0;

        const playOnce = () => {
            audio.currentTime = 0;
            audio
                .play()
                .then(() => console.log(`🔔 Alarm ring ${count + 1}`))
                .catch(() =>
                    console.log(
                        "🔇 Audio blocked. Please click 'Enable Sound 🔔' button first."
                    )
                );
            count++;
            if (count < 5) setTimeout(playOnce, 1000);
        };
        playOnce();
    };

    // ✅ Fetch Orders + Detect payment success
    const fetchOrders = async () => {
        const headers = getAuthHeaders();
        if (!headers) {
            console.error("Missing auth token");
            setLoading(false);
            return;
        }

        try {
            const res = await API.get("/orders/all", headers);
            const sortedOrders = res.data.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );

            // ✅ Detect newly paid
            if (previousOrdersRef.current.length > 0) {
                const prevMap = new Map(
                    previousOrdersRef.current.map((o) => [o._id, o.paid])
                );
                const newlyPaidOrders = sortedOrders.filter(
                    (order) => order.paid && prevMap.get(order._id) === false
                );
                if (newlyPaidOrders.length > 0) playAlarm();
            }

            previousOrdersRef.current = sortedOrders;
            setOrders(sortedOrders);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Poll every 10 seconds
    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 10000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        localStorage.setItem("soundEnabled", soundEnabled);
    }, [soundEnabled]);

    // ✅ Local update
    const handleStatusChange = (orderId, newStatus) => {
        setOrders((prev) =>
            prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
        );
    };

    // ✅ Save to backend
    const handleSaveStatus = async (orderId, newStatus) => {
        try {
            await API.patch(
                `/orders/update-status/${orderId}`,
                { status: newStatus },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
                }
            );
            console.log(`✅ Status updated for Order ${orderId}: ${newStatus}`);
        } catch (err) {
            console.error("❌ Error updating status:", err);
            alert("Error saving order status. Please try again.");
        }
    };

    // ✅ Apply filter logic
    const filteredOrders = orders.filter((order) => {
        if (filterStatus === "All") return true;
        if (filterStatus === "Pending") return !order.paid;
        return order.paid && order.status === filterStatus;
    });

    if (loading)
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-gray-600 text-lg">Loading orders...</p>
            </div>
        );

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <audio ref={audioRef} src="/sounds/bell-notification.mp3" preload="auto" />

            {/* Header with filter */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div className="flex gap-3">
                    {/* Enable Sound Button */}
                    <button
                        onClick={async () => {
                            if (!audioRef.current) return;
                            try {
                                await audioRef.current.play();
                                audioRef.current.pause();
                                audioRef.current.currentTime = 0;
                                setSoundEnabled(true);
                                alert(
                                    "🔓 Sound enabled! You’ll now hear a bell when payment succeeds."
                                );
                            } catch (err) {
                                console.warn("Audio unlock error:", err);
                                alert(
                                    "⚠️ Please click again or reload the page to enable sound."
                                );
                            }
                        }}
                        className={`px-4 py-2 rounded-lg font-medium shadow ${soundEnabled
                                ? "bg-green-500 text-white"
                                : "bg-blue-600 text-white hover:bg-blue-700"
                            }`}
                    >
                        {soundEnabled ? "✅ Sound Enabled" : "Enable Sound 🔔"}
                    </button>

                    {/* Test Sound Button */}
                    {soundEnabled && (
                        <button
                            onClick={() => {
                                if (!audioRef.current) return;
                                audioRef.current.currentTime = 0;
                                audioRef.current
                                    .play()
                                    .then(() => console.log("🔊 Test sound playing"))
                                    .catch((err) => console.error("Audio blocked:", err));
                            }}
                            className="px-4 py-2 rounded-lg font-medium bg-gray-200 hover:bg-gray-300 text-gray-800"
                        >
                            Test Sound 🔊
                        </button>
                    )}
                </div>

                {/* ✅ Filter Dropdown */}
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="border rounded-lg px-4 py-2 text-sm bg-white shadow-sm"
                >
                    <option value="All">All Orders</option>
                    <option value="Pending">Pending Payment</option>
                    <option value="Order Placed">Order Placed</option>
                    <option value="Packed">Packed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                </select>
            </div>

            {/* Orders List */}
            <div className="space-y-5">
                {filteredOrders.length === 0 ? (
                    <p className="text-gray-600 text-center mt-10">
                        No orders found for this status.
                    </p>
                ) : (
                    filteredOrders.map((order) => (
                        <div
                            key={order._id}
                            className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-5"
                        >
                            {/* Product Info */}
                            <div className="flex items-center gap-4 w-full sm:w-1/3 mb-4 sm:mb-0">
                                <img
                                    src={order.product?.image || "/no-image.png"}
                                    alt={order.product?.name || "Product"}
                                    className="w-24 h-24 object-contain rounded-lg border bg-gray-50"
                                />
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        {order.product?.name || "Unnamed Product"}
                                    </h3>
                                    <p className="text-gray-600 text-sm mt-1">
                                        ₹{order.product?.price?.toLocaleString("en-IN")}
                                    </p>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="flex-1 w-full sm:w-2/3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        <span className="font-semibold">Quantity:</span>{" "}
                                        {order.quantity}
                                    </p>
                                    <p className="text-sm text-gray-700">
                                        <span className="font-semibold">Total:</span> ₹
                                        {order.totalPrice?.toLocaleString("en-IN")}
                                    </p>
                                    <p className="text-sm text-gray-700">
                                        <span className="font-semibold">Customer:</span>{" "}
                                        {order.user?.name || "N/A"}
                                    </p>
                                </div>

                                {order.address && (
                                    <div className="bg-gray-50 rounded-lg p-3 ">
                                        <p className="font-semibold text-gray-800 text-sm mb-1">
                                            Delivery Address:
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {order.address.street}, {order.address.city},{" "}
                                            {order.address.state} - {order.address.pincode}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            📞 {order.address.phone}
                                        </p>
                                    </div>
                                )}

                                {/* Status + Save */}
                                <div className="flex flex-col sm:items-end justify-between">
                                    <div className="text-xs text-gray-500 mb-2">
                                        <p>
                                            Ordered on{" "}
                                            <span className="font-medium text-gray-700">
                                                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </span>
                                        </p>
                                        <p>
                                            ⏰{" "}
                                            {new Date(order.createdAt).toLocaleTimeString("en-IN", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    </div>

                                    <span
                                        className={`self-start sm:self-end px-3 py-1 rounded-full text-sm font-semibold ${order.paid
                                                ? "bg-green-100 text-green-800"
                                                : "bg-yellow-100 text-yellow-800"
                                            }`}
                                    >
                                        {order.paid ? "Paid" : "Pending"}
                                    </span>

                                    {order.paid && (
                                        <div className="flex flex-col gap-2 w-full sm:w-auto mt-2">
                                            <select
                                                value={order.status || "Order Placed"}
                                                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                className="px-3 py-1 border rounded-lg text-sm font-medium w-full sm:w-auto"
                                            >
                                                <option>Order Placed</option>
                                                <option>Packed</option>
                                                <option>Shipped</option>
                                                <option>Out for Delivery</option>
                                                <option>Delivered</option>
                                            </select>

                                            <button
                                                onClick={() => handleSaveStatus(order._id, order.status)}
                                                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition w-full sm:w-auto"
                                            >
                                                Save
                                            </button>
                                        </div>
                                    )}

                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Orders;
