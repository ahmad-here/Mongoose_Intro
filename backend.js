const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://127.0.0.1:5500",
}));

mongoose.connect("mongodb://127.0.0.1:27017/WebDevAssignment");

studentDB = mongoose.connection;
studentDB.once("open", () => {
  console.log("Connected to MongoDB");
});
studentDB.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

const studentSchema = new mongoose.Schema({
  regId: String,
  name: String,
  gender: String,
  department: String,
});

const studentModel = mongoose.model("studentModel", studentSchema);

//GET Request To Fetch All Students
app.get("/api/students", async (req, res) => {
  const students = await studentModel.find();
  if (!students) {
    return res.status(404).send("Not Found");
  }
  res.status(200).send(students);
});

//GET Request BY Student RegID
app.get("/api/students/findStudent/:id", async (req, res) => {
  const student = await studentModel.findOne({ _id: req.params.id });
  if (!student) {
    return res.status(404).send("Student Not Found In Database");
  }
  res.status(200).send(student);
});

//POST Request
app.post("/api/students/addStudent", (req, res) => {
  if (!req.body) {
    return res
      .status(400)
      .send("Bad Request: Request body is empty or undefined");
  }
  const student1 = new studentModel({
    regId: req.body.regId,
    name: req.body.name,
    gender: req.body.gender,
    department: req.body.department
  });
  student1
    .save()
    .then(() => {
      res.status(200).send("Successfully Added \n" + student1);
    })
    .catch((err) => {
      res.status(500).send("Error: " + err.message);
    });
});

// PUT Request
app.put("/api/students/updateStudent/:id", async (req, res) => {
  const studentId = req.params.id;

  if (!studentId) {
    return res.status(400).send("Bad Request: Student ID is required");
  }

  try {
    const updated = await studentModel.findOneAndUpdate(
      { _id: studentId },
      req.body, // Update all fields based on the request body
      { new: true } // Return the updated document
    );

    if (!updated) {
      res.status(404).send("Student not found");
    }

    res.status(200).send("Successfully Updated: " + updated);
  } catch (error) {
    res.status(500).send("Error: " + error.message);
  }
});


// DELETE Request Using Student ID
app.delete("/api/students/deleteStudent/:id", async (req, res) => {
  const studentId = req.params.id;

  if (!studentId) {
    return res.status(400).send("Bad Request: Student ID is required");
  }

  try {
    const deletedStudent = await studentModel.findByIdAndDelete(studentId);

    if (!deletedStudent) {
      return res.status(404).send("Student not found");
    }

    res.status(200).send("Successfully Deleted: " + deletedStudent);
  } catch (error) {
    res.status(500).send("Error: " + error.message);
  }
});


//DELETE Request For All Students
app.delete("/api/students/deleteAll", async (req, res) => {
  await studentModel.deleteMany();
  res.status(200).send("Successfully Deleted All Students");
});

app.listen(3000, () => {
  console.log("Listening At Port 3000");
});