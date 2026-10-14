 const express = require("express");

const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();

// =============================
// User Routes
// =============================

router.post("/", protect, createOrder);

router.get(
  "/my-orders",
  protect,
  getMyOrders
);

// =============================
// Admin Routes
// =============================

router.get(
  "/admin/all",
  adminOnly,
  getAllOrders
);

router.patch(
  "/admin/:id/status",
  adminOnly,
  updateOrderStatus
);

// Single user order
router.get(
  "/:id",
  protect,
  getOrderById
);

module.exports = router;