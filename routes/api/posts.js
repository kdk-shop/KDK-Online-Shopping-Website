const express=require('express');
const router=express.Router();

//@Route  GET api/posts/test
//@test   test posts Route 
//@access public
router.get('/test',(req,res)=>res.json({msg:'Post Works!'}));

module.exports=router;