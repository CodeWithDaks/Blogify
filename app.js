require("dotenv").config();

const path = require("path");
const express = require('express');
const mongoose =require("mongoose");
const cookieParser =require("cookie-parser");

const Blog=require("./models/blog");


const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");

const { checkForAuthenticationCookie } = require("./middlewares/authentication");

const app = express();
const PORT = process.env.PORT || 8000;


//-->MongoDb Connection:-

// mongoose.connect("mongodb://localhost:27017/bloging")
mongoose.connect(process.env.MONGO_URL)
.then((e)=>{
    console.log("Mongodb Connected");
});


app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));



app.use(express.urlencoded({extended:false}));//Always use this Middleware when work with form data

app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));

//-->Public folder ma jo data ha usa ham staticly use kar skta ha By help of this:-
app.use(express.static(path.resolve("./public")));


app.get("/", async (req, res) => {
  const allBlogs =await Blog.find({}); 
    res.render("home",{
        user:req.user,
        blogs: allBlogs,
    })
});

app.use("/user", userRoute);
app.use("/blog",blogRoute);


app.listen(PORT, () => {
    console.log(`Server Started at PORT:${PORT}`);
});
