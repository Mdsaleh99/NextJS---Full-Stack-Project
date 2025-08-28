import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
    content: string;
    createdAt: Date;
}

const messageSchema: Schema<Message> = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

export interface User extends Document {
    username: string;
    email: string;
    password: string
    verifyCode: string
    verifyCodeExpiry: Date
    isVerified: boolean
    isAcceptingMessage: boolean
    messages: Message[]
}

const userSchema: Schema<User> = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "User name is required"],
        trim: true,
        unique: true,
    },
    email: {
        type: String,
        required: [true, "email is required"],
        trim: true,
        unique: true,
        match: [/.+\@.+\..+/, "Please use a valid email address"],
    },
    password: {
        type: String,
        required: [true, "password is required"],
    },
    verifyCode: {
        type: String,
        required: [true, "verifyCode is required"],
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "verify Code expiry is required"],
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true
    },
    messages: [messageSchema]
});

// * backend always run continuously but in nextjs it is completely different
// * nextjs is edge time framework
// * nextjs me saari cheezein all time pe run nhi hoti hai, jaise jaise demand create hoti hai waise waise cheezein run hoti hai
// in nextjs the lot of things are work on edge time, so nextjs did'nt know the is it first time application is running or not
// but in express js when we run the application it runs once and then it will not run again until we restart the server
// so in nextjs we have to check if the model is already exist or not before creatinging the model


const UserModel = mongoose.models.User || mongoose.model<User>("User", userSchema);

export default UserModel;