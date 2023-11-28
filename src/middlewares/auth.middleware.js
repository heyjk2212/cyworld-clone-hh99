import jwt from "jsonwebtoken";
import { prisma } from "../utils/prisma/index.js";
import dotenv from "dotenv";

dotenv.config();

export default async function (req, res, next) {
    try{
        const token = req.headers.authorization;
        const key = process.env.SECRET_KEY;
        if(!token)throw new Error('토큰이 존재하지 않습니다.')

        const [tokenType, jwtToken] = token.split(' ')

        if(tokenType !== 'Bearer')throw new Error('Bearer형식이 아닙니다.')
    
        const decodedToken = jwt.verify(jwtToken, key);
        const memberId = decodedToken.memberId;
    
        const user = await prisma.users.findFirst({where : {memberId : +memberId}})
        if(!user)throw new Error('토큰 사용자가 존재하지 않습니다.');
    
        req.user = user;
    
        next();
    }catch(error){
        switch (error.name) {
            case 'TokenExpiredError':
                return res.status(401).json({message : "토큰이 만료됨"})
            case 'JsonWebTokenError':
                return res.status(401).json({message : "토큰이 잘못됨"})
            default:
                return res.status(401).json({message : error.message ?? '비정상적인 요청입니다.'})
        }
    }
}