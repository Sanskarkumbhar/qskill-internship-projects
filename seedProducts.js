const mongoose = require("mongoose");
require("dotenv").config();

const Product = require("./models/Product");

const products = [
  {
    name: "Classic Cotton T-Shirt",
    category: "Men",
    price: 799,
    rating: 4.5,
    badge: "NEW",
    description:
      "Comfortable premium cotton t-shirt suitable for everyday wear.",
    image: "",
    stock: 25,
  },
  {
    name: "Premium Casual Shirt",
    category: "Men",
    price: 1299,
    rating: 4.6,
    badge: "POPULAR",
    description:
      "Modern casual shirt designed with a clean and comfortable fit.",
    image: "",
    stock: 18,
  },
  {
    name: "Elegant Women's Dress",
    category: "Women",
    price: 1799,
    rating: 4.8,
    badge: "TRENDING",
    description:
      "Elegant and stylish dress perfect for casual and special occasions.",
    image: "",
    stock: 15,
  },
  {
    name: "Women's Casual Top",
    category: "Women",
    price: 999,
    rating: 4.4,
    badge: "NEW",
    description:
      "Comfortable casual top with a modern everyday style.",
    image: "",
    stock: 22,
  },
  {
    name: "Classic Leather Handbag",
    category: "Accessories",
    price: 2199,
    rating: 4.7,
    badge: "PREMIUM",
    description:
      "Stylish handbag with a premium look and practical storage.",
    image: "",
    stock: 10,
  },
  {
    name: "Minimalist Wrist Watch",
    category: "Accessories",
    price: 1499,
    rating: 4.5,
    badge: "POPULAR",
    description:
      "Minimalist wrist watch with a timeless design.",
    image: "",
    stock: 14,
  },
  {
    name: "Running Sneakers",
    category: "Footwear",
    price: 2499,
    rating: 4.8,
    badge: "BEST SELLER",
    description:
      "Lightweight sneakers designed for comfort and everyday movement.",
    image: "",
    stock: 20,
  },
  {
    name: "Classic Casual Shoes",
    category: "Footwear",
    price: 1999,
    rating: 4.6,
    badge: "NEW",
    description:
      "Versatile casual shoes suitable for everyday outfits.",
    image: "",
    stock: 16,
  },
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    await Product.deleteMany();

    await Product.insertMany(products);

    console.log(`${products.length} products added successfully`);

    await mongoose.connection.close();

    console.log("Database connection closed");
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

seedProducts();