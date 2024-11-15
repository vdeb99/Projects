//const { default: mongoose } = require("mongoose");

const express=require('express');
const mongoose=require('mongoose')
const zod=require('zod')
const app=express();
app.use(express.json());
mongoose.connect('mongodb+srv://admin:FWx2guKZZGyX0jjb@cluster0.mferd69.mongodb.net/')
const todoSchema=new mongoose.Schema({title:String,description:String,email:String,status:Boolean});
const userSchema=new mongoose.Schema({username:String,password:String,email:String})
const todos=mongoose.model('Todos',todoSchema);
const todoUsers=mongoose.model('todoUser',userSchema)

//todos.create({title:"Go to Gym",description:"From 5-7",status:false})
module.exports={todos,todoUsers}


