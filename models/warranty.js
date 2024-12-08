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
    warrantyDurationUnit: {  //stores "Year" or "Month"(time unit)
        type: String,
        enum: ["Year", "Month"],
        //required: true,
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
    receiptPhoto: {
        type: String, //image url
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