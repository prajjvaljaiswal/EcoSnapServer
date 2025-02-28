import express from "express"
import userRouter from "./routers/user.js"
import adminRouter from "./routers/admin.js"
import dbconnect from "./database/mongodb.js"
import workerRouter from "./routers/worker.js"
import reportRouter from "./routers/report.js"
import eventRouter from "./routers/event.js"
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
app.use("/event", eventRouter)