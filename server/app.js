const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const HttpError = require("./models/http-error");
const studentsRoutes = require("./routes/student-routes");
const mentorsRoutes = require("./routes/mentor-routes");

const app = express();
app.use(bodyParser.json());


app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
    next();
});


app.use("/api/student", studentsRoutes);
app.use("/api/mentor", mentorsRoutes);

app.use((req, res, next) => {
    throw new HttpError("Could not find this route.", 404);
});

app.use((error, req, res, next) => {

    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || "An unknown error occured!" });
});


mongoose.set("strictQuery", false);
mongoose
    .connect(
        `mongodb://127.0.0.1:27017/evaluationSample`
    )
    .then(() => {
        console.log("Connected");
        app.listen(process.env.PORT || 5000);
    })
    .catch((err) => {
        console.log("Error!", err);
    });