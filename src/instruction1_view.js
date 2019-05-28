// This file is required by the main.html file and will
// be executed in the renderer process for that window.
const { remote } = require('electron')

// current active window handler
const currentWindow = remote.getCurrentWindow()

let gctx = remote.getGlobal('gctx')
let db = gctx.database


TextInstruction.innerHTML = db.getInstruction(1);

back_btn.onclick = function () {
    currentWindow.loadFile('src/test_select_view.html')
}
