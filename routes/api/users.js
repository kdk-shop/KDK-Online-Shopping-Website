const express=require('express');
const router=express.Router();
const gravatar=require('gravatar');
const bcrypt=require('bcryptjs');

//load user model
const User=require('../../models/User');

//@Route  GET api/users/test
//@test   test users Route 
//@access public
router.get('/test',(req,res)=>res.json({msg:'User Works!'}));

//@Route  GET api/users/register
//@test   register user 
//@access public
router.post('/register',(req,res)=>{
    User.findOne({email:req.body.email})
        .then(user=>{
            if(user){
                return res.status(400).json({email: 'Email already exists'})
            }
    
            else{

                const avatar=gravatar.url(req.body.email,{
                    s:'200', //size
                    r:'pg', //Rating
                    d:'mm' //default
                });

                const newUser=new User({
                    name:req.body.name,
                    email:req.body.email,
                    avatar,
                    password:req.body.password 
                });

                bcrypt.genSalt(10,(err,salt)=>{
                    bcrypt.hash(newUser.password,salt,(err,hash)=>{
                        if(err) throw err;
                        newUser.password=hash;
                        newUser.save()
                            .then(user=>res.json(user))
                            .catch(err=>console.log(err))
                    })
                })
            }
        })
})
module.exports=router;