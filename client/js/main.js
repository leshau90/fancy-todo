const BACKEND = `http://localhost:3333`
$(document).ready(function () {
    $('.sidenav').sidenav();
    $('.collapsible').collapsible({
        accordion: false
    });
    $('.datepicker').datepicker();
    $('.fixed-action-btn').floatingActionButton();
    $(`.editTodo`).click(handleEditTodo)
    $('#sending').hide()
    $('.modal').modal()

    $('.logout-button').click(clearToken)

    loggedOutMode()
    if (localStorage.todo_token) loggedInMode()
    $('#form-login').submit(handleLogin)
    $('#form-register').submit(handleRegister)


});

function onGoogleSignIn() {
    let googleUser = gapi.auth2.getAuthInstance().currentUser.get();
    let profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This
}

function clearToken() {
    localStorage.clear()
    console.log('clicked logout')
    var auth2 = gapi.auth2.getAuthInstance();

    // console.log('++++++++++++++++++++++++++++++++')
    // console.log('gapi')
    // console.log(auth2)
    // console.log('+++++++++++++++++++++++++++++++')

    auth2.signOut().then(function () {
        console.log('User signed out.');
    });

    M.toast({ html: 'Your credentials have been revoked' })
    loggedOutMode()
}

function onGoogleSignIn() {
    let googleUser = gapi.auth2.getAuthInstance().currentUser.get();
    let token = googleUser.getAuthResponse().id_token

    console.log(token)


    axios
        .post(`${BACKEND}/auth/google-login`, { token })
        .then((response) => {
            if (response.status == 201) {
                M.toast({ html: 'welcome' })
                localStorage.setItem('todo_user', JSON.stringify(response.data.user))
                localStorage.setItem('todo_token', response.data.token)
                loggedInMode();
            } else {
                M.toast({ html: 'crazy error' })
                console.log(response);
                clearToken();
                // loggedOutMode()
            }

        })
        .catch(err => {
            console.log(err);
            M.toast({ html: 'Error while attempting to use Google credential' })
            clearToken();
        })

    $('#login-close').trigger('click')
}

function loggedOutMode() {

    $('.register-button').show()
    $('.login-button').show()

    $('.logout-button').hide()


}

function loggedInMode() {
    $('.register-button').hide()
    $('.login-button').hide()


    $('.logout-button').show()
}

function handleLogin(e) {

    e.preventDefault()
    let body = {
        email: $('#login-email').val(),
        password: $('#login-password').val()
    }

    $('#login-email').val('')
    $('#login-password').val('')

    axios.post(`${BACKEND}/auth/login`, body)
        .then(response => {
            if (response.status === 201) {
                // console.log(`~~~~~~~~~~~~~~~~~`)
                // console.log('succesful login')
                // console.log(`~~~~~~~~~~~~~~~~~`)
                M.toast({ html: 'welcome' })
                localStorage.setItem('todo_user', JSON.stringify(response.data.user))
                localStorage.setItem('todo_token', response.data.token)
                loggedInMode();
            } else {
                M.toast({ html: 'check your password/email' })
            }
        })
        .catch(err => {
            M.toast({ html: `error ${err}` })
            $(`#debug`).text(JSON.stringify(err, null, 2))
        })

    $('#login-modal').closeModal()
    // $('#login-close').trigger('click')
}

function handleRegister(e) {

    e.preventDefault()
    let body = {
        name: $('#reg-name').val(),
        email: $('#reg-email').val(),
        password: $('#reg-password').val()
    }
    $('#reg-name').val('');
    $('#reg-email').val('');
    $('#reg-password').val('');
    axios.post(`${BACKEND}/auth/register`, body)
        .then(response => {
            if (response.status === 201) {
                M.toast({ html: 'your credential has been created succesfully!' })
            } else {
                M.toast({ html: 'problems happened, your credential creation cannot be processed' })
            }

        })
        .catch(err => {
            M.toast({ html: `error ${err}` })
            $(`#debug`).text(JSON.stringify(err, null, 2))

        })
    $('#register-modal').modal('hide')
    $('#register-close').trigger('click')
}

function handleEditTodo(e) {
    // e.preventDefault()
}
console.log('helloo there')