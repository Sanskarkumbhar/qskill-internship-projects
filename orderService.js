const API_URL = "http://localhost:5000/api/orders";

export const createOrder = async (orderData) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please login before placing an order.");
  }

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to place order");
  }

  return data;
};

export const getMyOrders = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please login to view your orders.");
  }

  const response = await fetch(`${API_URL}/my-orders`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch orders");
  }

  return data;
};

export const getOrderById = async (id) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please login to view this order.");
  }

  const response = await fetch(`${API_URL}/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch order");
  }

  return data;
};