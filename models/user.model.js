const db = require('../utils/db');

function branchesDivivedByEditorID(branches, editorID) {
    const managedBranchList = [];
    const unmanagedBranchList = [];
    editorID = parseInt(editorID);
    branches.forEach(element => {
        if (element["UserID"] != null && element["UserID"] === editorID)
            managedBranchList.push(element);
        else
        {
            unmanagedBranchList.push(element);
        }
    });
    return {
        managedBranchList: managedBranchList,
        managedBranchListIsEmpty: managedBranchList.length == 0,
        unmanagedBranchList: unmanagedBranchList,
        unmanagedBranchListIsEmpty: unmanagedBranchList.length == 0,
    }
}

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
        const sql = `SELECT branches.*,users.* 
        FROM branches left join branch_user on branches.BranchID = branch_user.BranchID 
        LEFT JOIN users on users.UserID = EditorID`;
        const rows = await db.raw(sql);
        if (rows[0].length == 0)
            return null;
        branchList = branchesDivivedByEditorID(rows[0], editorID);
        return branchList;
    },

    async patchExpiredDate(id, ExpireDate) {
        return db('users').where('UserID', id).update("ExpiredDate", ExpireDate);
    },

    assignBranchToEditor(userID, branchID) {
        return db('branch_user').insert({
            EditorID: userID,
            BranchID: branchID,
        });
    },

    delBranchFromEditor(userID, branchID) {
        return db("branch_user").where({
            EditorID: userID,
            BranchID: branchID,
        }).del();
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