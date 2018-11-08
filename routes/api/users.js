const express=require('express');
const router=express.Router();

//@Route  GET api/users/test
//@test   test users Route 
//@access public
router.get('/test',(req,res)=>res.json({msg:'User Works!'}));

module.exports=router;