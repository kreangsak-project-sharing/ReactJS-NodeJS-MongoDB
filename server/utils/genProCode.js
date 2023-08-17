const voucher_codes = require("voucher-code-generator");

// Function generate promotion code
const generatePromotionCode = () => {
  return voucher_codes.generate({
    prefix: "PROMO-",
    // postfix: "-2023",
    length: 10,
  })[0];
};

const increatePromotionCode = (currentCode) => {
  const codeNumber = parseInt(currentCode.split("-")[1]);
  const newCodeNumber = codeNumber + 1;
  const newCode = `${currentCode.split("-")[0]}-${newCodeNumber
    .toString()
    .padStart(5, "0")}`;
  return { newCode, codeNumber };
};

module.exports = { generatePromotionCode, increatePromotionCode };
