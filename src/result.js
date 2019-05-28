// This file is required by the main.html file and will
// be executed in the renderer process for that window.
const { remote } = require('electron')

// current active window handler
const currentWindow = remote.getCurrentWindow()

let gctx = remote.getGlobal('gctx')
let db = gctx.database
let userID = gctx.activeUser.id

let lastTesting = db.getLastTesting(1, userID)
let params = db.getTestParameters(1)


function makeResultRow(parametr, score) {

    return `
    <div class="row">
    <div class="col1" style='padding:0'>
        <p style="padding:0 0 0 13%">${parametr}</p>
    </div>
    <div class="col2" style='padding:0'>
        <p style="padding:0 0 0 13%">${score}</p>
    </div>
    </div>`

}

function makeDescriptionRow(parametr, description) {
    return `
    <div class="row">
    <h3 style="padding:0 0 0 13%">${parametr}</h3>
</div>
<div class="row">
    <p style="padding:0 0 0 13%">${description}</p>
</div>
    `
}

for (var i = 0; i < params.length; i++) {
    let scoreRow = db.getResult(lastTesting.id, params[i].id)
    resultDiv.insertAdjacentHTML('beforeend', makeResultRow(params[i].name, scoreRow.value_result))

    descriptionDiv.insertAdjacentHTML('beforeend', makeDescriptionRow(params[i].name, params[i].text_result))

}
back_btn.onclick = function () {
    currentWindow.loadFile('src/test_select_view.html')
}
