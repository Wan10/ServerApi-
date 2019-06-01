import { ObjectId } from "bson";

export interface GetAllDriverResponse {
   driver: {
        userName: string;
        email: string;
        birth: Date;
        tel: string;
        address: string;
        role: string;
        idMoto: ObjectId;
        status: string;
   }
}