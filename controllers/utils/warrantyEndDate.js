//Calculates warranty end date

exports.caclculateWarrantyEndDate = (purchaseDate, duration, unit) => {
    const endDate = new Date(purchaseDate);

    if (unit === 'Year') {
        endDate.setFullYear(endDate.getFullYear() + duration);
    } else if (unit === 'Month') {
        endDate.setMonth(endDate.getMonth() + duration);
    }

    return endDate;
};