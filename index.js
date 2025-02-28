const express = require("express")
const userRouter = require("./routers/user")
const adminRouter = require("./routers/admin")
const app = express()

app.use(express.json())

dbconnect()
    .then(()=>{
        app.listen(8000,()=>{
            console.log("Server Online")
    })
    })
    .catch((err)=>{
        console.log(err)
    })


app.get("/test",(req,res)=>{
    res.send("Hello world")
})

app.use("/user",userRouter)
app.use("/admin",adminRouter)