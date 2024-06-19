import { CreateUser } from "#/@types/user";
import { RequestHandler, Response, NextFunction } from "express";
import * as yup from 'yup'

export const validate = (schema: any):RequestHandler => {
    return async (req: CreateUser, res: Response, next: NextFunction) => {
        if(!req.body){
            return res.status(422).json({error: 'Empty body!'})
        }
        const schemaToValidate = yup.object({body: schema})
        try{
            await schemaToValidate.validate({body: req.body})
            next()
        }
        catch(error){
            if(error instanceof yup.ValidationError){
                res.status(422).json({error: error.message})
            }
        }
    }

}





