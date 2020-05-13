const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

require('dotenv').config();
const express = require("express");
const app=express();
const bodyParser=require("body-parser");
const cookieParser=require("cookie-parser");
const cors = require("cors");


//my routes
const authRoutes=require("./routes/auth");
const userRoutes=require("./routes/user");
const categoryRoutes=require("./routes/category");
const productRoutes=require("./routes/product");
const orderRoutes=require("./routes/order");
const stripeRoutes=require("./routes/stripepayment");
const paymentsBRoute=require("./routes/paymentBRoutes");


mongoose.connect(process.env.DATABASE,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true,
}).then(()=> {
    console.log("DB CONNECTED");
}).catch(
    console.log("DB NOT CONNECTED")
)
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

app.use("/api", authRoutes);
app.use("/api",userRoutes);
app.use("/api",categoryRoutes);
app.use("/api",productRoutes);
app.use("/api",orderRoutes);
app.use("/api",stripeRoutes);
app.use("/api",paymentsBRoute);

const port =process.env.PORT || 5000;
console.log(port);

app.listen(port,()=> {
    console.log(`app is running at${port}`);
});
