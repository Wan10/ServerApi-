import { ObjectId } from "bson";

export interface ObjDriver {
   driver: {
        userName: string;
        email: string;
        firstName: string;
        lastName: string;
        password: string;
        birth: Date;
        tel: string;
        address: string;
        role: string;
        idMoto: ObjectId;
        status: string;
        aboutMe: string;
   }
}