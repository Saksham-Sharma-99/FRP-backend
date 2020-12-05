const https = require('https')
const lodash = require('lodash')
const demoProfiles = require('./demoData/profiles')

function demoUser(userId,callback){
   const User = demoProfiles.profiles.filter((user)=>user.personalData.userId == userId)

  callback(User)
}


module.exports = {
  demoUser : demoUser
}
