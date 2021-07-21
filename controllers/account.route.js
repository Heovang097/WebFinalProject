const express = require('express');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');


const userModel = require('../models/user.model');
const auth = require('../middlewares/auth.mdw');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'longlcqt@gmail.com',
    pass: 'long2810'
  }
});


const router = express.Router();

router.get('/profile', auth, function(req, res) {
    res.render('vwAccount/profile');
});

router.get('/register', function(req, res) {
    res.render('vwAccount/register');
})

router.post('/register', async function(req, res) {
    const hash = bcrypt.hashSync(req.body.raw_password, 10);
    const dob = moment(req.body.raw_dob, 'DD/MM/YYYY').format('YYYY-MM-DD');
    const user = {
        Username: req.body.username,
        Password: hash,
        DOB: dob,
        Name: req.body.name,
        Email: req.body.email,
        Permission: 0,
        Avatar: 'https://cdn3.iconfinder.com/data/icons/avatars-round-flat/33/avat-01-512.png',
    }

    await userModel.add(user);
    res.render('vwAccount/register');
})

router.get('/is-available', async function(req, res) {
    const username = req.query.user;
    const user = await userModel.findByUsername(username);
    if (user === null) {
        return res.json(true);
    }

    res.json(false);
})

router.get('/login', async function(req, res) {
    res.render('vwAccount/login', {
        layout: false
    });
});

router.post('/login', async function(req, res) {
    const user = await userModel.findByUsername(req.body.username);
    var err_message = 'Tên đăng nhập không tồn tại';
    if (user.Available == 0) err_message = 'Tài khoản hiện đang không kích hoạt'
    if (user === null || user.Available == 0) {
        return res.render('vwAccount/login', {
            layout: false,
            err_message: err_message,
        })
    }

    const ret = bcrypt.compareSync(req.body.password, user.Password);
    if (ret === false) {
        return res.render('vwAccount/login', {
            layout: false,
            err_message: 'Invalid password!'
        })
    }

    delete user.Password;
    delete user.Permission;
    req.session.isWriter = (user.PenName != null);
    req.session.auth = true;
    req.session.authUser = user;
    const url = req.session.retUrl || '/';
    res.redirect(url);
})

router.post('/logout', auth, async function(req, res) {
    req.session.auth = false;
    req.session.authUser = null;
    req.session.retUrl = '';
    const url = req.headers.referer || '/';
    res.redirect(url);
})

router.get('/forget', function(req, res){
    res.render('vwAccount/forget', {
        layout: false
    });
})

router.post('/forget', async function(req, res){
    const user = await userModel.findByUsername(req.body.username);
    console.log(user);
    if (user == null){
        return res.render('vwAccount/forget', {
            layout: false,
            err_message: 'Tên tài khoản không tồn tại'
        })
    }
    var otp = otpGenerator.generate(6, {alphabets:false, upperCase:false, specialChars:false});
    var mailOptions = {
        from: 'longlcqt@gmail.com',
        to: user.Email,
        subject: 'Báo điện tử - Mã OTP để reset lại mật khẩu',
        html: `Chào <b>${user.Name}</b>,\n
Bạn đã <b>yêu cầu</b> làm mới mật khẩu, một mã OTP đã được gửi tới cho bạn với email ${user.Email} \n
<h3> Mã OTP: ${otp} <h3>\n
<b> Thân ái,\n
Team Báo điện tử </b>`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
    console.log("update available:", await userModel.updateAvailable(user.UserID, 0));
    await userModel.updateOTP(user.UserID, otp);
    // console.log(otp);
    res.redirect('/account/confirm');
})

router.get('/confirm', function(req, res){
    res.render('vwAccount/confirm', {
        layout: false
    });
})

router.post('/confirm', async function(req, res){
    const user = await userModel.findByUsername(req.body.username);
    // console.log("check otp: ", user.OTP == req.body.OTP)
    if (user.Available == 1){
    return res.render('vwAccount/confirm', {
        layout: false,
        err_message: 'Tài khoản không yêu cầu làm mới mật khẩu',
        user: user
    })
    }
    if (user.OTP == req.body.OTP){
        return res.redirect('/account/reset');
    }
    return res.render('vwAccount/confirm', {
        layout: false,
        err_message: 'Mã OTP không chính xác',
        user: user
    })
})

router.get('/reset', function(req, res){
    res.render('vwAccount/reset', {
        layout: false
    });
})

router.post('/reset', async function(req, res){
    const user = await userModel.findByUsername(req.body.username);
    const hash = bcrypt.hashSync(req.body.password, 10);
    await userModel.updatePassword(user.UserID, hash);
    await userModel.updateAvailable(user.UserID, 1);
    res.redirect('login');
})

module.exports = router;