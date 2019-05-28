// This file is required by the main.html file and will
// be executed in the renderer process for that window.
const { remote } = require('electron')

// current active window handler
const currentWindow = remote.getCurrentWindow()

let gctx = remote.getGlobal('gctx')
let db = gctx.database
let userID = gctx.activeUser.id

var lastTesting = db.getLastTesting(1, userID)
if (lastTesting != undefined) {
    var aCount = db.getNumberOfAnsweredQ(lastTesting.id)
    var qCount = db.getTestQuestionsNumber(1)
    if (aCount == qCount) {
        start_testing1_btn.style.display = "none";
        result_testing1_btn.style.display = "inline-block";
    }
}

instruction1_btn.onclick = function () {
    currentWindow.loadFile('src/instruction1_view.html')
}

instruction2_btn.onclick = function () {
    currentWindow.loadFile('src/instruction2_view.html')
}

start_testing1_btn.onclick = function () {
    currentWindow.loadFile('src/testing1_view.html')
}

start_testing2_btn.onclick = function () {
    currentWindow.loadFile('src/testing2_view.html')
}
result_testing1_btn.onclick = function () {
    currentWindow.loadFile('src/result.html')
}
