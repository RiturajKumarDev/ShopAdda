const fs = require("fs");
const Address = require("../modules/Address");

exports.uploadAddress = async (req, res, next) => {
    const userId = req.user._id;
    const { fullName, phone, alternatePhone, addressLine1, addressLine2, landmark, city, state, pincode, country, addressType, isDefault } = req.body;
    const address = new Address({ userId, fullName, phone, alternatePhone, addressLine1, addressLine2, landmark, city, state, pincode, country, addressType, isDefault });
    address.save()
        .then(result => {
            return res.status(201).json(address);
        }).catch(error => {
            return res.status(400).json({ "errors": error.errmsg });
        });
};

exports.updateAddress = async (req, res, next) => {
    const userId = req.user._id;
    const { _id, fullName, phone, alternatePhone, addressLine1, addressLine2, landmark, city, state, pincode, country, addressType, isDefault } = req.body;
    Address.findById(_id)
        .then((address) => {
            address.fullName = fullName;
            address.phone = phone;
            address.alternatePhone = alternatePhone;
            address.addressLine1 = addressLine1;
            address.addressLine2 = addressLine2;
            address.landmark = landmark;
            address.city = city;
            address.state = state;
            address.pincode = pincode;
            address.country = country;
            address.addressType = addressType;
            address.isDefault = isDefault;
            address.save()
                .then(result => {
                    return res.status(204).json(address);
                }).catch(error => {
                    return res.status(422).json({ "errors": error.errmsg });
                });
        })
};

exports.deleteAddress = async (req, res, next) => {
    const userId = req.user._id;
    const { addressId } = req.body;
    Address.findOneAndDelete({ userId, _id: addressId })
        .then(result => {
            return res.status(204).json(result);
        }).catch(error => {
            return res.status(401).json({ "errors": error.errmsg });
        });
};

exports.getAddressList = async (req, res, next) => {
    const userId = req.user._id;
    try {
        const addressList = await Address.find({ userId: userId });
        res.status(200).json(addressList);
    }
    catch (err) {
        res.status(500).json({ errors: "Server Error" + err.errmsg });
    }
};
