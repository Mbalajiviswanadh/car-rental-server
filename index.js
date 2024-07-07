const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");

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

    const user = await userModel.create(req.body);
    res.json(user);
  } catch (err) {
    res.json(err);
  }
});

// Owner registration route
app.post("/register/owner", async (req, res) => {
  try {
    const existingOwner = await ownerModel.findOne({
      $or: [{ username: req.body.username }, { email: req.body.email }],
    });

    if (existingOwner) {
      return res
        .status(400)
        .json({
          error: "Owner with the same username or email already exists",
        });
    }

    const owner = await ownerModel.create(req.body);
    res.json(owner);
  } catch (err) {
    res.json(err);
  }
});

// Owner login route
app.post("/ownerloginSchema", async (req, res) => {
  try {
    // Check if a user with the given email exists
    const existingUser = await ownerModel.findOne({ email: req.body.email });

    if (!existingUser) {
      return res
        .status(400)
        .json({ error: "User not found. Please sign up first." });
    }

    // Check if the provided password matches the stored password
    if (existingUser.password !== req.body.password) {
      return res.status(401).json({ error: "Invalid password" });
    }
    const ownerLoginEntry = await ownerloginModel.create({
      email: existingUser.email,
      password: existingUser.password, // You might want to hash the password before storing it
    });

    // If the user exists and the password is correct, you can implement further actions
    // For example, you might generate and return a JWT token for authentication

    res.json({ message: "Login successful" });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Handle the POST request for car registration
app.post("/carsSchema", async (req, res) => {
  try {
    // Check if a user with the given email already exists
    const existingUser = await userModel.findOne({ email: req.body.email });

    if (!existingUser) {
      return res.status(400).json({ error: "Signup first" });
    }

    // If the user exists, create a new car entry
    const car = await carModel.create(req.body);
    res.json(car);
  } catch (err) {
    res.json(err);
  }
  // Perform any necessary operations with the data
});

// app.post('/register/user',UserRegister.adduser)
app.post("/add-cars", carsController.addcars);
app.get("/get-cars", carsController.getcars);
app.post("/edit-cars", carsController.editcar);
app.get("/get-car/:id", carsController.getcarsById);
app.get("/delete-cars", carsController.deletecars);
app.post("/delete-cars", carsController.deletecars);
app.use("/api/comments", commentRoutes);

//  app.post("/create-car", (req, res) => {
//   // Handle the POST request here
//   car.create(req.body)
//     .then(cars => res.json(cars))
//     .catch(err => res.json(err));
//   // Perform any necessary operations with the data
// });
// app.use("/router",router);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server started at port : ${PORT}`);
});
