const sha512 = require("js-sha512");
const TokenPayload = require("../entity/dto/TokenPayload");
const constants = require("../constants");
const Type = require("../lib/Type");

// Contains salts for token per device and user
// To logout user on a device, just remove the salt in here...
let tokenSalts = {};

class SecurityService {
    /**
     * @param {number} userId
     */
    static usersDevices(userId) {
        let devices = [];
        Object.keys(tokenSalts).forEach(key => {
            const [browser, source, uId] = key.split("__");
            if (Number(uId) === userId) {
                devices.push({ browser, source });
            }
        });
        return devices;
    }

    static deviceIdFromRequest(req) {
        return req.useragent.browser + "__" + req.useragent.source + "__";
    }

    /**
     * @param {User} user
     * @param {string} deviceId
     */
    static getUserToken(user, deviceId) {
        const payload = new TokenPayload({
            exp: Date.now() + constants.TOKEN_EXPIRATION,
            uid: user.id,
            did: deviceId,
            roles: user.userRoles
        });
        const salt = SecurityService.randomString(8);
        tokenSalts[deviceId + String(user.id)] = salt;
        console.log("Set tokenSalts: ", tokenSalts);
        const payloadAsString = JSON.stringify(payload);
        const signature = SecurityService.hash(payloadAsString + salt);
        const tokenPart1 = SecurityService.toBase64(payloadAsString);
        const tokenPart2 = SecurityService.toBase64(signature);
        return tokenPart1 + "." + tokenPart2;
    }

    /**
     * @param {string} token
     * @param {array<string>} userRoles
     * @returns {number} userId
     */
    static userTokenIsValid(token, userRoles) {
        Type.match(String, token);
        const [rawPayload, signature] = token
            .split(".")
            .map(SecurityService.fromBase64);
        const payload = new TokenPayload(JSON.parse(rawPayload));
        console.log("payload: ", rawPayload);
        if (payload.exp <= Date.now()) {
            throw new Error("TOKEN_EXPIRED");
        }
        const salt = tokenSalts[payload.did + String(payload.uid)];
        console.log("Salts: ", tokenSalts);
        if (typeof salt === "undefined") {
            throw new Error("UNAUTHORIZED");
        }
        if (SecurityService.hash(rawPayload + salt) !== signature) {
            throw new Error("UNAUTHORIZED");
        }
        let permitted = false;
        (userRoles || []).forEach(userRole => {
            if (payload.roles.includes(userRole)) permitted = true;
        });
        if (!permitted) {
            throw new Error("FORBIDDEN");
        }
        return payload.uid;
    }

    /**
     *
     * @param {string} plainText
     */
    static hash(plainText) {
        return sha512(plainText, process.env.secret);
    }

    /**
     * @param {string} plainText
     * @param {string} hashString
     */
    static validate(plainText, hashString) {
        return this.hash(plainText) === hashString;
    }

    static toBase64(plainText) {
        return Buffer.from(plainText).toString("base64");
    }

    static fromBase64(base64EncodedString) {
        return Buffer.from(base64EncodedString, "base64").toString();
    }

    static randomString(length) {
        var result = "";
        var characters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(
                Math.floor(Math.random() * charactersLength)
            );
        }
        return result;
    }
}

module.exports = SecurityService;
