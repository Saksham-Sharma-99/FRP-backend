const nodemailer = require("nodemailer")
const fs = require("fs")
const Constant = require("../Constants")
const Constants = Constant.Constants
const transporter = nodemailer.createTransport(
    {
        service : Constants.SERVICE,
        auth :{
            user:Constants.EMAIL,
            pass: Constants.PASS
        }
    }
)

function sendMail(userId,postId){
    let rawUserData = fs.readFileSync('../database/data/users/users.json')
    let users = JSON.parse(rawUserData)
    let rawPostData = fs.readFileSync("../database/demoData/projects.json")
    let projects = JSON.parse(rawPostData)
    var mailOptions = {
        from: Constants.EMAIL,
        to: users.users.filter((user)=>user.userId == userId)[0].contactInformation.instituteWebmailAddress,
        subject: 'Updates on your application',
        text: `Your Application for semester exchange with ${projects.projects.filter((project)=>project.postId == postId)[0].data.name} was successful`
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}

module.exports = {
    sendMail : sendMail
}