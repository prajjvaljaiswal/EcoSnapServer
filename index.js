const express = require("express")
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