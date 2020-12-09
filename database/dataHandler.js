const https = require('https')
const lodash = require('lodash')
const demoProfiles = require(__dirname+'/demoData/profiles')
const projects = require(__dirname+'/demoData/projects')
const request = require('request');

function demoUser(token,callback){
  var User = [demoProfiles.profiles.filter((user)=>user.personalData.userId == 2)]
  const options = {
    url: 'https://internet.channeli.in/open_auth/token/',
    headers:{
      'content-type': 'application/x-www-form-urlencoded',
      'cache-control': "no-cache",
    }};

request.get(options, (err, resp, body) => {
    if (err) {
        return console.log("error",err);
    }
    console.log(`Status: ${res.statusCode}`);
    console.log("body",JSON.parse(body));
    User.append(JSON.parse(body))
    callback(User)
});

}

function demoProjects(callback){
  callback(projects.projects)
}

module.exports = {
  demoUser : demoUser,
  demoProjects : demoProjects
}
