const db = require('../models');
const minimist = require('minimist')
const promptly = require('promptly')
const { comparePassword } = require('../lib/crypto')
const argv = minimist(process.argv.slice(2))
const promptPassword = () => promptly.password('Enter your password: ', { replace: '*' })

module.exports = {
    async createUser() {
        const { user } = argv
        const password = await promptPassword()
        return db.User.create({
            username: user,
            password
        })
    },

    async listUsers() {
        return db.User.findAndCountAll()
    },

    async authenticate(username, pass) {
        const user = await db.User.findOne({ where: { username }});
        if (!user) return false

        const hashed = user.password

        if (await comparePassword(pass, hashed)) {
            return user
        }

        return null;


    }
}