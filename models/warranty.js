const mongoose = require('mongoose');

const warrantySchema = new mongoose.Schema({
    productName: {
        type: String,
        //required: true,
    },
    productId: {
        type: String,
    },
    purchaseDate: {
        type: String,
        sparse: true,
    },
    warrantyDuration: { //stores number of months/years
        type: String, 
        //required: true,
    },
    warrantyDurationUnit: {  //stores "Years" or "Months"(time unit)
        type: String,
        enum: ['Year', 'Month'],
        required: true,
    },
    warrantyEndDate: {
        type: Date,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        enum: ["Active", "Expired"],
        default: "Active",
    },
    //Image URL's
    receiptPhoto: {
        type: String,
    },
    warrantyCardPhoto: {
        type: String,
    },
    productPhoto: {
        type: String
    },
});

const Warranty = mongoose.model('Warranty', warrantySchema);

module.exports = Warranty;