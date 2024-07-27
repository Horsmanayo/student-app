const OTP = require("../models/otpModel");
const cron = require("node-cron");

const task = cron.schedule("* 23 * * *", async () => {
  try {
    const expiredOtps = await OTP.find({ expiresAt: { $lt: Date.now() } });
    if (expiredOtps.length === 0) return;

    await OTP.deleteMany({ expiresAt: { $lt: Date.now() } }).exec();
    console.log("Expired OTPs deleted successfully");
  } catch (err) {
    console.error("Error deleting expired OTPs:", err);
  }
});

module.exports = task;
