require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());

//Controllers
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const mongoDB = process.env.MONGO_URI;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routes
const authorRoute = require("./routes/authorRoute");
const messageRouter = require("./routes/messageRoute");
const userRouter = require("./routes/userRoute");
const groupRouter = require("./routes/groupRoute");
app.use("/auth", authorRoute);
app.use("/message", messageRouter);
app.use("/user", userRouter);
app.use("/group", groupRouter);
// Error handlers
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({ message: err.message, error: err });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
