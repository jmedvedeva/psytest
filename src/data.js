var sqlite3 = require('sqlite3').verbose();

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
        this.db = new sqlite3.Database(filename);
    }

    // reads available test IDs from database
    getTests(callback) {
        callback(["1", "2"])
    }

    // reads test with given ID from database
    getTest(id, callback) {
        callback({
            questions: [
                {
                    id: 1, 
                    text:"Вы дурак?", 
                    answers: [
                        {
                            id: 1,
                            text: 'Да',
                        },
                        {
                            id: 2,
                            text: 'Нет',
                        },
                    ],
                },
            ],
        })
    }
}

exports.Database = Database