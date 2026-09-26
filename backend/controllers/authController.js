const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const User = require("../modules/User");
const { create_access_token } = require("../services/authService");

exports.register = [
    check('fullName')
        .notEmpty()
        .withMessage('Name is required')
        .trim()
        .isLength({ min: 2 })
        .withMessage("Name must be at least 2 characters long")
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Name can only contain letters'),
    check("email")
        .isEmail()
        .withMessage("Please enter a valid email")
        .normalizeEmail(),
    check("password")
        .isLength({ min: 8 })
        .withMessage("Password should be atleast 8 characters long")
        .matches(/[A-Z]/)
        .withMessage("Password should contain atleast one uppercase letter")
        .matches(/[a-z]/)
        .withMessage("Password should contain atleast one lowercase letter")
        .matches(/[0-9]/)
        .withMessage("Password should contain atleast one number")
        .matches(/[!@#$%^&*(),.?":{}|<>]/)
        .withMessage("Password should contain atleast one special character")
        .trim(),
    check("confirmPassword")
        .custom((value, { req }) => {
            if (value != req.body.password)
                throw new Error("Passwords do not match");
            return true;
        }),
    check('mobile')
        .notEmpty()
        .withMessage('mobile is required')
        .trim()
        .isLength({ min: 10 })
        .withMessage("mobile must be at 10 digits")
        .matches(/[0-9]/)
        .withMessage('Mobile can only contain digits'),
    check("gender")
        .notEmpty()
        .withMessage("Please select a user type")
        .isIn(["Male", "Female", "Other"])
        .withMessage("Invalud gender type"),
    check("role")
        .notEmpty()
        .withMessage("Please select a role type")
        .isIn(["Vendor", "User"])
        .withMessage("Invalud role type"),
    check('businessName')
        .if((value, { req }) => req.body.role === 'Vendor')
        .notEmpty()
        .withMessage('Business Name is required for vendors'),
    check('gstNumber')
        .if((value, { req }) => req.body.role === 'Vendor')
        .notEmpty()
        .withMessage('GST Number is required for vendors'),
    check('panNumber')
        .if((value, { req }) => req.body.role === 'Vendor')
        .notEmpty()
        .withMessage('PAN Number is required for vendors'),
    check('aadharNumber')
        .if((value, { req }) => req.body.role === 'Vendor')
        .notEmpty()
        .withMessage('Aadhar Number is required for vendors'),
    check('storeAddress')
        .if((value, { req }) => req.body.role === 'Vendor')
        .notEmpty()
        .withMessage('Store Address is required for vendors'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                "errors": errors.array().map(error => error.msg),
            });
        }

        bcrypt.hash(req.body.password, 12)
            .then(hashPassword => {
                const user = new User({ ...req.body, password: hashPassword });
                user.save()
                    .then((result) => {
                        return res.status(201).json(result);
                    }).catch((error) => {
                        return res.status(422).json({ "errors": error.errmsg });
                    });
            })
            .catch(error => {
                return res.status(422).json({ "errors": error });
            });
    }
];

exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(422).json({ "errors": ['Invalid emial or password!!!'] });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(422).json({ "errors": ['Invalid emial or password!!!'] });
    const data = { _id: user._id, email: user.email, fullName: user.fullName, role: user.role, approved: user.approved };
    return create_access_token(data, res);
};

exports.getUser = async (req, res, next) => {
    const _id = req.user._id;
    try {
        const user = await User.findById(_id);
        res.status(200).json(user);
    }
    catch (err) {
        res.status(500).json({ errors: "Server Error" + err.errmsg });
    }
};

exports.updateUser = async (req, res, next) => {
    const _id = req.user._id;
    const { fullName, email, mobile, dob, gender, businessName, gstNumber, panNumber, aadharNumber, storeAddress } = req.body;

    try {
        const user = await User.findById(_id);

        if (!user) {
            return res.status(404).json({
                errors: ["User not found"]
            });
        }

        // Update only provided fields
        if (fullName !== undefined) user.fullName = fullName;
        if (email !== undefined) user.email = email;
        if (mobile !== undefined) user.mobile = mobile;
        if (dob !== undefined) user.dob = dob;
        if (gender !== undefined) user.gender = gender;
        if (businessName !== undefined) user.businessName = businessName;
        if (gstNumber !== undefined) user.gstNumber = gstNumber;
        if (panNumber !== undefined) user.panNumber = panNumber;
        if (aadharNumber !== undefined) user.aadharNumber = aadharNumber;
        if (storeAddress !== undefined) user.storeAddress = storeAddress;

        const updatedUser = await user.save();

        res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser
        });

    } catch (error) {
        // Duplicate email/mobile
        if (error.code === 11000) {
            return res.status(409).json({
                errors: ["Email or mobile already exists"]
            });
        }

        res.status(500).json({
            errors: ["Server Error"]
        });
    }
};

exports.changePassword = async (req, res, next) => {
    const _id = req.user._id;
    const { oldPassword, newPassword, confirmPassword } = req.body;

    try {
        // Check required fields
        if (!oldPassword || !newPassword || !confirmPassword) {
            return res.status(422).json({
                errors: ["All password fields are required"]
            });
        }

        // Check new password and confirm password
        if (newPassword !== confirmPassword) {
            return res.status(422).json({
                errors: ["New passwords do not match"]
            });
        }

        // Password validation
        if (newPassword.length < 8) {
            return res.status(422).json({
                errors: ["Password should be at least 8 characters long"]
            });
        }

        if (!/[A-Z]/.test(newPassword)) {
            return res.status(422).json({
                errors: ["Password should contain at least one uppercase letter"]
            });
        }

        if (!/[a-z]/.test(newPassword)) {
            return res.status(422).json({
                errors: ["Password should contain at least one lowercase letter"]
            });
        }

        if (!/[0-9]/.test(newPassword)) {
            return res.status(422).json({
                errors: ["Password should contain at least one number"]
            });
        }

        if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
            return res.status(422).json({
                errors: ["Password should contain at least one special character"]
            });
        }

        // Find user
        const user = await User.findById(_id);

        if (!user) {
            return res.status(404).json({
                errors: ["User not found"]
            });
        }

        // Check old password
        const isMatch = await bcrypt.compare(
            oldPassword,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                errors: ["Old password is incorrect"]
            });
        }

        // Don't allow same password
        const samePassword = await bcrypt.compare(
            newPassword,
            user.password
        );

        if (samePassword) {
            return res.status(422).json({
                errors: ["New password must be different from old password"]
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        user.password = hashedPassword;

        await user.save();

        res.status(200).json({
            message: "Password changed successfully"
        });

    } catch (error) {
        res.status(500).json({
            errors: ["Server Error"]
        });
    }
};

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({}, '-password'); // Exclude passwords
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ errors: "Server Error" });
    }
};