const express=require('express');
const router=express.Router();
const gravatar=require('gravatar');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const keys=require('../../config/keys');
const passport=require('passport');

//load validation
const validationRegisterInput=require('../../validation/user/register')
const validationLoginInput=require('../../validation/user/login')
const validationProfileInput= require('../../validation/user/profile')

//load user model
const User=require('../../models/User');

//@Route  POST api/users/register
//@test   register user 
//@access public
router.post('/register',(req,res)=>{
    
    const {errors,isValid}=validationRegisterInput(req.body);
    //check validation
    if(!isValid){       
        return res.status(400).json(errors)
    }
    User.findOne({email:req.body.email})
        .then(user=>{
            if(user){    
                errors.email='Email already exists'           
                return res.status(400).json(errors)
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
                    password:req.body.password,
                    address: '',
                    phoneNumber: null
                });
                bcrypt.genSalt(10,(err,salt)=>{
                    bcrypt.hash(newUser.password,salt,(err,hash)=>{
                        if(err) throw err;
                        newUser.password=hash;
                        newUser.save()
                            .then(user=>res.json({user,redirect: '/login'}))
                            .catch(err=>console.log(err))
                    })
                })
            }
        })
})

//@Route  POST api/users/login
//@test   login user / returning jwt token
//@access public
router.post('/login',(req,res)=>{
    const {errors,isValid}=validationLoginInput(req.body);
    //check validation
    if(!isValid){
        return res.status(400).json(errors)
    }
    const email=req.body.email;
    const password=req.body.password;
    //Find user by email
    User.findOne({email})
        .then(user=>{
            //check for user
            if(!user) {
                errors.email='User not found'             
                return res.status(404).json(errors)
            }
            //check password
            bcrypt.compare(password,user.password)
                .then(isMatch=>{
                    if(isMatch) {
                       //user matched
                       //create jwt payload
                       const payload ={id: user.id , name: user.name , avatar: user.avatar}
                       //sign token
                        jwt.sign(payload,keys.secretOrKey , {expiresIn :'1d'},(err,token)=>{
                            res.json({
                                success:true,
                                token: token,
                                redirect: '/profile/'+user.name
                            })
                        });
                    }
                    else{ 
                        errors.password='Password incorrect'                       
                        return res.status(401).json(errors)
                    }
                })
        })

})

//@Route  GET api/users/profile/:u_id
//@test   get requested user profile
//@access public
router.get('/profile/:user_name',
  (req,res)=>{
    User.findOne({name:req.params.user_name},(err,user) => {
      if(err){console.log("err"); return res.status(400).json(err);}
      else{
        if(!user)
          return res.status(404).send("User not found!");
        else{
          res.json({
          name: user.name,
          email: user.email,
          address: user.address,
          tel: user.phoneNumber
          })
        }
      }
    }) 
  })
//@Route  GET api/users/profile
//@test   get current user profile
//@access private
router.get('/profile',
  passport.authenticate('jwt',{session:false}),
  (req,res)=>{
    User.findById(req.user.id,(err,user) => {
      if(err) return res.status(400).json(err)
      else{
        res.json({
          name: user.name,
          email: user.email,
          address: user.address,
          tel: user.phoneNumber
        })
      }
    }) 
  })
//@Route  POST api/users/profile
//@test   update current user profile
//@access private
router.post('/profile',
  passport.authenticate('jwt',{session:false}),
  (req,res)=>{
    const {errors,isValid}=validationProfileInput(req.body);
    if(!isValid){       
        return res.status(400).json(errors)
    }
    let newUser={
      name: req.body.name,
      email: req.body.email,
      address: req.body.address,
      phoneNumber: req.body.tel
    }
    User.update({_id:req.user.id},{$set:newUser},{},(err,doc) => {
      if(err) return res.status(400).json(err)
      return res.json({redirect:'/profile'});
    })
  })

//@Route  GET api/users/logout
//@test   logout current user
//@access private
router.get('/logout', function(req, res){
  req.logout();
  return res.json({redirect:'/'});
});

module.exports=router;
