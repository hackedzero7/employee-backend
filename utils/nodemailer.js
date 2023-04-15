const nodemailer = require('nodemailer');

exports.transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'hackedzero7@gmail.com',
    pass: 'cmmignnhrzdwrzwb',
  },

});
