const db = require('../utils/db');

module.exports = {
    all() {
        return db('users');
    },

    add(user) {
        return db('users').insert(user);
    },

    async isPremium(UserID) {
        const rows = await db('users').where('UserID', UserID).whereRaw('ExpiredDate > NOW()');
        if (rows.length === 0)
            return false
        return true
    },

    extendPremium(UserID) {
        const query = `update users
        set ExpiredDate = DATE_ADD(NOW(), INTERVAL 7 DAY)
        where UserID = ${UserID}`
        return db.raw(query);
    },

    async findByUsername(username) {
        const rows = await db('users').where('Username', username);
        if (rows.length === 0)
            return null;
        return rows[0];
    },

    async findByUserID(UserID) {
        const rows = await db('users').where('UserID', UserID);
        if (rows.length === 0)
            return null;
        return rows[0];
    },

    async getPass(UserID, pass) {
        const rows = await db('users').where('UserID', UserID).select('Password')
        if (rows.length === 0) {
            return null;
        }
        return rows[0]
    },

    updateAvailable(id, state) {
        return db('users').where('UserID', id).update({ Available: state });
    },
    updateOTP(id, otp) {
        return db('users').where('UserID', id).update('OTP', otp);
    },
    updatePassword(id, pass) {
        return db('users').where('UserID', id).update('Password', pass);
    },
    updateInfo(id, user) {
        return db('users').where('UserID', id).update(user)
    }
};