const Establishment01 = require("../models/Establishment01");
const Establishment02 = require("../models/Establishment02");
const Establishment03 = require("../models/Establishment03");
const Establishment04 = require("../models/Establishment04");
const Establishment05 = require("../models/Establishment05");
const Establishment06 = require("../models/Establishment06");
const Establishment07 = require("../models/Establishment07");
const Establishment08 = require("../models/Establishment08");
const Establishment09 = require("../models/Establishment09");
const Establishment10 = require("../models/Establishment10");

const { Counter } = require("../models/UserCounter");

const validator = require("email-validator");
const sendMailer = require("../utils/sendMailer");
const sendMailerTg = require("../utils/sendMailerTg");

// Message Mail
const mailMessage01 = "ใช้เป็นส่วนลด 1,000 บาท สำหรับ";
const mailMessage02 = "ใช้เป็นส่วนลด 30% (ไม่เกิน 1,800 บาท)";

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
      thaismile: "establishment01_id",
      thaismile2: "establishment02_id",
      nokair: "establishment03_id",
      rop: "establishment04_id",
      bmw: "establishment05_id",
      "bitkub-ba": "establishment06_id",
      "bitkub-bbt": "establishment07_id",
      "bitkub-bo": "establishment08_id",
      tg: "establishment09_id",
      "silver-voyage-club": "establishment10_id",
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
// Thaismaile1
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
// Thaismaile2
// userEstablishment02
const userEstablishment02 = async (req, res) => {
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
    const counterDoc = await Counter.findOne({ _id: "establishment02_id" })
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
// Nokair
// userEstablishment03
const userEstablishment03 = async (req, res) => {
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
    const counterDoc = await Counter.findOne({ _id: "establishment03_id" })
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
// ROP
// userEstablishment04
const userEstablishment04 = async (req, res) => {
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
    const counterDoc = await Counter.findOne({ _id: "establishment04_id" })
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
    const duplicateEmail = await Establishment04.findOne({ email })
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
    const user = await Establishment04.create({
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
// BMW
// userEstablishment05
const userEstablishment05 = async (req, res) => {
  try {
    const { username, surname, telephonenumber, email, packages } = req.body;

    // Validate input
    if (!username || !surname || !telephonenumber || !email || !packages) {
      // return res.status(400).json({ message: "All fields are required" });
      return res.json({
        success: false,
        field: "input",
        message: "All fields are required",
      });
    }

    // Check the counter value
    const counterDoc = await Counter.findOne({ _id: "establishment05_id" })
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
    const duplicateEmail = await Establishment05.findOne({ email })
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
    const user = await Establishment05.create({
      username: sUsername,
      surname: sSurname,
      telephonenumber,
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
// Bitkubba
// userEstablishment06
const userEstablishment06 = async (req, res) => {
  try {
    const { username, surname, email, packages } = req.body;

    // Validate input
    if (!username || !surname || !email || !packages) {
      // return res.status(400).json({ message: "All fields are required" });
      return res.json({
        success: false,
        field: "input",
        message: "All fields are required",
      });
    }

    // Check the counter value
    const counterDoc = await Counter.findOne({ _id: "establishment06_id" })
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
    const duplicateEmail = await Establishment06.findOne({ email })
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
    const user = await Establishment06.create({
      username: sUsername,
      surname: sSurname,
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
// Bitkubbbt
// userEstablishment07
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
    const counterDoc = await Counter.findOne({ _id: "establishment07_id" })
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
    const duplicateEmail = await Establishment07.findOne({ email })
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
    const user = await Establishment07.create({
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

//
// Bitkubbo
// userEstablishment08
const userEstablishment08 = async (req, res) => {
  try {
    const { username, surname, email, packages } = req.body;

    // Validate input
    if (!username || !surname || !email || !packages) {
      // return res.status(400).json({ message: "All fields are required" });
      return res.json({
        success: false,
        field: "input",
        message: "All fields are required",
      });
    }

    // Check the counter value
    const counterDoc = await Counter.findOne({ _id: "establishment08_id" })
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
    const duplicateEmail = await Establishment08.findOne({ email })
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
    const user = await Establishment08.create({
      username: sUsername,
      surname: sSurname,
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
// TG
// userEstablishment09
const userEstablishment09 = async (req, res) => {
  try {
    const {
      username,
      surname,
      ticketnumber,
      email,
      packages,
      telcontact,
      lineidcontact,
      emailcontact,
    } = req.body;

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
    const counterDoc = await Counter.findOne({ _id: "establishment09_id" })
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

    // Check for duplicate email
    const duplicateEmail = await Establishment09.findOne({ email })
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
    const user = await Establishment09.create({
      username: sUsername,
      surname: sSurname,
      ticketnumber,
      email,
      packages,
    });

    // Send mail
    sendMailerTg(
      email,
      user.promotioncode,
      packages,
      mailMessage01,
      telcontact,
      lineidcontact,
      emailcontact
    );

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
// Silver Voyage
// userEstablishment10
const userEstablishment10 = async (req, res) => {
  try {
    const { username, surname, telephonenumber, email, packages } = req.body;

    // Validate input
    if (!username || !surname || !telephonenumber || !email || !packages) {
      // return res.status(400).json({ message: "All fields are required" });
      return res.json({
        success: false,
        field: "input",
        message: "All fields are required",
      });
    }

    // Check the counter value
    const counterDoc = await Counter.findOne({ _id: "establishment10_id" })
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
    const duplicateEmail = await Establishment10.findOne({ email })
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
    const user = await Establishment10.create({
      username: sUsername,
      surname: sSurname,
      telephonenumber,
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
  userEstablishment04,
  userEstablishment05,
  userEstablishment06,
  userEstablishment07,
  userEstablishment08,
  userEstablishment09,
  userEstablishment10,
};
