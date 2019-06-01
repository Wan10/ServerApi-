import { ObjectId } from "bson";

export interface SignUpUserResponse {
    token: string;
    user: { 
        idUser: ObjectId;
        userName: string;
        email: string;
        tel: string;
        address: string;
        role: string;
    }
}