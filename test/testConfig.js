const mongoose = require('mongoose')
mongoose.promise = global.Promise

module.exports = {
    setupDB() {
        before(async () => {
            await mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true })
        })

        after(async () => {
            await mongoose.connection.close()
        })
    }
}
