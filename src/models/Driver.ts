import { Schema, model } from 'mongoose';
import { hash, compare } from 'bcrypt';
import { createToken, verifyToken } from '../lib/jwt';
import { ObjectId } from 'bson';
import { Moto } from '../models/Moto';
import { ObjDriver } from '../types/ObjDriver';
import randomString = require('random-string');
import { Geocoder } from 'node-geocoder';
import { GetAllDriverResponse } from '../types/GetAllDriverResponse';

const DriverSchema = new Schema({
    idUser : ObjectId,
    userName: {
        type: String, 
        required: [ true, 'User name is required if id id specifided'],
        trim: true,
        minlength: 3
    },
    birth: {type: Date, required: true},
    email: {type: String, required: true, trim: true, unique: true },
    firstName: {type: String, maxlength: 20},
    lastName: {type: String, maxlength: 20},
    password: {type: String, required: true, minlength: 6, trim: true},
    tel: {type: String, required: true, trim: true, unique: true, minlength: 10},
    address: {type: String},    
    idMoto: [{type: Schema.Types.ObjectId, ref: 'Moto'}],
    status: {type: String, trim: true, enum: ['online', 'offline']},
    aboutMe: {type: String}
});

const DriverModel = model('Driver', DriverSchema);

export class Driver extends DriverModel{
    userName: string;
    birth: Date;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    tel: string;
    address: string;
    role: string;
    isVerified: boolean;
    verifyCode: string;
    restorePasswordCode: string;
    idMoto: ObjectId;
    status: string;
    aboutMe: string;

    static async getAllDriver(){
        return await Driver.find({}).select("-password");
    }

    static async signUp(objD: ObjDriver): Promise<any>{
        if(objD.driver.password.length < 6) throw new Error('Password must be greater than 6 characters');
        // const idMoto = await Moto.createMotoInfo(objM);
        const driver = new Driver(objD.driver);
        await driver.save();
        if( process.env.isTesting !== 'true'){
            // console.log('Send Mail');
            // sendVerifyEmail('1','2','3');
        }
        const token = await createToken({objD});
        return { token,  objD };
    }

    static async signIn(email: string, password: string): Promise<any>{
        const driver = await Driver.findOne({email}) as Driver;
        if(!driver) throw new Error('Email is invalid');
        const same = compare(driver.password, password);
        if(!same) throw new Error('Password was wrong');
        const { userName, birth, tel, status, idMoto} = driver;
        const moto = await Moto.findById({idMoto}) as Moto;
        const { _id, image, numPlate, type, color } = moto;
        const token = createToken( {userName, birth, tel, status, _id: driver._id});
        return {
            token,
            driver: {
                userName, birth, tel, status
            },
            moto: { 
                idMoto: _id, image, numPlate, type, color
            }
        }
    } 

    static async verifyDriver(idDriver, verifyCode){
        const  driver = await Driver.findById(idDriver) as Driver;
        if(!driver) throw new Error('Driver is invalid');
        if(verifyCode !== driver.verifyCode) throw new Error('Code wrong');

        return Driver.findByIdAndUpdate(idDriver, {isVerified: true});
    }

    static async changeInfo(idDriver, objD): Promise<ObjectId>{
        const driver = await Driver.findById(idDriver);
        if( !driver ) throw new Error('Driver is invalid');
        await Driver.findByIdAndUpdate(idDriver, {
            userName: objD.driver.userName,
            birth: objD.driver.birth,
            email: objD.driver.email,
            tel: objD.driver.tel,
            address: objD.driver.address,
            idMoto: objD.driver.idMoto,
        }) as Driver;
        return driver._id;
    }

    static async adminChangeInfo(idDriver, objD): Promise<ObjectId>{
        const driver = await Driver.findById(idDriver);
        if( !driver ) throw new Error('Driver is invalid');
        await Driver.findByIdAndUpdate(idDriver, {
            userName: objD.driver.userName,
            birth: new Date(objD.driver.birth),
            email: objD.driver.email,
            firstName: objD.driver.firstName,
            lastName: objD.driver.lastName,
            tel: objD.driver.tel,
            address: objD.driver.address,
            aboutMe: objD.driver.aboutMe,
        }) as Driver;
        return driver._id;
    }

    static async changePassword(idDriver: ObjectId, oldPassword: string, newPassword: string): Promise<Driver>{
        const driver = await Driver.findById(idDriver) as Driver;
        if(!driver) throw new Error('Id user does not exist');
        const same = await compare(oldPassword, driver.password);
        if(!same) throw new Error('Password was wrong');
        const encrypted = await hash(newPassword, 8);
        return await Driver.findByIdAndUpdate(idDriver, {password: encrypted}) as Driver;
    }

    static async checkToken( token ){
        const obj = await verifyToken(token);
        return obj;
    }

    static async requestChangePassword(email){
        if(!process.env.isTesting){
            //send mail here
        }
        return Driver.findOneAndUpdate({email}, {restorePasswordCode: randomString()});
    }

    static async checkRestorePasswordCode({ email, code }: { email: string; code: string; }){
        const driver = await Driver.findOne(email) as Driver;
        if(!driver) throw new Error('User is invalid');
        if(driver.restorePasswordCode !== code) throw new Error('Invalid');
        return code;
    }

    static async changePasswordWhenForget({ email, code, newPassword }: { email: string; code: string; newPassword: string; }){
        const driver = await Driver.findOne(email) as Driver;
        if(!driver) throw new Error('Email is invalid');
        if(driver.restorePasswordCode !== code) throw new Error('Invalid');
        const encrypted = await hash(newPassword, 8);
        return await Driver.findOneAndUpdate({email}, {password: encrypted})as Driver;
    }

    static async deleteDriver(idDriver){
        const driver = await Driver.findById(idDriver) as Driver;
        if(!driver) throw new Error('Id user does not exist');
        return await Driver.findByIdAndDelete(idDriver);
    }

    // static async getLocationAddress(idUser:ObjectId, location: string){
    //     await Driver.findById(idUser) as Driver;
    //     let lat: number, lng: number, address: string;
    //     await Geocoder.geocode(location, (err, data) => {
    //         if(err || !data.length) throw new Error('Invalid address');
    //         lat = data[0].latitude;
    //         lng = data[0].longitude;
    //         address = data[0].formattedAddress;
    //         // console.log(data);
    //     });
       
    //     return await Driver.findByIdAndUpdate(idUser , {lat: lat, lng: lng, address: address}) as Driver;
    // }
}


/*
    * Create Driver (Sign Up & In)
    * Verify Druver
    * Change Info
    * Change Password
    * Restore Password when forgot
    * Get location (lat, lng) with address of Driver
*/