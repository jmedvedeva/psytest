var SqliteDB = require('better-sqlite3');

// User is a test respondent
class User {
    constructor(name, surname, midlname, sex, born, email, id) {
        this.name = name
        this.surname = surname
        this.midlname = midlname
        this.sex = sex
        this.born = born
        this.email = email
        this.id = id
    }
}

// Question is a single test question
class Question {
    // constructs new question
    //
    // @param {answers} [Answer]
    constructor(id, num, text, answers) {
        this.id = id
        this.num = num // ???
        this.text = text
        this.answers = answers // list of Answers
    }
}

// Answer is a single answer for a single question
class Answer {
    constructor(id, num, text, image, score, paramID) {
        this.id = id // answer global ID
        this.num = num // answer number within single question ?
        this.text = text
        this.image = image
        this.score = score // how many points this answer adds to the parameter total score
        this.paramID = paramID // id of the parameter which is used to score this answer
    }
}

// Parameter is a single parameter to score the answer
class Parameter {
    constructor(id, name, minVal, maxVal, description) {
        this.id = id
        this.name = name
        this.minValue = minVal
        this.maxValue = maxVal
        this.text_result = description
    }
}

// Testing represents user try to pass single test
class Testing {
    constructor(id, userID, testID, testingDate) {
        this.id = id
        this.userID = userID
        this.testID = testID
        this.testingDate = testingDate
    }
}

// AnswerProtocol is a single respondent answer description
class AnswerProtocol {
    constructor(id, testingID, questionID, answerID, answerTime, answer) {
        this.id = id
        this.testingID = testingID
        this.questionID = questionID
        this.answerID = answerID
        this.answerTime = answerTime
        this.answer = answer
    }
}

class Database {
    constructor(filename) {
        this.db = new SqliteDB(filename, { verbose: console.log });
    }

    // findUser searches for user by specified email in the database
    //
    // @param {email} string
    findUser(email) {
        var row = this.db.
            prepare('SELECT * FROM respondent WHERE email=?').
            get(email);
        if (row == undefined) {
            return undefined;
        }
        return new User(row.name_resp, row.surname, row.midlename, row.sex, row.born, row.email, row.id)
    }

    // createUser creates specified user in the database
    //
    // @param {user} User
    createUser(user) {
        this.db.
            prepare('INSERT INTO respondent (surname, name_resp,midlename, sex,born,email) VALUES (?, ?, ?, ?, ?, ?)').
            run(user.surname, user.name, user.midlname, user.sex, user.born, user.email);
    }

    // getTestQuestionsNumber returns number of questions in a test
    getTestQuestionsNumber(testID) {
        var row = this.db.prepare('SELECT count(*) as cnt FROM question WHERE id_test = ?').get(testID)
        return row.cnt
    }

    // getQuestion reads question with given number with answers for specified test
    //
    // @return {Question}
    getQuestion(testID, qNum) {
        var qRow = this.db.
            prepare('SELECT * FROM question WHERE id_test = ? AND num_question = ?').
            get(testID, qNum);
        if (qRow == undefined) {
            return undefined
        }
        var answerRows = this.db.
            prepare('SELECT * FROM answer WHERE id_test = ? AND id_question = ?').
            all(testID, qRow.id)

        var answers = []
        for (var i = 0; i < answerRows.length; i++) {
            var a = answerRows[i]
            answers.push(new Answer(a.id, a.id_test, a.answer, a.answer_file, a.score, a.id_param))
        }

        return new Question(qRow.id, qRow.num_question, qRow.question, answers)
    }

    // getTestParameters reads the list of parameters for specified test
    getTestParameters(testID) {
        var rows = this.db.
            prepare('SELECT * FROM param WHERE id_test = ?').
            all(testID)

        var parameters = []
        for (var i = 0; i < rows.length; i++) {
            var p = rows[i]
            parameters.push(new Parameter(p.id, p.parametr, p.min_value, p.max_value, p.text_result))
        }

        return parameters
    }


    // startTesting creates testing in the database
    // testing_date is set to now()
    startNewTesting(testID, userID) {
        var now = new Date()
        var formattedDate = now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate() + " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds()

        this.db.
            prepare('INSERT INTO testing (id_respondent, id_test, testing_date) VALUES (?, ?, ?)').
            run(userID, testID, formattedDate)
    }

    // getLastTesting returns last user testing (last test try)
    // @return {Testing}
    getLastTesting(testID, userID) {
        var row = this.db.
            prepare('SELECT * FROM testing WHERE id_test = ? AND id_respondent = ? ORDER BY testing_date DESC LIMIT 1').
            get(testID, userID)

        if (row == undefined) {
            return undefined
        }

        return new Testing(row.id, row.id_respondent, row.id_test, row.testing_date)
    }

    // getTestingAnswers reads answer protocols of the particular testing
    // @return {[AnswerProtocol]}
    getTestingAnswers(testingID) {
        var rows = this.db.
            prepare('SELECT * FROM protocol WHERE id_testing = ?').
            get(testingID)

        let userAnswers = []
        for (var i = 0; i < rows.length; i++) {
            let a = rows[i]
            userAnswers.push(new AnswerProtocol(a.id, a.id_testing, a.id_question, a.id_answer, a.time_answer, a.answer))
        }
        return userAnswers
    }

    // saveUserTestAnswer saves given user answer protocol to database
    //
    // @param {a} AnswerProtocol
    saveUserTestAnswer(a) {
        var p = this.db.prepare('SELECT * FROM protocol WHERE id_testing=? AND id_question=?').get(a.testingID, a.questionID)
        if (p == undefined) {
            this.db.
                //подготовить запрос
                prepare('INSERT INTO protocol (id_testing, id_question, id_answer, time_answer, answer) VALUES (?, ?, ?, ?, ?)').
                //исполнить запрос с параметрами
                run(a.testingID, a.questionID, a.answerID, a.answerTime, a.answer)
        } else {
            this.db.prepare('UPDATE protocol SET id_answer=?, time_answer=?, answer=? WHERE id_testing=? AND id_question=?').
                run(a.answerID, a.answerTime, a.answer, a.testingID, a.questionID)
        }
    }

    getNumberOfAnsweredQ(id_testing) {
        var countA = this.db.prepare("SELECT count(*) as c FROM protocol WHERE id_testing=? AND id_answer is not NULL").
            get(id_testing)
        return countA.c
    }

    getLastNotAnsweredQuestion(tID)//testing id
    {
        var row = this.db.prepare('SELECT id_question FROM protocol WHERE id_testing=? AND id_answer is NULL ').get(tID)
        var qrow = this.db.prepare('SELECT id_test, num_question FROM question WHERE id=?').get(row.id_question)
        return this.getQuestion(qrow.id_test, qrow.num_question)
    }

    getInstruction(tId) {
        var row = this.db.prepare('SELECT help FROM test WHERE id=?').get(tId)
        return row.help
    }

    getResult(testingID, paramID) {
        var row = this.db.prepare('SELECT * FROM result WHERE id_testing=? AND id_param=?').get(testingID, paramID)
        if (row == undefined) {
            return {
                id_testing: testingID,
                id_param: paramID,
                value_result: 0,
            }
        }
        return row
    }

    saveResult(result) {
        var row = this.db.prepare('SELECT * FROM result WHERE id_testing=? AND id_param=?').
            get(result.id_testing, result.id_param)
        if (row == undefined) {
            this.db.prepare('INSERT INTO result (id_testing, id_param, value_result) VALUES (?, ?, ?)').
                run(result.id_testing, result.id_param, result.value_result)
        } else {
            this.db.prepare('UPDATE result SET value_result=? WHERE id_testing=? AND id_param=?').
                run(result.value_result, result.id_testing, result.id_param)
        }
    }

}



exports.Database = Database
exports.AnswerProtocol = AnswerProtocol
exports.User = User
