const Warranty = require('.../models/warranty');

const createWarranty = async ( req, res ) => {
    const warranty = new Warranty({
        
        receiptPhoto: receiptPhotoURL,
        warrantyCardPhoto: warrantyCardPhotoURL,
        productPhoto: productPhotoURL,
    });
    await warranty.save();
};

export default createWarranty;