import jwt from "jsonwebtoken";
import {User} from "../authentication/User.js";
import {APIError} from "../error/APIError.js";
import {ErrorReason} from "../error/ErrorReason.js";

const secret = 'your_secret_key';

export const authenticate = (authFieldName) => {
    return function(req, res, next){
        const authHeader = req.headers.authorization;
        if(!authHeader)
            throw new APIError(ErrorReason.NOT_AUTHENTICATED, 'Authorization Bearer header is required', req.baseUrl);

        const [authType, token] = authHeader.split(' ');

        if(!authType || authType !== 'Bearer' || !token)
            throw new APIError(ErrorReason.BAD_REQUEST, 'Authorization header must it in Bearer form', req.baseUrl);

        try {
            const decoded = jwt.verify(token, secret);
            req[authFieldName] = new User(decoded.id);
            return next();
        } catch (error) {
            throw new APIError(ErrorReason.BAD_REQUEST, 'Could not authenticate with provided token', req.baseUrl);
        }
    }
}