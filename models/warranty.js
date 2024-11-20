const mongoose = require('mongoose');

const warrantySchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
    },
    productId: {
        type: String,
    },
    purchaseDate: {
        type: Date,
        sparse: true,
    },
    warrantyDuration: { //this stores 5 of 5 months
        type: Number, 
        required: true,
    },
    warrantyDurationUnit: {  //this stores month of 5 month
        type: String,
        enum: ["Year", "Month"],
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
});

const Warranty = mongoose.model('Warranty', warrantySchema);

module.exports = Warranty;