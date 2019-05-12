require('./data')
const { remote } = require('electron')

// current active window handler
const currentWindow = remote.getCurrentWindow()

stop_testing_btn.onclick = function () {
    currentWindow.loadFile('src/test_select_view.html')
}
