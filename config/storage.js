const path = require('path');

let staticsPath;

if (process.env.NODE_ENV === "PRODUCTION") {
  staticsPath = "/opt/kdk-shop/static/"
} else {
  staticsPath = path.join(__dirname,'..',"static")
}

module.exports = {
  staticsPath
}
