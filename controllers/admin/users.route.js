const express = require("express");
const router = express.Router();
const moment = require('moment');
const userModel = require("../../models/user.model");
const Config = require("../../utils/config");

function getRole(permission) {
    switch (permission) {
        case Config.PERMISSION.ADMIN:
            return "Quản trị viên";
        case Config.PERMISSION.EDITOR:
            return "Biên tập viên";
        case Config.PERMISSION.WRITER:
            return "Phóng viên";
        case Config.PERMISSION.SUBSCRIBER:
            return "Độc giả";
        case Config.PERMISSION.GUEST:
            return "Độc giả vãn lai";
    }
}

router.use(async function (req, res, next) {
    const adminManagement = res.locals.adminManagement;
    adminManagement.forEach(element => {
        if (element.link == "users")
            element.isActive = true;
        else
            element.isActive = false;
    });
    next();
})

// ========= Xem danh sách người dùng ==========
router.get("/", async function (req, res) {
    const userList = await userModel.all();
    userList.forEach(element => {
        element.role = getRole(element.Permission);
    });
    res.render("vwAdmin/users/users.hbs", {
        layout: "admin.hbs",
        userList: userList,
    })
});

router.get("/:UserID", async function (req, res) {
    const user = await userModel.findByUserID(req.params.UserID);
    if (user === null)
        return res.sendFile("./404.html");
    user.role = getRole(user.Permission);
    user.DOB = moment(user.DOB, 'YYYY-MM-DD').format('DD-MM-YYYY');
    if (user.ExpiredDate != null)
        user.ExpiredDate = moment(user.DOB, 'YYYY-MM-DD').format('DD-MM-YYYY');

    res.render("vwAdmin/users/detail.hbs", {
        layout: "admin.hbs",
        user: user,
        isEditor: user.Permission == Config.PERMISSION.EDITOR,
        isAdmin: user.Permission == Config.PERMISSION.ADMIN,
        isSubscriber: user.Permission == Config.PERMISSION.SUBSCRIBER,
    })
});

// ========= Gia hạn cho độc giả ============
router.get("/:UserID/subscriber-extend", async function (req, res) {
    const user = await userModel.findByUserID(req.params.UserID);
    if (user === null)
        return res.sendFile("404.html");
    if (user.Permission != Config.PERMISSION.SUBSCRIBER || user.ExpiredDate == null)
        return res.redirect("/:UserID");
    user.ExpiredDate = moment(user.DOB, 'YYYY-MM-DD').format('DD-MM-YYYY');

    res.render("vwAdmin/users/subscriber-extend.hbs", {
        layout: "admin.hbs",
        user: user,
    })
})


router.post("/:UserID/subscriber-extend", async function (req, res) {
    const subsciberID = req.params.id;
    const ExpiredDate = moment(req.body.DateOfPublish, 'DD/MM/YYYY hh:mm').format('YYYY-MM-DD hh:mm:ss');
    await userModel.patchExpiredDate(subsciberID, ExpiredDate);
    res.redirect("/:UserID");
})



// ========= Phân chuyên mục cho biên tập viên ============


module.exports = router;