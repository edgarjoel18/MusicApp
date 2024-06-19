import { ObjectId, Schema , model, Model} from "mongoose";
import { compare, hash } from "bcrypt";

interface UserDocument{
    name: string;
    email: string;
    password: string;
    verified: boolean;
    avatar?: {url: string; publicId: string};
    tokens: string[];
    favorites: ObjectId[];
    followers: ObjectId[];
    followings: ObjectId[];
}

interface Methods {
    comparePasswords(password: string): Promise<boolean>
}

const userSchema = new Schema<UserDocument, {}, Methods>({
    name: {
        type: String, 
        required: true,
        trim: true
    },
    email: {
        type: String, 
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String, 
        required: true,
    },
    avatar: {
        type: Object,
        url: String,
        publicId: String
    },
    verified: {
        type: Boolean,
        default: false
    },
    favorites: [{
        type: Schema.Types.ObjectId,
        ref: "Audio"
    }],
    followers: [{
        type: Schema.Types.ObjectId,
        ref: "Users"
    }],
    followings: [{
        type: Schema.Types.ObjectId,
        ref: "Users"
    }],
    tokens: [String]
}, {timestamps: true});

// hash the passwords before saving 
userSchema.pre('save', async function(next){
    // hash the token
    if(this.isModified('password')){
        this.password = await hash(this.password, 10)
    }
    next()
})

userSchema.methods.comparePasswords = async function(password){
    const result = await compare(password, this.password)
    return result
}



export default model('User', userSchema) as Model<UserDocument, {}, Methods>





