const express = require('express');
const mongoose = require('mongoose');

const app = express();
mongoose.connect('mongodb://127.0.0.1:27017/crud')


const db  = mongoose.connection;
db.once('open',()=>{
    console.log('connected to database')
})
db.on('error',()=>{
    console.log('error')
})

const UserSchema = new mongoose.Schema({
    name: String,
    age: Number
})

const UserModel = mongoose.model("users", UserSchema);
app.use(express.json());
app.get("/getUsers", (req, res) => {
    UserModel.find({}).then(function(users) {
        res.json(users);
    }).catch(function(err) {
        console.log("error", err);
    });
});

app.post("/addUser", (req, res) => {
    const { name, age } = req.body;
    
    if (!name || !age) {
        return res.status(400).json({ error: "Name and age are required fields" });
    }

    const newUser = new UserModel({ name, age });

    newUser.save()
        .then((user) => {
            res.status(201).json(user);
        })
        .catch((err) => {
            console.log("Error:", err);
            res.status(500).json({ error: "Internal Server Error" });
        });
});


app.delete("/deleteUser/:id", (req, res) => {
    const userId = req.params.id;

    UserModel.findByIdAndRemove(userId)
        .then((user) => {
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            res.json({ message: "User deleted successfully", user });
        })
        .catch((err) => {
            console.log("Error:", err);
            res.status(500).json({ error: "Internal Server Error" });
        });
});

app.listen(3011, () => {
    console.log("Server is running ");
});
