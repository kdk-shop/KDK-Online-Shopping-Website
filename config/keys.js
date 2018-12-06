let URI;
// if (process.env.NODE_ENV === "PRODUCTION"){
//    URI = 'mongodb://expressApp:AvfwWKB5H3247yTAhPaA@95.216.119.91' +
//      ':31000/kdk-shop?authSource=admin'
// }else{
   URI = "mongodb://127.0.0.1:27017/kdk"
// }
module.exports = {
   mongoURI: URI,
  secretOrKey: 'dieDUQvA5S9qReKIj0TSlpNbrnfYSePF'
}
