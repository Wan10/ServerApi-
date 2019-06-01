import { Schema, model, SchemaTypes } from 'mongoose';


const BookingSchema = new Schema({
    idBooking: { type: Number },
    idUser: {type: Schema.Types.ObjectId, required: true},
    idDriver: { type: Schema.Types.ObjectId, required: true},
    idRoute: { type: Schema.Types.ObjectId, required: true}
}); 


const BookingModel = model('Booking', BookingSchema);

export class Booking extends BookingModel{

}