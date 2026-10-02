const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./config/db");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Frontend
app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// Test
app.get("/test", (req, res) => {
    res.send("CAREPLUS SERVER OK");
});

// Create appointments table automatically
const createTable = `
CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    department VARCHAR(100),
    appointment_date DATE,
    appointment_time TIME,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`;

db.query(createTable, (err) => {
    if (err) {
        console.log("TABLE ERROR:", err.message);
    } else {
        console.log("Appointments table is ready!");
    }
});

// SAVE APPOINTMENT
app.post("/api/appointments", (req, res) => {

    console.log("APPOINTMENT DATA:", req.body);

    const {
        patientName,
        phone,
        email,
        department,
        appointmentDate,
        appointmentTime,
        message
    } = req.body;

    const sql = `
        INSERT INTO appointments
        (patient_name, phone, email, department, appointment_date, appointment_time, message)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            patientName,
            phone,
            email,
            department,
            appointmentDate,
            appointmentTime,
            message
        ],
        (err, result) => {

            if (err) {
                console.log("DATABASE ERROR:", err.message);

                return res.status(500).json({
                    success: false,
                    message: "Appointment save nahi hua",
                    error: err.message
                });
            }

            console.log("APPOINTMENT SAVED:", result.insertId);

            res.json({
                success: true,
                message: "Appointment Booked Successfully",
                appointmentId: result.insertId
            });
        }
    );
});

// GET APPOINTMENTS
app.get("/api/appointments", (req, res) => {

    db.query(
        "SELECT * FROM appointments ORDER BY id DESC",
        (err, results) => {

            if (err) {
                console.log("GET DATABASE ERROR:", err.message);

                return res.status(500).json({
                    success: false,
                    message: "Appointments fetch nahi ho paaye",
                    error: err.message
                });
            }

            res.json({
                success: true,
                appointments: results
            });
        }
    );
});

// START SERVER
app.listen(PORT, "0.0.0.0", () => {
    console.log(`CarePlus Backend running on port ${PORT}`);
});