const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const StudentModel = require('./Models/Students.js');

const app = express(); // Define app before using it
app.use(express.json());
app.use(cors());

const mongoUri = 'mongodb+srv://mauricemundi:MauriceMundi@cluster0.jsrkzzp.mongodb.net/yourDatabaseName?retryWrites=true&w=majority';

mongoose.connect(mongoUri)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Register endpoint
app.post('/register', async (req, res) => {
    try {
        const { name, email, password, course } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new StudentModel({ name, email, password: hashedPassword, course });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Login endpoint
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await StudentModel.findOne({ email });
        if (!user) {
            console.log('No record existed for email:', email);
            return res.status(401).json("No record existed");
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Password mismatch for user:', email);
            return res.status(401).json("The password is incorrect");
        }
        res.status(200).json("Success");
    } catch (error) {
        console.error('Login error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

