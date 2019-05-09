// This file is required by the main.html file and will
// be executed in the renderer process for that window.
const { remote } = require('electron')

// current active window handler
const currentWindow = remote.getCurrentWindow()

start_testing_btn.onclick = function() { 
    currentWindow.loadFile('src/testing_view.html')
}
