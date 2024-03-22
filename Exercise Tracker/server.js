const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

mongoose.connect(process.env["MONGO_URL"], {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  log: [
    {
      date: String,
      duration: Number,
      description: String,
    },
  ],
  count: Number,
});

const User = mongoose.model("User", userSchema);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/mongoose", (req, res) => {
  res.json({ connectionState: mongoose.connection.readyState });
});

app
  .route("/api/users")
  .post((req, res) => {
    const username = req.body.username;
    const user = new User({ username, count: 0 });
    user.save((err, data) => {
      if (err) return res.json({ error: err });
      return res.json(data);
    });
  })
  .get((req, res) => {
    User.find((err, data) => {
      if (err) return res.json({ error: err });
      return res.json(data);
    });
  });

app.post("/api/users/:_id/exercises", async (req, res) => {
  const id = req.params._id;
  console.log(id);
  const { description, duration, date } = req.body;
  console.log(description, duration, date);

  const user = await User.findById(id);
  console.log(user);
  if (!user) return res.json({ error: "User not found" });
  const exercise = {
    date: date ? new Date(date).toDateString() : new Date().toDateString(),
    duration: parseInt(duration),
    description,
  };

  await User.findByIdAndUpdate(
    id,
    {
      $push: { log: exercise },
      $inc: { count: 1 },
    },
    { new: true },
    (err, user) => {
      if (user) {
        const updatedExercise = {
          _id: id,
          username: user.username,
          ...exercise,
        };
        res.json(updatedExercise);
      }
    }
  );
});

app.get("/api/users/:_id/logs", (req, res) => {
  const { from, to, limit } = req.query;

  User.findById(req.params._id, (err, user) => {
    if (err) return res.status(500).json({ error: "Internal server error" });

    if (!user) return res.status(404).json({ error: "User not found" });

    let filteredLogs = user.log;

    if (from && to) {
      filteredLogs = filteredLogs.filter((log) => {
        const logDate = new Date(log.date);
        return logDate >= new Date(from) && logDate <= new Date(to);
      });
    } else if (from) {
      filteredLogs = filteredLogs.filter(
        (log) => new Date(log.date) >= new Date(from)
      );
    } else if (to) {
      filteredLogs = filteredLogs.filter(
        (log) => new Date(log.date) <= new Date(to)
      );
    }

    if (limit) filteredLogs = filteredLogs.slice(0, parseInt(limit, 10));

    user.log = filteredLogs;
    res.json(user);
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
