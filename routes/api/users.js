const express=require('express');
const router=express.Router();
const gravatar=require('gravatar');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const keys=require('../../config/keys');
const passport=require('passport');

//load validation
const validationRegisterInput=require('../../validation/register')
const validationLoginInput=require('../../validation/login')
const validationProfileInput= require('../../validation/profile')

//load user model
const User=require('../../models/User');

//@Route  GET api/users/test
//@test   test users Route 
//@access public
router.get('/test',(req,res)=>res.json({msg:'success'}));

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
                return res.status(400).json(errors.email='Email already exists')
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
                    address: "",
                    phoneNumber: null
                });

                bcrypt.genSalt(10,(err,salt)=>{
                    bcrypt.hash(newUser.password,salt,(err,hash)=>{
                        if(err) throw err;
                        newUser.password=hash;
                        newUser.save()
                            .then(user=>res.json({user,redirect: "/login"}))
                            .catch(err=>console.log(err))
                    })
                })
  
            }
        })
       console.log(req.body)
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
            if(!user) 
                return res.status(404).json(errors.email='User not found')

            //check password
            bcrypt.compare(password,user.password)
                .then(isMatch=>{
                    if(isMatch) {
                       //user matched
                       //create jwt payload
                       const payload ={id: user.id , name: user.name , avatar: user.avatar}
                       //sign token
                        jwt.sign(payload,keys.secretOrKey , {expiresIn :300},(err,token)=>{
                            res.json({
                                success:true,
                                token: token,
                                redirect: "/profile"
                            })
                        });
                    }
                    else{                        
                        return res.status(401).json(errors.password='Password incorrect')
                    }
                })
        })

})

//@Route  GET api/users/current
//@test   return current user 
//@access private
// router.get('/current',passport.authenticate('jwt',{session:false}),(req,res)=>{
//     return res.json({
//         id:req.user.id,
//         name:req.user.name,
//         email:req.user.email
//     })
// })
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
       // console.log(res.body);
      }
    }) 
  })
//@Route  POST api/users/profile
//@test   post current user profile
//@access private
router.post('/profile',
  passport.authenticate('jwt',{session:false}),
  (req,res)=>{
    const {errors,isValid}=validationProfileInput(req.body);
    
    if(!isValid){       
        return res.status(400).json(errors)
    }
    console.log(typeof req.body.tel)
    let newUser={
      name: req.body.name,
      email: req.body.email,
      address: req.body.address,
      phoneNumber: req.body.tel
    }
    //console.log(req.user.id)
    User.update({_id:req.user.id},{$set:newUser},{},(err,doc) => {
      
      if(err) return res.status(400).json(err)
      //console.log(doc)
      return res.json({redirect:'/profile'});
    })
    
  })

router.get('/logout', function(req, res){
  req.logout();
  return res.json({redirect:'/'});
});

module.exports=router;
