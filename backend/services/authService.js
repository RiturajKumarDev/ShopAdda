const jwt = require("jsonwebtoken");

exports.create_access_token = async (data, res) => {
    const { _id, email, fullName, role, approved } = data;

    const token = jwt.sign(
        { _id, email, fullName, role, approved },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "7d",
            algorithm: process.env.ALGORITHM || "HS256"
        }
    );

    return res.status(200).json({ access_token: token, token_type: "bearer" });
};

exports.verify_token = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader)
        return res.status(401).json({ message: "Unauthorized" });

    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer")
        return res.status(401).json({ message: "Invalid authorization header" });

    const token = parts[1];

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET,
            {
                algorithms: [process.env.ALGORITHM || "HS256"]
            }
        );
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

exports.verify_vendor = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader)
        return res.status(401).json({ message: "Authorization token required" });

    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer")
        return res.status(401).json({ message: "Invalid authorization header" });

    const token = parts[1];
    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET,
            {
                algorithms: [process.env.ALGORITHM || "HS256"]
            }
        );
        req.user = decoded;
        if (req.user.role !== "Vendor")
            return res.status(403).json({ message: "Access denied: Vendor role required" });
        if (req.user.approved !== true)
            return res.status(403).json({ message: "Vendor account is not approved" });
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

exports.verify_admin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader)
        return res.status(401).json({ message: "Authorization token required" });

    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer")
        return res.status(401).json({ message: "Invalid authorization header" });

    const token = parts[1];
    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET,
            {
                algorithms: [process.env.ALGORITHM || "HS256"]
            }
        );
        req.user = decoded;
        if (req.user.role !== "Admin")
            return res.status(403).json({ message: "Access denied: Admin role required" });
        if (req.user.approved !== true)
            return res.status(403).json({ message: "Admin account is not approved" });
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
