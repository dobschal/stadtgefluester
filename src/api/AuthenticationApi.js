const Security = require("../filter/Security");

class AuthenticationApi {
  constructor(app) {
    app.get("/login", Security.secure("admin"), this.login);
  }

  login(req, res) {
    res.send("Huhu");
  }
}
module.exports = AuthenticationApi;
