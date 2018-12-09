let URI;

console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === "PRODUCTION") {
  URI = 'mongodb://expressApp:AvfwWKB5H3247yTAhPaA@localhost' +
    ':31000/kdk-shop?authSource=admin'
} else if (process.env.NODE_ENV === "TEST") {
  URI = "mongodb://mochaRunner:EgT3TXebM7VC7dFg@localhost:" +
    "31000/kdk-test?authSource=admin"
} else {
  URI = "mongodb://127.0.0.1:27017/kdk"
}
module.exports = {
  mongoURI: URI,
  secretOrKey: 'dieDUQvA5S9qReKIj0TSlpNbrnfYSePF'
}
