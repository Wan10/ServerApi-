import { Schema, model} from 'mongoose';

const PaymentSchema = new Schema({
    idPayment : { type: Number},
    paymentType: { type: String},
    content: { type: String},
    idDiscount: [{ type: Schema.Types.ObjectId, ref: 'Discount'}]
});

const PaymentModel = model('Payment', PaymentSchema);

export class Payment extends PaymentModel{
    
}