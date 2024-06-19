import { VERIFICATION_EMAIL } from './variables';
import { generateTemplate } from '../mail/template'
import { MAILTRAP_USER, MAILTRAP_PASSWORD } from "#/utils/variables"
import EmailVerificationToken from '#/models/emailVerificationToken'
import nodemailer from 'nodemailer'
import path from 'path'

const generateMailTransporter = () => {
    // const result = nodemailer.createTransport({
    //   host: "sandbox.smtp.mailtrap.io",
    //   port: 2525,
    //   auth: {
    //     user: 'joelcatalan1996@gmail.com',
    //     pass: 'nwpb sirg vqhh tzta'
    //   }
    // });
    const result = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'joelcatalan1996@gmail.com',
        pass: 'nwpb sirg vqhh tzta'
      }
    })
    return result
}

interface Profile{
    name: string;
    email: string;
    userId: string;
}

export const sendVerificationMail = async (token: string, newUser: Profile) => {
    // generate token/otp
// const token = generateToken(6);
const {name, email, userId} = newUser
const transport = generateMailTransporter()

await EmailVerificationToken.create({
  owner: userId,
  token: token
})

const welcomeMessage = `Hi ${name} Welcome to this test app. Use this OTP to verify your email`
  
// make sure to change from attribute  
await transport.sendMail({
    to: email,
    from: VERIFICATION_EMAIL,
    subject: 'Welcome message',
    html: generateTemplate({
      title: 'Welcome to test app',
      message: welcomeMessage,
      logo: 'cid:logo',
      banner: 'cid:welcome',
      link: '#',
      btnTitle: token
    }),
    attachments: [
      {
        filename: 'logo.png',
        path: path.join(__dirname, '../mail/logo.png'),
        cid: 'logo'
      },
    ]
  })

  console.log('Sending mail')
}

