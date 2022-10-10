const jwt = require('jsonwebtoken');

const {Response} = require('../helpers')

const adminAuthMiddleware = async (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next()
    }

    if (!req.header('Authorization')) {
        return res
            .status(401)
            .json(Response.error("Authorization token required"))
    }

    const token = req.header('Authorization').replace("Bearer ", "")
    let decoded = null;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET, {audience: process.env.API_URL})
    } catch (e) {
        return res
            .status(401)
            .json(Response.error("Invalid token"))
    }

    req.user = decoded
    req.userId = decoded.sub

    next()
}
module.exports = {
    adminAuthMiddleware
}