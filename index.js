const express = require("express")
const userRouter = require("./routers/user")
const adminRouter = require("./routers/admin")
const dbconnect = require("./database/mongodb")
const workerRouter = require("./routers/worker")
const reportRouter = require("./routers/report")
const app = express()

app.use(express.json())

dbconnect()
    .then(()=>{
        app.listen(7000,()=>{
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
app.use("/worker",workerRouter)
app.use("/report",reportRouter)