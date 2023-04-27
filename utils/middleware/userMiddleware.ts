import { MIDDLEWARE_CONFIG } from '@/services/config.service';
import jwt from 'jsonwebtoken'
const userMiddleware = (req: any, res:any, next:any) => {
  // Get the user from the jwt token and add id to req object
  const token = req.header('auth-token');
  console.log(token);
  if (!token) {
    res.status(401).send({
      errors: [{ msg: 'Authentication Missing' }],
    });
    return;
  }
  try {
    const data: any = jwt.verify(JSON.parse(token), MIDDLEWARE_CONFIG.JWT_SECRET);
    req.user_id = data.user_id;
    next();
  } catch (error) {
    res.status(401).send({
      errors: [{ msg: 'Please authenticate using a valid token' }],
    });
  }
};
module.exports = userMiddleware;
