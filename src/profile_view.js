const { remote } = require('electron')

const currentWindow = remote.getCurrentWindow()
let gctx = remote.getGlobal('gctx')

signin_btn.onclick = function () {
    var user = gctx.database.findUser(emailInput.value)

    if (user == undefined) {
        if (emailInput.value == '' || nameInput.value == '' || surnameInput.value == '' ||
            midlnameInput.value == '' || bornInput.value == '' || (femaleInput.checked == false &&
                maleInput.checked == false)) {
            errorText.innerHTML = "Не все поля введены";
        } else {
            errorText.innerHTML = "";
            var activeUser = {
                email: emailInput.value,
                name: nameInput.value,
                surname: surnameInput.value,
                midlname: midlnameInput.value,
                born: bornInput.value,
            }
            if (femaleInput.checked) {
                activeUser.sex = 'female';
            } else {
                activeUser.sex = 'male';
            }

            gctx.database.createUser(activeUser)
            gctx.activeUser = gctx.database.findUser(activeUser.email)
            currentWindow.loadFile('src/test_select_view.html')
        }
    } else {
        gctx.activeUser = user
        currentWindow.loadFile('src/test_select_view.html')
    }

}
// console.log(user)
back_btn.onclick = function () {
    currentWindow.loadFile('src/main_view.html')
}
