const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "careplus_hospital"
});

db.connect((err) => {
    if (err) {
        console.log("MySQL Connection Failed!");
        console.log(err.message);
        return;
    }

    console.log("MySQL Connected Successfully!");
});

module.exports = db;