const mongoose = require('mongoose');
const Warranty = require('../models/warranty'); 

exports.calculateWarrantyEndDate = (purchaseDate, warrantyDuration, warrantyDurationUnit) => {
    console.log("Calculating warranty end date...");
    console.log("purchaseDate:", purchaseDate);
    console.log("warrantyDuration:", warrantyDuration);
    console.log("warrantyDurationUnit:", warrantyDurationUnit);

    const purchaseDateObj = new Date(purchaseDate);
    if (isNaN(purchaseDateObj.getTime())) {
        purchaseDate = purchaseDate.replace(' GMT', 'Z');
        purchaseDateObj = new Date(purchaseDate);
    }

    if (isNaN(purchaseDateObj.getTime())) {
        console.error('Invalid purchaseDate format:', purchaseDate);
        throw new Error('Invalid purchase date format');
    }

    let warrantyEndDate;

    if (warrantyDurationUnit === 'Year') {
        warrantyEndDate = new Date(purchaseDateObj.setFullYear(purchaseDateObj.getFullYear() + parseInt(warrantyDuration)));
    } else if (warrantyDurationUnit === 'Month') {
        warrantyEndDate = new Date(purchaseDateObj.setMonth(purchaseDateObj.getMonth() + parseInt(warrantyDuration)));
    }

    console.log("Calculated warranty end date:", warrantyEndDate);

    return warrantyEndDate;
};
