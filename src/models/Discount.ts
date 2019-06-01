import { Schema, model} from 'mongoose';


const DiscountSchema = new Schema({
    idDiscount: {type: Number},
    codeDiscount: {type: String, trim: true, maxlength: 6},
    percent: {type: Number, maxlength: 2}
});

const DiscountModel = model('Discount',DiscountSchema);