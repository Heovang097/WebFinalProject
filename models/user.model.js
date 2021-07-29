const db = require('../utils/db');

module.exports = {
    all() {
        return db('users');
    },

    add(user) {
        return db('users').insert(user);
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
    
    async getEditorBranchesByID(editorID) {
        const sql = `SELECT * FROM branches, branch_user RIGHT JOIN users on EditorID = UserID 
        where users.UserID = ${editorID} AND branches.BranchID = branch_user.BranchID`;
        const rows = await db.raw(sql);
        if (rows[0].length == 0)
            return null;
        return rows[0];
    },

    async patchExpiredDate(id, ExpireDate) {
        return db('users').where('UserID', id).update("ExpiredDate", ExpireDate);
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