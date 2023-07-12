const jwt = require("jsonwebtoken");

const authenticate = async (req: any, res: any, next: any) => {
  let token = req.headers["authorization"];

  // console.log("token is ", token);

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    console.log('verified user   ',verified)
    return verified
    // next();
  } catch (err) {
    console.log("Verification failed!", err);
  }
};

module.exports = { authenticate };
