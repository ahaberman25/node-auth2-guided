const jwt = require("jsonwebtoken")

const roles = [
	"normal",
	"admin",
]

function restrict(role) {
	return async (req, res, next) => {
		const authError = {
			message: "Invalid credentials",
		}

		try {
			// express-session will automatically get the session ID from the cookie
			// header, and check to make sure it's valid and the session for this user exists.
			// if (!req.session || !req.session.user) {
			// 	return res.status(401).json(authError)
			// }

			const token = req.cookies.token // read cookie

			if (!token) {
				return res.status(401).json(authError)
			}

			jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => { // jwt.verify - the variable with token, secret, err
				if (err) {
					return res.status(401).json(authError)
				}

				if (role && roles.indexOf(decoded.access) < roles.indexOf(role)) {
					return res.status(401).json(authError)
				}

				next()
			})	
			
			
		} catch(err) {
			next(err)
		}
	}
}

module.exports = restrict