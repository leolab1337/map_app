import Profile from "../model/Profile.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {profileCreate, profileSignIn, profileUpdate, profileUsername} from "./validation/profile.js";
import BasicService from "./BasicService.js";
import { idField } from "./validation/idField.js";
import { DEFactory } from "../router/api/v2/routeBuilder/core/service/dataExtractors/DEFactory.js";
import { validateInput } from "../router/api/v2/routeBuilder/core/service/validateInput.js";
import { ServiceError } from "../router/api/v2/routeBuilder/core/service/dataExtractors/error/ServiceError.js";
import { SEReason } from "../router/api/v2/routeBuilder/core/service/dataExtractors/error/SEReason.js";


/**
 * The class provides functionality for manipulating(CRUD operations) with Client SQL table.
 * This table contains clients data such as client username and name
 */
export default class ProfileService {
    constructor() {
        this.extractor = DEFactory.create();
        this.service = new BasicService(Profile, 'ProfileService');
    }

    /**
     * The method creates new client in the Client SQL table
     * @param {Client} data object with the client data, where clientUsername field is mandatory
     * @returns created Client object, if operation was successful or null if not
     */
    create = validateInput(async (data) => {
        const { username, password } = data;

        try {
            const isProfile = await this.searchByUserName(username);

            if(isProfile)
                return new ServiceError({
                    reason: SEReason.NOT_UNIQUE,
                    message: 'Profile with that username already exists',
                    field: 'username'
                });

            const hashedPassword = await encryptPassword(password);

            return this.service.create({username, password: hashedPassword});
        } catch (e) {
            console.error("ProfileService create: Could not execute the query");
            return new ServiceError({ reason: SEReason.UNEXPECTED, additional: e });
        }
    }, profileCreate);

    /**
    * Authenticates a user with the provided credentials.
    * @type {
      (credentials: {username: string, password: string}) => 
      Promise<{token: string, username: string, password: string} | null>
    }
    */
    authenticate = validateInput(async (credentials) =>{
        const secret = 'your_secret_key';
        const jwt_expires = '12h';
        const {username, password} = credentials;

        const profile = await this.searchByUserName(username);
        if(!profile || !(await bcrypt.compare(password, profile.password)))
            return null;

        const accessToken = jwt.sign({ id: profile.id }, secret, { expiresIn: jwt_expires });
        const expiresOn = calculateExpirationTime(jwt_expires);
        return { id: profile.id, username, password, accessToken, expiresOn };
    }, profileSignIn);

    /**
     * The method reads Client with provided primary key(clientUsername)
     * @param {string} primaryKey primary key of the client
     * @returns founded Client object, if operation was successful or null if not
     */
    read = async (primaryKey) => {
        return this.service.readOneById(primaryKey, idField);
    }

    /**
     * The method reads Client with provided primary key(clientUsername)
     * @param {string} username primary key of the client
     * @returns founded Client object, if operation was successful or null if not
     */
    searchByUserName = validateInput(async (username) => {
        return this.service.searchOne({where: {username}});
    }, profileUsername);

    /**
     * The method reads all Clients of the Client SQL table
     * @param {{}=} options settings
     * @returns array of the founded Client objects, if operation was successful or null if not
     */
    async readAll(options) {
        return this.service.readAll(options);
    }

    /**
     * The method updates existing client data in the Client SQL table
     * @param {Client} data object with the client data, such as clientUsername or name
     * @returns true, if the operation was successful or false if not
     */
    update = validateInput(async (data) => {
        const { id, username, password } = data;

        if(username){
            try{
                const profile = await this.searchByUserName(username);
                if(profile?.id && profile.id !== id)
                    return new ServiceError({
                        reason: SEReason.NOT_UNIQUE,
                        message: 'Profile with that username already exists',
                        field: 'username'
                    });
            } catch (e){
                console.error("ProfileService update: Could not execute the query", e);
                return new ServiceError({reason: SEReason.UNEXPECTED, additional: e});
            }
        }   

        if(password)
            data.password = await encryptPassword(password);

        return this.service.updateById(data, null);
    }, profileUpdate);

    /**
     * The method deletes client with provided primary key(clientUsername)
     * @param {string} primaryKey primary key of the client
     * @returns true if operation was successful or false if not
     */
    delete = (primaryKey) => {
        return this.service.deleteById(primaryKey, idField);
    }
}

function calculateExpirationTime(jwt_expires) {
    const unit = jwt_expires.slice(-1);
    const amount = parseInt(jwt_expires.slice(0, -1), 10);
    let milliseconds;

    switch (unit) {
        case 'h':
            milliseconds = amount * 60 * 60 * 1000; // hours to milliseconds
            break;
        case 'm':
            milliseconds = amount * 60 * 1000; // minutes to milliseconds
            break;
        case 's':
            milliseconds = amount * 1000; // seconds to milliseconds
            break;
        default:
            return new ServiceError({
                reason: SEReason.MISCONFIGURED,
                message: 'Could not determine the expiration of the JWT token, because the jwt_expires has wrong format'
            });
    }

    return Date.now() + milliseconds;
}

/**
 * 
 * @param {string} plainPassword 
 */
async function encryptPassword(plainPassword) {
    const salt = await bcrypt.genSalt(10); // Generate salt
    return await bcrypt.hash(plainPassword, salt);
}