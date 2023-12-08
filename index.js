const express=require("express");
require("dotenv").config()
const db=require("./models/index")
const pollRouter=require("./router/pollRouter")
const userRouter=require("./router/userRouter")
const app=express();
app.use(express.json())
 
app.use("/api",pollRouter)
app.use("/userApi",userRouter)

db.sequelize.sync().then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`Server is running at ${process.env.PORT}`)
    }); 
});
