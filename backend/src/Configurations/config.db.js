const CONFIG = require('./config')
const mongoose = require('mongoose');

module.exports = ()=>{
    mongoose.connect(CONFIG.DBuri).then(()=>{
        console.log('DBConnectionEstablished.......')
    }).catch((err)=>{
        console.error('SomeThingFailed..',err)
    })
}