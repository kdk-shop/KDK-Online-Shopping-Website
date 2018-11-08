const express=require('express');
const router=express.Router();

//@Route  GET api/profile/test
//@test   test profile Route 
//@access public
router.get('/test',(req,res)=>res.json({msg:'Profile Works!'}));

module.exports=router;