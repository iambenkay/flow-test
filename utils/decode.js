const jwt = require("jsonwebtoken")

const secret_key = process.env.SECRET_KEY_JWT || "devsecretkey"

module.exports = token => {
    const payload = jwt.verify(token, secret_key)
    return payload ? payload : null

}
