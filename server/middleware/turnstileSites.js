const axios = require("axios");

const nonInvisibleTurnstileSites = async (req, res, next) => {
  const token = req.body["cf-turnstile-response"];
  // console.log(token);

  // const ip = req.headers["cf-connecting-ip"];
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || null;

  // console.log(ip);

  const formData = {
    secret: process.env.NONINVISIBLE_TURNSTILE_SECRET_KEY,
    response: token,
    remoteip: ip,
  };

  try {
    const response = await axios.post(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      formData
    );

    const responsedata = response.data;
    if (responsedata.success) {
      next();
    } else {
      res.status(401).json({ message: "Token validation failed" });
    }
  } catch (error) {
    console.error("An error occurred during token validation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = nonInvisibleTurnstileSites;
