var jwt = require('jsonwebtoken');

const userMiddleware = (req, res, next) => {
  // Get the user from the jwt token and add id to req object
  const JWT_SECRET = process.env.JWT_SECRET;
  const token = req.header('auth-token');
  console.log(token);
  if (!token) {
    res.status(401).send({
      errors: [{ msg: 'Authentication Missing' }],
    });
    return;
  }
  try {
    const data = jwt.verify(JSON.parse(token), JWT_SECRET);

    req.user_id = data.user_id;
    next();
  } catch (error) {
    res.status(401).send({
      errors: [{ msg: 'Please authenticate using a valid token' }],
    });
  }
};
module.exports = userMiddleware;
