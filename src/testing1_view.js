require('./data')
const { remote } = require('electron')

// current active window handler
const currentWindow = remote.getCurrentWindow()

// we are processing test with ID = 1
let testID = 1
// global application context
let gctx = remote.getGlobal('gctx')
let db = gctx.database
let userID = gctx.activeUser.id
console.log("User = ", userID)

stop_testing_btn.onclick = function () {
    currentWindow.loadFile('src/test_select_view.html')
}
var currentQ = undefined //переменная, указывающая на текущий вопрос

// let totalQuestionCount = db.getTestQuestionsNumber(testID)
// console.log("All q. cnt = ", totalQuestionCount)

// let testParameters = db.getTestParameters(testID)
// console.log("Test parameters = ", testParameters)

// let firstQ = db.getQuestion(testID, 1)
// console.log("First question = ", firstQ)

var lastTesting = db.getLastTesting(testID, userID)

if (lastTesting == undefined) {
    db.startNewTesting(testID, userID)
    lastTesting = db.getLastTesting(testID, userID)
    currentQ = db.getQuestion(testID, 1)
    db.saveUserTestAnswer({
        testingID: lastTesting.id,
        questionID: currentQ.id,
        answerID: undefined,
        answerTime: undefined,
        answer: undefined,
    })
} else {
    //Найти последний неотвеченный вопрос и записать 

    currentQ = db.getLastNotAnsweredQuestion(lastTesting.id)
}

function showQuestion() {
    Qtext.innerHTML = currentQ.num
    aswer1L.innerHTML = currentQ.answers[0].text
    aswer2L.innerHTML = currentQ.answers[1].text
    answer1Input.checked = false
    answer2Input.checked = false
}

showQuestion()
var startTime = new Date();

answer_btn.onclick = function () {
    if (answer1Input.checked == false && answer2Input.checked == false) {
        alert("Выберите ответ")
        return
    }
    var answer = undefined
    if (answer1Input.checked == true) {
        answer = currentQ.answers[0]
    } else {
        answer = currentQ.answers[1]
    }
    var currentTime = new Date();
    var deltaTime = (currentTime - startTime) / 1000;
    db.saveUserTestAnswer({
        testingID: lastTesting.id,
        questionID: currentQ.id,
        answerID: answer.id,
        answerTime: deltaTime,
        answer: undefined,
    })

    var currentR = db.getResult(lastTesting.id, answer.paramID)
    currentR.value_result = currentR.value_result + 1
    db.saveResult(currentR)

    var nextQnum = currentQ.num + 1
    currentQ = db.getQuestion(testID, nextQnum)
    if (currentQ == undefined) {

        currentWindow.loadFile('src/test_select_view.html')
        return
    }
    startTime = new Date();
    showQuestion()
    db.saveUserTestAnswer({
        testingID: lastTesting.id,
        questionID: currentQ.id,
        answerID: undefined,
        answerTime: undefined,
        answer: undefined,
    })
}