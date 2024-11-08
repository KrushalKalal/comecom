import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import ConnectDB from "./config/db.js";
import cloudinaryConfig from "./helpers/cloudinary.js";
import authRoutes from "./routes/authRoute.js";
import categoryRoute from "./routes/categoryRoute.js";
import sizeRoute from "./routes/sizeRoute.js";
import colorRoute from "./routes/colorRoute.js";
import brandRoute from "./routes/brandRoute.js";
import addressRoute from "./routes/addressRoute.js";
import productRoute from "./routes/productRoute.js";
import wishListRoute from "./routes/wishListRoute.js";
import reviewRoute from "./routes/reviewRoute.js";
import cartRoute from "./routes/cartRoute.js";
import orderRoute from "./routes/orderRoute.js";
import cors from "cors";

//congigure env
dotenv.config(); // its in root if its in specific folder pass ({path:""}) inside config

//database config
ConnectDB();
cloudinaryConfig();

//res object
const app = express();
app.use(cors());

//middleware
app.use(express.json()); //replacement of body-parser
app.use(morgan("dev"));

//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/size", sizeRoute);
app.use("/api/v1/color", colorRoute);
app.use("/api/v1/brand", brandRoute);
app.use("/api/v1/address", addressRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/wishlist", wishListRoute);
app.use("/api/v1/review", reviewRoute);
app.use("/api/v1/cart", cartRoute);
app.use("/api/v1/order", orderRoute);
app.use("/uploads", express.static("uploads"));

//rest Api
app.get("/", (req, res) => {
  res.send({
    message: "Welcome to ecom App",
  });
});

//PORT
const PORT = process.env.PORT || 8080;

//run listen

app.listen(PORT, () => {
  console.log(`server running on ${PORT}`.bgCyan.white);
});
