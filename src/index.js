const express=require('express')
const mongoose=require('mongoose')
const route=require("./Route/route")
const app=express()

app.use(express.json())

mongoose.set('strictQuery', false)
mongoose.connect("mongodb+srv://alok10:alok10@cluster0.rntxqd0.mongodb.net/alok")
.then(()=>{console.log("MongoDb is connected")})
.catch(err=>console.log(err))

app.use("/",route)

app.listen(3000,()=>{
    console.log("Express is running on port 3000")
})