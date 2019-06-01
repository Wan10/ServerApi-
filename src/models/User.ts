import { Schema, model} from 'mongoose';
import { ObjectId } from 'bson';
import { createToken, verifyToken }  from '../lib/jwt';
import { hash, compare } from 'bcrypt';
import { SignUpUserResponse } from '../types/SignUpUserResponse';
const  randomString = require('random-string');
import { sendVerifyEmail } from '../lib/mailing';
const Nodegeocoder = require('node-geocoder');
import { Geocoder } from 'node-geocoder';
const options = {
    provider : 'google',
    httpApdapter: 'https',
    apiKey: 'AIzaSyAswxIUv4AoasmUxsZgbp8Wg9eIsqcqCCE',
    formatter: null
}
const geocoder = Nodegeocoder(options);


const UserSchema  = new Schema({
    idUser : ObjectId,
    userName: {type: String, required: [ true, 'User name is required if id id specifided'
    ], trim: true, minlength: 3},
    email: {type: String, required: true, trim: true, unique: true },
    birth: {type: Date, required: true},
    firstName: {type: String, maxlength: 20},
    lastName: {type: String, maxlength: 20},
    password: {type: String, required: true, minlength: 6, trim: true},
    tel: {type: String, required: true, trim: true, unique: true, minlength: 10},
    address: {type: String},
    lat: {type: Number, default: null},
    lng: {type: Number, default: null},
    role: {type: String, enum: ['admin', 'member']},
    isVerified: {type :Boolean, default: false},
    verifyCode: {type: String},
    aboutMe: {type: String}
});


const UserModel = model('User', UserSchema);

export class User extends UserModel {
    idUser : ObjectId;
    userName: string;
    email: string;
    birth: Date;
    firstName: string;
    lastName: string;
    password: string;
    tel: string;
    address: string;
    role: string;
    isVerified: boolean;
    verifyCode: string;
    restorePasswordCode: string;
    aboutMe: string;

    static async signUp(objUser): Promise<any>{
        if(objUser.password.length < 6) throw new Error('Password must be greater than 6 characters');

        const user = new User(objUser);
        await user.save();
        // if( process.env.isTesting !== 'true'){
        //     console.log('Send Mail');
        //     // sendVerifyEmail('1','2','3'); 
        // }
        const token = await createToken({objUser});
        return {token, objUser};
    }

    static async signIn(email: string, password: string): Promise<SignUpUserResponse>{
        const user = await User.findOne({ email }) as User;
        if(!user) throw new Error('Email does not exist');
        const same = await compare(password, user.password);
        const {idUser, userName, tel, address, role} = user;
        if(!same) throw new Error('Wrong password');
        const token = await createToken({ userName, email, tel, address, role });
        return {
            token,
            user: { idUser, userName, email, tel, address, role }
        }
    }

    static async adminSignIn(email: string, password: string): Promise<SignUpUserResponse>{
        const user = await User.findOne({ email }) as User;
        if(!user) throw new Error('Email does not exist');
        const same = await compare(password, user.password);
        const {idUser, userName, tel, address, role} = user;
        if(!same) throw new Error('Wrong password');
        const token = await createToken({ userName, email, tel, address, role });
        return {
            token,
            user: { idUser, userName, email, tel, address, role }
        }
    }

    static async verifyUser(idUser, verifyCode){
        const  user = await User.findById(idUser) as User;
        if(!user) throw new Error('User khong ton tai');
        if(verifyCode !== user.verifyCode) throw new Error('Code sai');

        return User.findByIdAndUpdate(idUser, {isVerified: true});
    }

    static async changeInfo(idUser, newUserName: string, newEmail: string, newTel: string, newAddress: string): Promise<User>{
        return await User.findByIdAndUpdate(idUser, {
            userName: newUserName,
            email: newEmail,
            tel: newTel,
            address: newAddress
        }) as User;
    }

    static async adminChangeInfo(obj): Promise<User>{
        return await User.findByIdAndUpdate(obj._id, {
            userName: obj.userName,
            email: obj.email,
            firstName: obj.firstName,
            lastName: obj.lastName,
            tel: obj.tel,
            birth: obj.birth,
            address: obj.address,
            aboutMe: obj.aboutMe

        }) as User;
    }

    static async changePassword(idUser: ObjectId, oldPassword: string, newPassword: string): Promise<User>{
        const user = await User.findById(idUser) as User;
        if(!user) throw new Error('Id user does not exist');
        const same = await compare(oldPassword, user.password);
        if(!same) throw new Error('Password was wrong');
        const encrypted = await hash(newPassword, 8);
        return await User.findByIdAndUpdate(idUser, {password: encrypted}) as User;
    }

    static async checkToken( token ){
        const obj = await verifyToken(token);
        return obj;
    }

    static async requestChangePassword(email){
        if(!process.env.isTesting){
            //send mail here
        }
        return User.findOneAndUpdate({email}, {restorePasswordCode: randomString()});
    }

    static async checkRestorePasswordCode(email, code){
        const user = await User.findOne(email) as User;
        if(!user) throw new Error('User is invalid');
        if(user.restorePasswordCode !== code) throw new Error('Invalid');
        return code;
    }

    static async changePasswordWhenForget(email, code, newPassword){
        const user = await User.findOne(email) as User;
        if(!user) throw new Error('Email is invalid');
        if(user.restorePasswordCode !== code) throw new Error('Invalid');
        const encrypted = await hash(newPassword, 8);
        return await User.findOneAndUpdate({email}, {password: encrypted})as User;
    }

    static async getLocationAddress(idUser:ObjectId, location: string){
        const user = await User.findById(idUser) as User;
        let lat: number, lng: number, address: string;
        await geocoder.geocode(location, (err, data) => {
            if(err || !data.length) throw new Error('Invalid address');
            lat = data[0].latitude;
            lng = data[0].longitude;
            address = data[0].formattedAddress;
            // console.log(data);
        });
       
        return await User.findByIdAndUpdate(idUser , {lat: lat, lng: lng, address: address}) as User;
    }

    static async getLatLng(location: string){
        let lat: number, lng: number;
        await geocoder.geocode(location, (err, data) => {
            if(err || !data.length) throw new Error('Invalid address');
            lat = data[0].latitude;
            lng = data[0].longitude;
        });

        return {lat,lng};
    }

    static async getAllUser(){
        return await User.find({});
    }

    static async delUser(idUser){
        return await User.findByIdAndDelete(idUser);
    }
}


/*
    * Create User (Sign Up & In)
    * Verify User
    * Change Info
    * Change Password
    * Restore Password when forgot
    * Get location (lat, lng) with address of User
*/