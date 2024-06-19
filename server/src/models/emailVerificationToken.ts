import { compare, hash } from "bcrypt";
import { ObjectId, Schema , model, Model} from "mongoose";

interface EmailVerificationTokenDocument{
    owner: ObjectId;
    token: string;
    createAt: Date;
}

interface Methods {
    compareTokens(token: string): Promise<boolean>
}

const emailVerificationTokenSchema = new Schema<EmailVerificationTokenDocument, {}, Methods>({
    owner: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    token: {
        type: String,
        required: true
    },
    createAt: {
        type: Date,
        expires: 3600, // 60 min * 60 secs = 1hr(3600s)
        default: Date.now()
    }
});

// hash the passwords before saving 
emailVerificationTokenSchema.pre('save', async function(next){
    // hash the token
    if(this.isModified('token')){
        this.token = await hash(this.token, 10)
    }
    next()
})

emailVerificationTokenSchema.methods.compareTokens = async function(token){
    const result = await compare(token, this.token)
    return result
}


export default model('EmailVerificationToken', emailVerificationTokenSchema) as Model<EmailVerificationTokenDocument, {}, Methods>