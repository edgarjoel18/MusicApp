import { sendVerificationMail } from './../utils/mail';
import { generateToken } from '#/utils/helper';
import { RequestHandler, Response } from "express"
import { CreateUser, VerifyEmailRequest } from "#/@types/user"
import User from "#/models/user"
import emailVerificationToken from '#/models/emailVerificationToken';

export const create: RequestHandler = async (req: CreateUser, res: Response) => {
    const {email, password, name} = req.body
    console.log('hererer')
    // const newUser =  new User({email, password, name})
    // newUser.save()
    // or 
    const newUser = await User.create({name, email, password})
    // send verification email
    const token = generateToken(6)
    sendVerificationMail(token, {name, email, userId: newUser._id.toString()})

    res.status(201).send({message: 'User created', user: {id: newUser._id, name, email}})
}

export const verifyEmail: RequestHandler = async (req: VerifyEmailRequest, res: Response) => {
    const {token, userId} = req.body
    
    const verificationToken = await emailVerificationToken.findOne({owner: userId})

    if(!verificationToken){
        return res.status(403).json({error: 'Invalid Token'})
    }

    const tokenMatched = await verificationToken.compareTokens(token)
    if(!tokenMatched){
        return res.status(403).json({error: 'Invalid Token'})
    }

    await User.findByIdAndUpdate(userId, {
        verified: true
    })
    await emailVerificationToken.findByIdAndDelete(verificationToken._id)

    res.send({message: 'Your email is verified'})
}



