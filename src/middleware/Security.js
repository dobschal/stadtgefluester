const SecurityService = require("../service/SecurityService");

class Security {
    static secure(userRoles) {
        if (typeof userRoles === "string") {
            userRoles = [userRoles];
        }
        return (req, res, next) => {
            const token = req.header("Authorization");
            try {
                req.userId = SecurityService.userTokenIsValid(token, userRoles);
                next();
            } catch (error) {
                console.error(error);
                switch (error.message) {
                    case "TOKEN_EXPIRED":
                        res.status(401);
                        res.json({
                            message: "Token expired.",
                            status: 401
                        });
                        break;
                    default:
                        res.status(401);
                        res.json({
                            message: "Unauthorized",
                            status: 401
                        });
                }
            }
        };
    }
}

module.exports = Security;
