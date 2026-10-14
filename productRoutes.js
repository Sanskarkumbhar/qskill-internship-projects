 const express = require("express");

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();

// Public APIs
router.get("/", getProducts);
router.get("/:id", getProductById);

// Admin-only APIs
router.post("/", adminOnly, createProduct);
router.put("/:id", adminOnly, updateProduct);
router.delete("/:id", adminOnly, deleteProduct);

module.exports = router;