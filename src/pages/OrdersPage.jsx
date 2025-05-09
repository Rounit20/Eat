import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  orderBy,
  where,
  onSnapshot,
} from "firebase/firestore";
// import "./OrdersPage.css"; // optional custom styling

const statusColors = {
  "New Order": "bg-yellow-100 text-yellow-800",
  "Accepted by Restaurant": "bg-teal-100 text-teal-800",
  "Prepared": "bg-orange-100 text-orange-800",
  "Rejected by Store": "bg-red-100 text-red-800",
  "Delivered": "bg-green-100 text-green-800",
};

const OrdersPage = ({ storeId }) => {  // Assuming `storeId` is passed as a prop
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    // Use onSnapshot to listen for real-time updates
    const q = query(
      collection(db, "orders"),
      where("store", "==", storeId),  // Filter by store
      orderBy("timestamp", "desc")
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(data);
    });

    return () => unsubscribe(); // Clean up listener on unmount
  }, [storeId]);  // Rerun when storeId changes

  const updateStatus = async (orderId, newStatus) => {
    await updateDoc(doc(db, "orders", orderId), { status: newStatus });
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    setSelectedOrder(null);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Orders</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-xl overflow-hidden">
          <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
            <tr>
              <th className="p-4">Order ID</th>
              <th>Store</th>
              <th>Method</th>
              <th>Time Slot</th>
              <th>Created</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className="cursor-pointer hover:bg-gray-50"
              >
                <td className="p-4 font-mono text-green-600">{order.orderId}</td>
                <td>{order.store}</td>
                <td>{order.method}</td>
                <td>{order.timeSlot}</td>
                <td>
                  Date: {new Date(order.timestamp?.seconds * 1000).toLocaleDateString()}<br />
                  Time: {new Date(order.timestamp?.seconds * 1000).toLocaleTimeString()}
                </td>
                <td>
                  <span className={`px-2 py-1 rounded text-sm font-medium ${statusColors[order.status] || "bg-gray-200 text-gray-800"}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[500px] shadow-xl">
            <h2 className="text-xl font-bold mb-2">Order: {selectedOrder.orderId}</h2>
            <p><strong>Name:</strong> {selectedOrder.name}</p>
            <p><strong>Email:</strong> {selectedOrder.email}</p>
            <p><strong>Mobile:</strong> {selectedOrder.mobile}</p>
            <p><strong>Roll No:</strong> {selectedOrder.rollNo}</p>
            <p><strong>Hostel No:</strong> {selectedOrder.hostelNo}</p>
            <p><strong>Address:</strong> {selectedOrder.address}</p>
            <p className="mt-2"><strong>Items:</strong></p>
            <ul className="list-disc pl-6">
              {selectedOrder.items.map((item, idx) => (
                <li key={idx}>{item.name} × {item.qty}</li>
              ))}
            </ul>
            <div className="mt-4">
              <label className="block mb-1 font-medium">Update Status:</label>
              <select
                value={selectedOrder.status}
                onChange={(e) => updateStatus(selectedOrder.id, e.target.value)}
                className="border px-3 py-2 rounded w-full"
              >
                <option>New Order</option>
                <option>Accepted by Restaurant</option>
                <option>Prepared</option>
                <option>Delivered</option>
                <option>Rejected by Store</option>
              </select>
            </div>
            <div className="mt-4 flex justify-end">
              <button onClick={() => setSelectedOrder(null)} className="text-blue-600 font-medium">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
