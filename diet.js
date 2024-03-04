// Adjust the schema to include new fields
const mongoose = require('mongoose');
const express = require("express");
const path = require("path");
const bcrypt = require('bcrypt');
const collection = require("./config");

const app = express();
// Convert data into JSON format
app.use(express.json());
// Static file
app.use(express.static("public"));

app.use(express.urlencoded({ extended: false }));
// Use EJS as the view engine
app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    // Render the signup form for dieticians
    res.render("dietician");
});

// Define route handler for GET request to /signup
app.get("/dietician", (req, res) => {
    // Render the signup form for dieticians
    res.render("dietician");
});

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/Login")
    .then(() => {
        console.log("Database Connected Successfully");
    })
    .catch((err) => {
        console.log("Database cannot be Connected", err);
    });

const Loginschema = new mongoose.Schema({
    dieticianName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phno: {
        type: String,
        required: true
    },
    expertise: {
        type: String,
        required: true
    }
});

const Dietician = mongoose.model("Dietician", Loginschema);

// Handle form submission in the signup route
app.post("/dietician", async (req, res) => {
    const data = {
        dieticianName: req.body.dieticianName,
        password: req.body.password,
        email: req.body.email,
        phno: req.body.phno,
        expertise: req.body.expertise
    }

    try {
        // Check if the dietician already exists in the database
        const existingDietician = await Dietician.findOne({ dieticianName: data.dieticianName });

        if (existingDietician) {
            res.send('Dietician already exists. Please choose a different name.');
        } else {
            // Hash the password using bcrypt
            const saltRounds = 10; // Number of salt rounds for bcrypt
            const hashedPassword = await bcrypt.hash(data.password, saltRounds);

            data.password = hashedPassword; // Replace the original password with the hashed one

            // Insert the dietician data into the database
            const newDietician = new Dietician(data);
            await newDietician.save();
            console.log("Dietician added:", newDietician);
            res.send('Dietician added successfully.');
        }
    } catch (error) {
        console.error("Error adding dietician:", error);
        res.status(500).send('Internal Server Error');
    }
});

// Define Port for Application
const port = 1500;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
