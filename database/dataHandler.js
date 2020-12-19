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

    console.log("body",JSON.parse(body));
    console.log("branch",JSON.parse(body).student['branch degree name'])
    console.log("userId",JSON.parse(body).userId)
    const data = [User,JSON.parse(body)]

    addUser(body)
    
    callback(data)
});
}
function demoProjects(callback){
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
    users.users.push(JSON.parse(body))
    fs.writeFileSync(__dirname+'/data/users/users.json',JSON.stringify(users))
  }
}






module.exports = {
  demoUser : demoUser,
  demoProjects : demoProjects
}
