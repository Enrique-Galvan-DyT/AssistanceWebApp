
function login() {
    
    // Inicializar un objeto vacío para almacenar los datos del formulario
    var userFormLogin = {};

    // Recorrer todos los campos del formulario
    $(document.querySelector('#submitLogin').closest('form').querySelectorAll('input')).each(function() {
        // Obtener el nombre del campo y su valor
        var fieldName = $(this).attr('name');
        var fieldValue = $(this).val();

        // Agregar el campo al objeto userFormLogin
        userFormLogin[fieldName] = fieldValue;
    });
    
    // Enviar los datos a través de AJAX
    $.ajax({
        url: post_login_Route,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(userFormLogin),
        success: function(response) {
            // Manejar la respuesta del servidor aquí
            console.log(response);
            if(response.Success){
                setCookie("DataUser", response.value.tokenUser, 5)
                user = response.value

                console.log(getCookie("DataUser"))
                showUserInfo()
                // Ejecutar la acción después de 2 segundos
                setTimeout(loadPartialView("Schedule/schedule", document.querySelector(".main")), 2000); // 2000 milisegundos = 2 segundos
            }else{
                //deleteCookie("DataUser")
                console.log(getCookie("DataUser"))
            }
        toastFill(response)
        },
        error: function(error) {
            // Manejar errores de AJAX aquí
            setToast(true, error.responseJSON.Message, "danger")
            
            deleteCookie("DataUser")
        },
        complete: function() {
          // Desbloquear el formulario cuando la solicitud finaliza (ya sea éxito o error)
          desbloquearFormulario();
        }
    });
}

function verifyUserData() {
    let token = getCookie("DataUser");
    if(token != null){
        // Enviar los datos a través de AJAX
        $.ajax({
            url: post_verifyUser_Route + token,
            method: 'POST',
            success: function(response) {
                // Manejar la respuesta del servidor aquí
                user = JSON.parse(JSON.stringify(response.value))
                console.log(user);
                if(response.Success){
                    //console.log(token)
                    showUserInfo()
                }else{
                    deleteCookie("DataUser")
                    console.log(getCookie("DataUser"))
                    loadPartialView("Users/login", document.querySelector(".main"));
                }
                // Ejecutar la acción después de 2 segundos
                setTimeout(loadPartialView("Schedule/schedule", document.querySelector(".main")), 2000); // 2000 milisegundos = 2 segundos
                toastFill(response)
            },
            error: function(error) {
                // Manejar errores de AJAX aquí
                deleteCookie("DataUser")
                setToast(true, error.responseJSON.Message, "danger")
            }
        });
    }else{
        showUserInfo()
        tokenError()
    }
}

function showUserInfo() {
    document.querySelector('.user_enrollment').innerHTML = user.Fullname;   
    document.querySelector('.user_role').innerHTML = user.Role + " options";  
    document.querySelector('.user_last_register').innerHTML = '<span class="text-primary">Last attendance</span>: ' + user.LastRegister;  
    
    document.querySelectorAll('.placeholder').forEach(placeholder => {
        placeholder.classList.remove('placeholder')
    });
}

function Logout() {
    user = {
        Fullname: "Login to see your fullname",
        Role: "Login to see your role",
        LastRegister: "Login to see your last assistance",
        tokenUser: "No token found."
    }
    showUserInfo()
    closeMenu()
    deleteCookie("DataUser")
    tokenDeleted();
}


function bloquearFormulario() {
    // Bloquear el formulario deshabilitando los campos y el botón de envío
    $('form :input').prop('disabled', true);
    $('#submitLogin').prop('disabled', true);
  }
  
  function desbloquearFormulario() {
    // Desbloquear el formulario habilitando los campos y el botón de envío
    $('form :input').prop('disabled', false);
    $('#submitLogin').prop('disabled', false);
  }