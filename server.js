const express = require("express");
const connectDB = require("./config/db")
const colors = require("colors");
const dotenv = require("dotenv")
const morgan = require("morgan")
const authRoutes = require("./routes/authRoute")
const categoryRoutes = require("./routes/categoryRoutes")
const productRoute = require('./routes/productRoute')
const cors = require("cors")
const path = require("path");


dotenv.config();

connectDB();
const app = express();


//middleware
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))
app.use(express.static(path.join(__dirname, "./client/build")))


app.use("/api/v1/auth" , authRoutes);
app.use("/api/v1/category", categoryRoutes)
app.use("/api/v1/products", productRoute)

app.use("*", function(req,res) {
    res.sendFile(path.join(__dirname, "./client/build/index.html"))
})


app.get("/", (req, res)=>{
    res.send("this is the home page")
})

const PORT = process.env.PORT || 8080;

app.listen(PORT, ()=>{
    console.log(`server running on ${PORT}`.bgCyan.white)
})