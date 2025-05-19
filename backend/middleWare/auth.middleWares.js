'use strict'

const jwt = require('jsonwebtoken');

const Users = require('../config/models/users.models')

const authMiddleware = async (req, res, next) => {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if(!token){
            return res.status(401).json({
                success: false,
                message:"Access denied. Please log in again."
            })
        }

        try{
            const decodedTokenInfo =jwt.verify(token, process.env.JWT_SECRET);

            const user = await Users.findOne({_id : decodedTokenInfo.id});
            if(!user.refresh_token){
                throw new Error("Blocked. Please log in again.");
            }

            req.user = decodedTokenInfo;
            next();
        }catch (error){
            return res.status(401).json({
                success: false,
                message: error.message
            })
        }
}

module.exports = authMiddleware; 