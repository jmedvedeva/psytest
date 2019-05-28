require('./data')
const { remote } = require('electron')

// current active window handler
const currentWindow = remote.getCurrentWindow()

// we are processing test with ID = 1
let testID = 2
// global application context
let gctx = remote.getGlobal('gctx')
let db = gctx.database
let userID = gctx.activeUser.id


step2.style.display = 'none';
step3.style.display = 'none';

step2_btn.onclick = function () {
    step1.style.display = 'none';
    step2.style.display = 'block';
    setTimeout(function () {
        step2.style.display = 'none';
        step3.style.display = 'block';
    }, 3 * 1000)
}
back_btn.onclick = function () {
    currentWindow.loadFile('src/test_select_view.html')
}
exit_btn.onclick = function () {
    currentWindow.loadFile('src/test_select_view.html')
}