var SqliteDB = require('better-sqlite3');

// var db = new sqlite3.Database('data/database.sqlite');
// db.serialize(function() {
// //   db.run("CREATE TABLE lorem (info TEXT)");

// //   var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
// //   for (var i = 0; i < 10; i++) {
// //       stmt.run("Ipsum " + i);
// //   }
// //   stmt.finalize();
//   db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
//       console.log(row.id + ": " + row.info);
//   });
// });

// db.close();


class Database {
    constructor(filename) {
        this.db = new SqliteDB(filename, { verbose: console.log });
    }

    findUser(email) {
        var row = this.db.prepare('SELECT * FROM respondent WHERE email=?').get(email);
        if (row == undefined) {
            return undefined;
        }
        return {
            name: row.name_resp,
            surname: row.surname,
            midlname: row.midlename,
            sex: row.sex,
            born: row.born,
            email: row.email,
            id: row.id,
        }
    }

    createUser(user) {
        this.db.
            prepare('INSERT INTO respondent (surname, name_resp,midlename, sex,born,email) VALUES (?, ?, ?,?,?,?)').
            run(user.surname, user.name, user.midlname, user.sex, user.born, user.email);
    }
}

exports.Database = Database