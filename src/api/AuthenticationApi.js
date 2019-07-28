const { secure } = require("../middleware/Security");
const RegistrationRequest = require("../entity/request/RegistrationRequest");
const LoginRequest = require("../entity/request/LoginRequest");
const UserService = require("../service/UserService");
const constants = require("../constants");
const SecurityService = require("../service/SecurityService");

class AuthenticationApi {
    constructor(app) {
        this.userService = new UserService();
        app.get(
            "/profile",
            secure(constants.USER_ROLE_USER),
            this.profile.bind(this)
        );
        app.post("/register", this.register.bind(this));
        app.post("/login", this.login.bind(this));
    }

    async profile(req, res) {
        const result = await this.userService.getProfile(req.userId);
        res.json(result);
    }

    async login(req, res) {
        try {
            const deviceId = SecurityService.deviceIdFromRequest(req);
            const request = new LoginRequest(req.body);
            const token = await this.userService.loginUser(request, deviceId);
            res.json({ token });
        } catch (error) {
            this.errorHandler(error, res);
        }
    }

    async register(req, res) {
        try {
            const request = new RegistrationRequest(req.body);
            const user = await this.userService.registerUser(request);
            user.password = undefined;
            res.json(user);
        } catch (error) {
            this.errorHandler(error, res);
        }
    }

    errorHandler(error, res) {
        console.error(error);
        switch (error.message) {
            case "USER_EXISTS":
                res.status(409);
                res.json({
                    message: "User does already exist!",
                    status: 409
                });
                break;
            case "USER_NOT_EXISTS":
                res.status(404);
                res.json({
                    message: "User does not exist!",
                    status: 404
                });
                break;
            case "WRONG_CREDENTIALS":
                res.status(401);
                res.json({
                    message: "Wrong credentials!",
                    status: 401
                });
                break;
            default:
                res.status(500);
                res.json({
                    message: error.message,
                    status: 500
                });
        }
    }
}
module.exports = AuthenticationApi;
