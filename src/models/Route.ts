import { Schema, model } from 'mongoose';

const RouteShema = new Schema({
    idRoute: { type: Number},
    origin: { type: String},
    destination: { type: String },
    distance : { type: Number },
    timeOfDeparture: { type: Number },
    arrivalTime: {type: Number },
    idPayment: {type: Schema.Types.ObjectId, ref: 'Payment'},
    totalAmount: {type: Number}
});

const RouteModel = model('Route', RouteShema);

export class Route extends RouteModel{
    
}