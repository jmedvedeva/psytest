const { remote } = require('electron')

const currentWindow = remote.getCurrentWindow()

signin_user_btn.onclick = function() { 
    currentWindow.loadFile('src/profile_view.html')
}

// signin_psy_btn.onclick = function() { 
//     currentWindow.loadFile('src/testing2_view.html')
// }
