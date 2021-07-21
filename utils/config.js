const Config = {
    PERMISSION: {
        GUEST: 0,
        SUBSCRIBER: 1,
        WRITER: 2,
        EDITOR: 3,
        ADMIN: 4
    },
    ARTICLE_STATE: {
        PUBLISHED: 0,
        PENDING: 1,
        DENIED: 2,
        APPROVED: 3,
    }
}

module.exports = Config;