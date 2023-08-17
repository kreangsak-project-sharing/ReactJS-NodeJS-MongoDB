const rateLimit = require("express-rate-limit");

const apiReqLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minutes
  max: 20, // limit each IP to 10 requests per windowMs
  statusCode: 429, // correct HTTP status code for rate limiting
  message: {
    // status: 429, // optional, of course
    limiter: true,
    type: "error",
    message: "คำขอมากเกินไปจาก IP นี้ โปรดลองอีกครั้งหลังจาก 1 นาที",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = apiReqLimiter;
