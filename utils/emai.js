const nodemailer=require("nodemailer")
var Sib = require('sib-api-v3-sdk');

exports.sendMail=async(details)=>{
const client=Sib.ApiClient.instance

const apiKey=client.authentications['api-key']
apiKey.apiKey='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'

const tranEmailApi= new Sib.TransactionalEmailsApi

const sender={ 
    email:'saa081@student.bau.edu.lb'
}

const receivers=[
    {
        email:details.receiver
    }
]

tranEmailApi.sendTransacEmail({
    sender,
    to:receivers,
    subject:details.subject,
    textContent:details.content
}).then(console.log).catch(console.log)

}

// exports.sendMail=async(options)=>{
//     //1.create the transporter
//     const transporter=nodemailer.createTransport({
//         host:process.env.EMAIL_HOST,
//         secure: false, // use SSL
//         port:process.env.EMAIL_PASSWORD,
//         auth:{
//             user:process.env.EMAIL_USERNAME,
//             pass:process.env.EMAIL_PASSWORD,
//         },
//         tls: {
//             rejectUnauthorized: false 
//         },
//     })
//     //Define mail options
//     const mailOptions={
//         from:"sam <saa081@student.bau.edu.lb>",
//         to:options.email,
//         subject:options.subject,
//         text:options.message,
//     }

//     //send email

//     await transporter.sendMail(mailOptions)

    
// }