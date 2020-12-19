const https = require('https')
const lodash = require('lodash')
const demoProfiles = require(__dirname+'/demoData/profiles')
const projects = require(__dirname+'/demoData/projects')
const request = require('request');
const fs = require('fs');
const { add } = require('lodash');

function demoUser(token,callback){
  const User = demoProfiles.profiles.filter((user)=>user.personalData.userId == 2)
  const options = {
    url: 'https://internet.channeli.in/open_auth/get_user_data/',
    headers:{
      'Authorization' : `Bearer ${token}`
    }};

request.get(options, (err, resp, body) => {
    if (err) {
        return console.log("error",err);
    }
    console.log(`Status: ${resp.statusCode}`);
    console.log(`Bearer ${token}`)

    const data = [User,JSON.parse(body)]

    addUser(body)
    
    callback(data)
});
}
function demoProjects(callback){
  let rawData = fs.readFileSync(__dirname+'/demoData/projects.json')
  let projects = JSON.parse(rawData)
  callback(projects.projects)
}


function addUser(body){
  let rawData = fs.readFileSync(__dirname+'/data/users/users.json')
  let users = JSON.parse(rawData)
  let userExists = (users.users.filter((user)=>user.userId==JSON.parse(body).userId).length == 1)
  if(userExists){
    console.log("user already exists")
    console.log(JSON.parse(body))
  }else{
    console.log("user added")
    console.log(JSON.parse(body))
    var newUser = JSON.parse(body)
    newUser.applications = {applied:[],bookmarked:[]}
    users.users.push(newUser)
    fs.writeFileSync(__dirname+'/data/users/users.json',JSON.stringify(users))
  }
}


module.exports = {
  demoUser : demoUser,
  demoProjects : demoProjects
}
