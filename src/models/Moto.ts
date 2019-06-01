import { Schema, model } from 'mongoose';
import { ObjMoto } from '../types/ObjMoto';
import { ObjectId } from 'bson';

const MotoSchema = new Schema({
    idMoto: {type: Number},
    image: { type: String, required: true},
    numPlate: {type: String},
    color : { type: String},
    motoMaker: { type: String},
    type: { type: String},
    description: {type: String}
});

const MotoModel = model('Moto', MotoSchema);


export class Moto extends MotoModel{
    image: string;
    numPlate: string;
    color: string;
    motoMaker: string;
    type: string;
    description: string;

    static async createMotoInfo(obj: ObjMoto): Promise<ObjectId>{
        const moto = new Moto(obj.moto);
        const response = await moto.save();
        return response._id;
    }

    static async changeMotoInfo(idMoto, obj: ObjMoto): Promise<ObjectId>{
        const moto = await Moto.findByIdAndUpdate(idMoto, {
            image: obj.moto.image,
            numPlate: obj.moto.numPlate,
            color: obj.moto.color,
            motoMaker: obj.moto.motoMaker,
            type: obj.moto.type,
            description: obj.moto.description
        }) as Moto;
        return moto._id;
    }

    static async getMotoInfoWithIdMoto(idMoto): Promise<any>{
        const moto = await Moto.findOne({_id: idMoto}) as Moto;
        const { _id, image, numPlate, type, color, description, motoMaker } = moto;

        return {
            moto: { 
                idMoto: _id, image, numPlate, type, color, description, motoMaker
            }
        }

    }
    static async deleteMoto(idMoto){
        const moto = await Moto.findById(idMoto) as Moto;
        if(!moto) throw new Error('Id Moto does not exist');
        return Moto.findByIdAndDelete(idMoto);
    }
}