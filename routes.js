const express=require('express');
const zod=require('zod');
const jwt=require('jsonwebtoken')
const jwtpass=require('./jwtPassword')
const {todos,todoUsers}=require('./db')
const router=express.Router();
const auth=require('./auth')
const app=express();
app.use(express.json())

const userSchema=zod.object({
    username:zod.string().min(2,"Username is required"),
    email:zod.string().email(),
    password:zod.string().min(4,"Password must have four charecters long")
})

const todoSchema=zod.object({
    title:zod.string().min(2,"Title is required"),
    description:zod.string().optional(),
    email:zod.string().email(),
    status:zod.boolean().default(false).optional()

})

const updateSchema=zod.object({
    _id:zod.string(),
    title:zod.string().min(2).optional(),
    description:zod.string().optional(),
    status:zod.boolean().default(false).optional()
})

router.post('/signup',async (req,res)=>{
    const newUser=userSchema.safeParse(req.body);
    console.log('Signup port hit')
    
    if(newUser.success){
        const exists=await todoUsers.findOne({email:newUser.data.email})
        if(exists){
            res.status(401).json({msg:'User already exists'})
            return
        }
        const response=await todoUsers.create(newUser.data);
       
        res.status(201).json('User signedup succesfully')
    }
    else{
        res.status(400).json({msg:'Signup failed'})
    }
})

router.post('/signin',async (req,res)=>{
    const user=userSchema.safeParse(req.body)
    if(!user.success){
        res.status(401).json({msg:'Inavlid input'})
        return
    }
    const response=await todoUsers.findOne({email:user.data.email})
    if(response && response.password===user.data.password){
        const token=jwt.sign({email:user.data.email},jwtpass);
        res.status(200).json({token:token});
        return
    }
    res.status(401).json({msg:'Invalid username or password'})

})
router.post('/createTodo',auth,async (req,res)=>{
    const todo = todoSchema.safeParse(req.body);
    if(todo.success){
        const response=await todos.create(todo.data)
        res.status(200).json({msg:'Todo added successfully'})
        return
    }
    res.status(500).json({msg:'Todo cannot be created'})
})
router.get('/',auth,async (req,res)=>{
    
    const Todos=await todos.find({email:req.body.email})
    res.status(200).json({Todo:Todos});
})
router.put('/updateTodo', auth, async (req, res) => {
    const update = updateSchema.safeParse(req.body);

    if (!update.success) {
        return res.status(400).json({ msg: "Invalid input" });
    }
    const todoexist = await todos.findOne({ _id: update.data._id });
    if (!todoexist) {
        return res.status(404).json({ msg: "Todo does not exist" });
    }
    const updateResult = await todos.updateOne(
        { _id: todoexist._id },
        { $set: update.data }
    );
    res.status(200).json({msg:"Todo updated successfully"})

    
});

app.use('/',router)
app.listen(3000)
//module.exports=router