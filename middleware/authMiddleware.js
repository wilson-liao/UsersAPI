const jwt = require('jsonwebtoken')

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, 'secret', (err, decodedToken) => {
            if (err) {
                console.log(err)
                res.status(400).send('log in first')
            }
            else {
                console.log(decodedToken)
                next()
            }
        })
    }
    else {
        res.status(400).send('log in first')
    }
}

module.exports = { requireAuth };