const UserRepository = require("../repository/UserRepository");
const SecurityService = require("./SecurityService");
const User = require("../entity/db/User");
const constants = require("../constants");

class UserService {
    constructor() {
        this.userRepository = new UserRepository();
    }

    async getProfile(userId) {
        const user = await this.userRepository.findById(userId);
        user.password = undefined;
        user.devices = SecurityService.usersDevices(userId);
        return user;
    }

    async loginUser(loginRequest, deviceId) {
        const user = await this.userRepository.findFirstByUsername(
            loginRequest.username
        );
        if (!user) {
            throw new Error("USER_NOT_EXISTS");
        }
        if (!SecurityService.validate(loginRequest.password, user.password)) {
            throw new Error("WRONG_CREDENTIALS");
        }
        return SecurityService.getUserToken(user, deviceId);
    }

    async registerUser(registrationRequest) {
        const result = await this.userRepository.findFirstByUsername(
            registrationRequest.username
        );
        if (result) {
            throw new Error("USER_EXISTS");
        }
        const user = new User({
            username: registrationRequest.username,
            password: SecurityService.hash(registrationRequest.password),
            phoneNumber: registrationRequest.phoneNumber,
            phoneNumberConfirmed: false,
            email: registrationRequest.email,
            emailConfirmed: false,
            createdAt: new Date(),
            userRoles: [constants.USER_ROLE_USER]
        });
        console.log("Registration: ", user);
        return await this.userRepository.save(user);
    }
}

module.exports = UserService;
