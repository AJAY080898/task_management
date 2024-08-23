const dotenv = require('dotenv')

dotenv.config()
  

module.exports = {
    port: process.env.PORT,
    DBuri: process.env.DB_URI,
    secretkey: process.env.SECRET_KEY,
    jwtExpiresForAcessToken: "3d",
    jwtExpiresForRefreshToken: "5d"
} 