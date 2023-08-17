const Establishment01 = require("../models/Establishment01");
const Establishment02 = require("../models/Establishment02");
const Establishment03 = require("../models/Establishment03");

const { Counter } = require("../models/UserCounter");

const validator = require("email-validator");
const sendMailer = require("../utils/sendMailer");
const sendMailerTg = require("../utils/sendMailerTg");

// Message Mail
const mailMessage01 = "message 01";
const mailMessage02 = "message 02";

// //
// //
// // getCounter
// const getCounter = async (req, res) => {
//   try {
//     // Retrieve the counter from the database
//     const counter = await Counter.findOne({ _id: "establishment01_id" })
//       .lean()
//       .exec();

//     // Send the counter in the response
//     res.json(counter);
//   } catch (error) {
//     console.error("Error retrieving counter:", error);
//     res.status(500).json({ message: "Error retrieving counter" });
//   }
// };

//
//
// getCounter
const getCounter = async (req, res) => {
  try {
    const { id } = req.params;

    const idToFindMap = {
      test01: "establishment01_id",
      test02: "establishment02_id",
      "test-03": "establishment03_id",
    };

    const findCounterId = idToFindMap[id];

    // Retrieve the counter from the database
    const counter = await Counter.findOne({ _id: findCounterId }).lean().exec();

    // console.log(counter.sequence_value);
    // Send the counter in the response
    res.json(counter);
  } catch (error) {
    console.error("Error retrieving counter:", error);
    res.status(500).json({ message: "Error retrieving counter" });
  }
};

//
// userEstablishment01
const userEstablishment01 = async (req, res) => {
  try {
    const { username, surname, ticketnumber, email, packages } = req.body;

    // Validate input
    if (!username || !surname || !ticketnumber || !email || !packages) {
      // return res.status(400).json({ message: "All fields are required" });
      return res.json({
        success: false,
        field: "input",
        message: "All fields are required",
      });
    }

    // Check the counter value
    const counterDoc = await Counter.findOne({ _id: "establishment01_id" })
      .lean()
      .exec();
    if (!counterDoc || counterDoc.sequence_value > 49) {
      // return res.status(403).json({
      return res.json({
        success: false,
        field: "promotioncode",
        message: "Promotion code limit has been reached",
      });
    }

    // // Validate input
    // const missingFields = [
    //   "username",
    //   "surname",
    //   "memberid",
    //   "ticketnumber",
    //   "email",
    //   "packages",
    // ].filter((field) => !req.body[field]);

    // if (missingFields.length > 0) {
    //   return res.status(400).json({
    //     message: `The following fields are required: ${missingFields.join(
    //       ", "
    //     )}`,
    //   });
    // }

    // Trim html tags, allow only A-Z, a-z, 1-9
    const sanitize = (input) => input.replace(/[^ก-๛a-zA-Z0-9]/g, "");

    const sUsername = sanitize(username);
    const sSurname = sanitize(surname);
    // const sTicketnumber = sanitize(ticketnumber);
    // const sPackages = sanitize(packages);

    // Validate email
    if (!validator.validate(email)) {
      // return res.status(400).json({ success: true, message: "Invalid email" });
      return res.json({
        success: false,
        field: "email",
        message: "Invalid email",
      });
    }

    // // Check for duplicate memberid
    // const duplicateMemberid = await Establishment01.findOne({ sMemberid })
    //   .collation({ locale: "en", strength: 2 })
    //   .lean()
    //   .exec();
    // if (duplicateMemberid) {
    //   return res.status(409).json({ message: "Duplicate memberid" });
    // }

    // Check for duplicate email
    const duplicateEmail = await Establishment01.findOne({ email })
      .collation({ locale: "en", strength: 2 })
      .lean()
      .exec();
    if (duplicateEmail) {
      return (
        res
          // .status(409)
          .json({
            success: false,
            field: "email",
            message: "Email is already registered",
          })
      );
    }

    // // Check for duplicates
    // const duplicateErrors = [];

    // const duplicateMemberid = await Establishment01.findOne({ memberid: sMemberid })
    //   .lean()
    //   .exec();
    // if (duplicateMemberid) {
    //   duplicateErrors.push({
    //     field: "memberid",
    //     message: `${sMemberid} already have`,
    //   });
    // }

    // const duplicateEmail = await Establishment01.findOne({ email }).lean().exec();
    // if (duplicateEmail) {
    //   duplicateErrors.push({
    //     field: "email",
    //     message: `${email} already have`,
    //   });
    // }

    // // If there are duplicate errors, respond with them
    // if (duplicateErrors.length > 0) {
    //   return res.json({
    //     success: false,
    //     message: "Duplicate values detected",
    //     errors: duplicateErrors,
    //   });
    // }

    // Create and store new user
    const user = await Establishment01.create({
      username: sUsername,
      surname: sSurname,
      ticketnumber,
      email,
      packages,
    });

    // Send mail
    sendMailer(email, user.promotioncode, packages, mailMessage01);

    // Send a successful response
    res.status(201).json({
      success: true,
      message: `New user ${username} created`,
      code: user.promotioncode,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    if (error.code === 11000) {
      // Handle duplicate key error
      res.status(409).json({ message: "Duplicate key error" });
    } else {
      // Handle general errors
      res
        .status(500)
        .json({ message: "An error occurred during registration" });
    }
  }
};

//
// userEstablishment02
const userEstablishment02 = async (req, res) => {
  try {
    const { username, surname, ropmember, email, packages } = req.body;

    // Validate input
    if (!username || !surname || !ropmember || !email || !packages) {
      // return res.status(400).json({ message: "All fields are required" });
      return res.json({
        success: false,
        field: "input",
        message: "All fields are required",
      });
    }

    // Check the counter value
    const counterDoc = await Counter.findOne({ _id: "establishment02_id" })
      .lean()
      .exec();
    if (!counterDoc || counterDoc.sequence_value > 149) {
      // return res.status(403).json({
      return res.json({
        success: false,
        field: "promotioncode",
        message: "Promotion code limit has been reached",
      });
    }

    // Trim html tags, allow only A-Z, a-z, 1-9
    const sanitize = (input) => input.replace(/[^ก-๛a-zA-Z0-9]/g, "");

    const sUsername = sanitize(username);
    const sSurname = sanitize(surname);
    // const sTicketnumber = sanitize(ropmember);
    // const sPackages = sanitize(packages);

    // Validate email
    if (!validator.validate(email)) {
      // return res.status(400).json({ success: true, message: "Invalid email" });
      return res.json({
        success: false,
        field: "email",
        message: "Invalid email",
      });
    }

    // Check for duplicate email
    const duplicateEmail = await Establishment02.findOne({ email })
      .collation({ locale: "en", strength: 2 })
      .lean()
      .exec();
    if (duplicateEmail) {
      return (
        res
          // .status(409)
          .json({
            success: false,
            field: "email",
            message: "Email is already registered",
          })
      );
    }

    // Create and store new user
    const user = await Establishment02.create({
      username: sUsername,
      surname: sSurname,
      ropmember,
      email,
      packages,
    });

    // Send mail
    sendMailer(email, user.promotioncode, packages, mailMessage02);

    // Send a successful response
    res.status(201).json({
      success: true,
      message: `New user ${username} created`,
      code: user.promotioncode,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    if (error.code === 11000) {
      // Handle duplicate key error
      res.status(409).json({ message: "Duplicate key error" });
    } else {
      // Handle general errors
      res
        .status(500)
        .json({ message: "An error occurred during registration" });
    }
  }
};

//
// userEstablishment03
const userEstablishment07 = async (req, res) => {
  try {
    const { username, surname, walletaddress, email, packages } = req.body;

    // Validate input
    if (!username || !surname || !walletaddress || !email || !packages) {
      // return res.status(400).json({ message: "All fields are required" });
      return res.json({
        success: false,
        field: "input",
        message: "All fields are required",
      });
    }

    // Check the counter value
    const counterDoc = await Counter.findOne({ _id: "establishment03_id" })
      .lean()
      .exec();
    if (!counterDoc || counterDoc.sequence_value > 19) {
      // return res.status(403).json({
      return res.json({
        success: false,
        field: "promotioncode",
        message: "Promotion code limit has been reached",
      });
    }

    // Trim html tags, allow only A-Z, a-z, 1-9
    const sanitize = (input) => input.replace(/[^ก-๛a-zA-Z0-9]/g, "");

    const sUsername = sanitize(username);
    const sSurname = sanitize(surname);
    // const sTicketnumber = sanitize(telephonenumber);
    // const sPackages = sanitize(packages);

    // Validate email
    if (!validator.validate(email)) {
      // return res.status(400).json({ success: true, message: "Invalid email" });
      return res.json({
        success: false,
        field: "email",
        message: "Invalid email",
      });
    }

    // Check for duplicate email
    const duplicateEmail = await Establishment03.findOne({ email })
      .collation({ locale: "en", strength: 2 })
      .lean()
      .exec();
    if (duplicateEmail) {
      return (
        res
          // .status(409)
          .json({
            success: false,
            field: "email",
            message: "Email is already registered",
          })
      );
    }

    // Create and store new user
    const user = await Establishment03.create({
      username: sUsername,
      surname: sSurname,
      walletaddress,
      email,
      packages,
    });

    // Send mail
    sendMailer(email, user.promotioncode, packages, mailMessage01);

    // Send a successful response
    res.status(201).json({
      success: true,
      message: `New user ${username} created`,
      code: user.promotioncode,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    if (error.code === 11000) {
      // Handle duplicate key error
      res.status(409).json({ message: "Duplicate key error" });
    } else {
      // Handle general errors
      res
        .status(500)
        .json({ message: "An error occurred during registration" });
    }
  }
};

module.exports = {
  getCounter,
  userEstablishment01,
  userEstablishment02,
  userEstablishment03,
};
