const express = require('express');
const router = express.Router();

const Cart = require('../../models/Cart');
router.post('/create/',(req,res)=>{
    const newCart = new Cart({
        userId : req.body.userId,
        items: req.body.items
    })
    newCart.save()
    .then((cart) => res.status(201).json(cart))
    .catch((err) => {
        return res.status(500).json({
            message: "Server could not save cart on database"
        })
    });
})
