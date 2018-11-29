ApiKey = process.env.API_KEY;
module.exports = {
  mongoURI: 'mongodb://expressApp:'+ ApiKey+ '@95.216.119.91' +
    ':31000/kdk-shop?authSource=admin',
  secretOrKey: 'dieDUQvA5S9qReKIj0TSlpNbrnfYSePF'
}
