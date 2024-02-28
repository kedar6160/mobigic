require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
app.use("/files", express.static("files"));

mongoose
.connect(process.env.MONGODB_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
const db = mongoose.connection;

const schema = new mongoose.Schema({
  username: String,
  password: String,
  files: [
    {
      filename: String,
      uniqueCode: String,
    },
  ],
});

schema.methods.removeFile = function (filename) {
  this.files = this.files.filter((file) => file.filename !== filename);
};

const User = mongoose.model("User", schema);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const user = new User({ username, password });
  await user.save();
  res.status(201).send("User registered successfully");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).send("Invalid username");
  if (password !== user.password) return res.status(400).send("Invalid password");
  res.send(user.files);
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + "/uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueCode = uuidv4().substring(0, 6);
    cb(null, `${uniqueCode}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

app.post("/upload", upload.single("file"), async (req, res) => {
  const { username } = req.body;
  const { filename } = req.file;
  const uniqueCode = filename.split("-")[0];
  let user = await User.findOne({ username });
  if (!user) return res.status(400).send("User not found");
  user.files.push({ filename, uniqueCode });
  await user.save();
  res.status(201).send( uniqueCode);
});

app.get("/files/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.status(200).send(user.files);
  } catch (error) {
    console.error("Error retrieving files:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/files/:filename", async (req, res) => {
  const { username } = req.body;
  const { filename } = req.params;
  try {
    let user = await User.findOne({ username });
    if (!user) {
      return res.status(404).send("User not found");
    }
    user.removeFile(filename);
    await user.save();
    res.status(200).send("File removed successfully");
  } catch (error) {
    console.error("Error removing file:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/download/:filename/:code", async (req, res) => {
  const { filename, code } = req.params;
  try {
    const user = await User.findOne({ "files.filename": filename });
    if (!user) {
      return res.status(404).send("File not found");
    }
    const file = user.files.find((file) => file.filename === filename);
    if (!file) {
      return res.status(404).send("File not found");
    }
    if (file.uniqueCode !== code) {
      return res.status(400).send("Wrong unique code");
    }
    const filePath = __dirname + "/uploads/" + file.filename;
    res.download(filePath, file.filename);
  } catch (error) {
    console.error("Error downloading file:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/", async (req, res) => {
  res.send("Success!");
});

const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => {
  console.log(`Server Started on port ${PORT}`);
});
