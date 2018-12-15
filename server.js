const app=require('./app');
const fs = require('fs');

const port =process.env.PORT || 4950;

//Setup statics folder for multer
if (!fs.existsSync('static')) {
    fs.mkdirSync('static');
    fs.mkdirSync('static/images');
    fs.mkdirSync('static/images/full');
}

app.listen(port,()=>console.log(`server running on port  ${port}`));

module.exports = app;
