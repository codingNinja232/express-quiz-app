const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Read questions from the JSON file
const questions = JSON.parse(fs.readFileSync("questions.json", "utf8"));

// Endpoint to get a random question
app.get("/api/question", (req, res) => {
  const randomIndex = Math.floor(Math.random() * questions.length);
  const { question, options } = questions[randomIndex];
  res.json({
    question,
    options,
    id: randomIndex // Send the index to identify the question for answer validation
  });
});

// Endpoint to submit an answer
app.post("/api/answer", (req, res) => {
  const { id, answer } = req.body;

  // Validate the question ID and answer
  if (id === undefined || id < 0 || id >= questions.length) {
    return res.status(400).json({ result: null, error: "Invalid question ID" });
  }
  if (answer === undefined || answer < 0 || answer >= questions[id].options.length) {
    return res.status(400).json({ result: null, error: "Invalid answer" });
  }

  // Check if the answer is correct
  const isCorrect = answer === questions[id].correct;
  const score = isCorrect ? 1 : -0.25;

  res.json({ result: score, correct: isCorrect });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
