const https = require('https')
const lodash = require('lodash')
const demoProfiles = require(__dirname+'/demoData/profiles')
const projects = require(__dirname+'/demoData/projects')
const request = require('request');
const fs = require('fs')

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

    let rawData = fs.readFileSync(__dirname+'/data/users/users.json')
    let users = JSON.parse(rawData)
    fs.writeFileSync(__dirname+'/data/users/users.json',users.users.append(JSON.parse(body)))

    rawData = fs.readFileSync(__dirname+'/data/users/users.json')
    console.log(JSON.parse(rawData))
    callback(data)
});

}

function demoProjects(callback){
  callback(projects.projects)
}

module.exports = {
  demoUser : demoUser,
  demoProjects : demoProjects
}
