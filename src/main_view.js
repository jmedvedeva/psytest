// This file is required by the main.html file and will
// be executed in the renderer process for that window.
const { remote } = require('electron')

// current active window handler
const currentWindow = remote.getCurrentWindow()

start_testing1_btn.onclick = function() { 
    currentWindow.loadFile('src/testing1_view.html')
}

start_testing2_btn.onclick = function() { 
    currentWindow.loadFile('src/testing2_view.html')
}
