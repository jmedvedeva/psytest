require('./data')
const { remote } = require('electron')

// database is used to access test data and other stuff stored in database
let database = remote.getGlobal('database')

database.getTest('1', function(test) {
    console.log(test)
})

// current active window handler
const currentWindow = remote.getCurrentWindow()

stop_testing_btn.onclick = function() { 
    currentWindow.loadFile('src/main_view.html')
}
