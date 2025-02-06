require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(bodyParser.json());

// MongoDB Connection
const DB_URL = process.env.DB_URL;

if (!DB_URL) {
    console.error("Error: MONGO_URI is not defined in the environment variables.");
    process.exit(1);
}

mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Connected to database"))
.catch(err => {
    console.error("Error connecting to database:", err);
    process.exit(1);
});

// User Schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true }
});

const User = mongoose.model('User', userSchema);

// POST API Endpoint
app.post('/api/users', async (req, res) => {
    try {
        const { name, email, age } = req.body;
        
        // Validate input
        if (!name || !email || !age) {
            return res.status(400).json({ message: "Validation error: All fields are required." });
        }

        // Create and save user
        const newUser = new User({ name, email, age });
        await newUser.save();

        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.error("Error saving user:", error);
        res.status(500).json({ message: "Server error: Unable to create user." });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
