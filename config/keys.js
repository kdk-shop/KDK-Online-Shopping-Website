let URI;

if (process.env.NODE_ENV === "PRODUCTION") {
  URI = 'mongodb://expressApp:AvfwWKB5H3247yTAhPaA@localhost' +
    ':31000/kdk-shop?authSource=admin'
} else if (process.env.NODE_ENV === "TEST") {
  URI = "mongodb://mochaRunner:EgT3TXebM7VC7dFg@localhost:" +
    "31000/kdk-test?authSource=admin"
} else if (process.env.NODE_ENV === "DEV") {
  URI = "mongodb://expressApp:AvfwWKB5H3247yTAhPaA@kdkshop.ir:" +
    "31000/kdk-shop?authSource=admin"
} else if (process.env.NODE_ENV === "TRAVIS") {
  URI = "mongodb://localhost/kdk-test"
} else {
  URI = "mongodb://127.0.0.1:27017/kdk"
}
module.exports = {
  mongoURI: URI,
  secretOrKey: 'dieDUQvA5S9qReKIj0TSlpNbrnfYSePF'
}
