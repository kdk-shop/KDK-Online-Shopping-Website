const express=require('express');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const passport=require('passport');

const users=require('./routes/api/users');
const cors=require('cors');
const app=express();

app.use(cors({
    methods:['GET','POST'],
    allowedHeaders: "Content-Type"
}));


//body parser middleware
app.use(bodyParser.urlencoded({extends:false}));
app.use(bodyParser.json());

//DB config
const db=require('./config/keys').mongoURI;

//connect to MongoDB
mongoose
    .connect(db)
    .then(()=>console.log('MongoDB Connected'))
    .catch((err)=>console.log(err));

app.get('/',(req,res)=>res.send('Hello world'))

//passport middleware
app.use(passport.initialize());
//passport config
require('./config/passport')(passport);

//Use Routes
app.use('/api/users', users);


const port =process.env.PORT || 4950;

app.listen(port,()=>console.log(`server running on port  ${port}`));