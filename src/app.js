// this file describes state of out application
const {Database} = require("./data")

class Application {
    constructor() {
        this.database = new Database('./data/database.sqlite')
        this.user = 'Студент/Писхолог'
        this.user_id = 'id'
    }
}

exports.Application = Application