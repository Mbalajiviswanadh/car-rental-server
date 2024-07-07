const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");

dotenv.config();

const userModel = require("./models/user");
const ownerModel = require("./models/owner");
const carModel = require("./models/wow");
const ownerloginModel = require("./models/ownerlogin");
const carsController = require("./controller/carsController");
const commentRoutes = require("./controller/commentsroutes");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

mongoose.set("strictQuery", true);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB is Connected.");
  })
  .catch((err) => {
    console.log("DB Err.", err);
  });

// User registration route
app.post("/register/user", async (req, res) => {
  try {
    const existingUser = await userModel.findOne({
      $or: [{ username: req.body.username }, { email: req.body.email }],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with the same username or email already exists" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await userModel.create({
      ...req.body,
      password: hashedPassword,
    });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Owner registration route
app.post("/register/owner", async (req, res) => {
  try {
    const existingOwner = await ownerModel.findOne({
      $or: [{ username: req.body.username }, { email: req.body.email }],
    });

    if (existingOwner) {
      return res.status(400).json({
        error: "Owner with the same username or email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const owner = await ownerModel.create({
      ...req.body,
      password: hashedPassword,
    });
    res.status(201).json(owner);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Owner login route
app.post("/ownerloginSchema", async (req, res) => {
  try {
    const existingUser = await ownerModel.findOne({ email: req.body.email });

    if (!existingUser) {
      return res
        .status(400)
        .json({ error: "User not found. Please sign up first." });
    }

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      existingUser.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const ownerLoginEntry = await ownerloginModel.create({
      email: existingUser.email,
      password: existingUser.password, // Consider storing the hashed password
    });

    res.status(200).json({ message: "Login successful" });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Handle the POST request for car registration
app.post("/carsSchema", async (req, res) => {
  try {
    const existingUser = await userModel.findOne({ email: req.body.email });

    if (!existingUser) {
      return res.status(400).json({ error: "Signup first" });
    }

    const car = await carModel.create(req.body);
    res.status(201).json(car);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/add-cars", carsController.addcars);
app.get("/get-cars", carsController.getcars);
app.post("/edit-cars", carsController.editcar);
app.get("/get-car/:id", carsController.getcarsById);
app.get("/delete-cars", carsController.deletecars);
app.post("/delete-cars", carsController.deletecars);
app.use("/api/comments", commentRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server started at port: ${PORT}`);
});
