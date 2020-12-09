const https = require('https')
const lodash = require('lodash')
const demoProfiles = require(__dirname+'/demoData/profiles')
const projects = require(__dirname+'/demoData/projects')

function demoUser(userId,callback){
  const User = demoProfiles.profiles.filter((user)=>user.personalData.userId == userId)

  callback(User)
}

function demoProjects(callback){
  callback(projects.projects)
}

module.exports = {
  demoUser : demoUser,
  demoProjects : demoProjects
}
