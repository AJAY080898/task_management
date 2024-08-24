const dotenv = require('dotenv')

dotenv.config()
  

module.exports = {
    port: process.env.PORT,
    DBuri: "mongodb://localhost:27017/TASK_MANAGEMENT",
    secretkey: process.env.SECRET_KEY,
    jwtExpiresForAcessToken: "3d",
    jwtExpiresForRefreshToken: "5d"
} 