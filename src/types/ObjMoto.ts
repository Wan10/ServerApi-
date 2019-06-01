import { ObjectId } from "bson";

export interface ObjMoto {
    moto: { 
        image: string;
        numPlate: string;
        color: string;
        motoMaker: string;
        type: string;
        description: string;
    }
}