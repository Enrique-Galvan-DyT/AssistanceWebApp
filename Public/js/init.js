let user = {
    Fullname: "Login to see your fullname",
    Role: "Login to see your role",
    LastRegister: "Login to see your last assistance",
    tokenUser: "No token found."
}

let response = { 
    Success: false, 
    value: "", 
    Message: "", 
    Message_data: "", 
    Message_Classes: "", 
    Message_concat: false 
}

// Función para cargar una vista parcial
function loadPartialView(viewName, divElement = null, isAppend = false, item = null, functionName = null) {
    $.ajax({
        url: '/AssistanceWebApp/Views/' + viewName + '.html',
        method: 'GET',
        success: function(data) {
            divElement === null ? console.error('Elemento contenedor (divElement) no definido') : (isAppend ? $(divElement).append(data) : $(divElement).html(data));
        },
        error: function(error) {
            console.error('Error al cargar la vista parcial.');
        }
    });
}

function setToast(Success, Message, Message_Classes) {
    response.Success = Success
    response.Message = Message
    response.Message_Classes = Message_Classes
    toastFill(response)
}
function toastFill(response) {
    let toast = `<div class="toast align-items-center text-bg-${response.Message_Classes} border-0" role="alert" aria-live="assertive" aria-atomic="true">
                              <div class="d-flex">
                                <div class="toast-body">
                                  ${response.Message}
                                </div>
                                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                              </div>
                            </div>`
    // Agregar el toast al DOM
    $('.toast-container').append(toast);

    // Seleccionar el toast y inicializarlo
    let newToast = $('.toast:last');
    let bootstrapToast = new bootstrap.Toast(newToast[0]);

    // Mostrar el toast
    bootstrapToast.show();
}

// Selecciona todos los elementos con la clase "auto-close-alert"
let autoCloseAlerts = document.querySelectorAll('.alert');
// Cierra automáticamente todas las alertas después de 5 segundos
autoCloseAlerts.forEach(alertElement => {
    setTimeout(() => closeAlert(alertElement), 5000); // 5000 milisegundos (5 segundos)
});

// Función para cerrar una alerta
function closeAlert(alertElement) {
    $(alertElement).fadeOut();  // Remueve la clase 'show' para ocultar la alerta
}

function closeMenu() {
    // Obtener el elemento Offcanvas por su id
  let btnCerrarMenu = document.querySelectorAll('.btn-close');
  $(btnCerrarMenu).click();
}

function tokenError() {
    console.log(getCookie("DataUser"))
    setToast(false, "No se encontró un token para inicio de sesión automático.", "warning")
    if (!document.getElementById('login')) {
        loadPartialView("Users/login", document.querySelector(".main"));
    }
}

function tokenDeleted() {
    console.log(getCookie("DataUser"))
    setToast(true, "Se ha eliminado la sesión exitosamente.", "primary")
    if (!document.getElementById('login')) {
        loadPartialView("Users/login", document.querySelector(".main"));
    }
}
function setCookie(name, value, days = 1) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}
function getCookie(name) {
    let nameEQ = name + "=";
    let cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        while (cookie.charAt(0) == ' ') {
            cookie = cookie.substring(1, cookie.length);
        }
        if (cookie.indexOf(nameEQ) == 0) {
            return cookie.substring(nameEQ.length, cookie.length);
        }
    }
    return null;
}
function deleteCookie(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

function loadView(viewName) {
    loadPartialView(viewName, document.querySelector(".main"))
    closeMenu()
}

function getTodaysName() {
        // Crear un nuevo objeto de fecha
    let fechaActual = new Date();

    // Array con los nombres de los días de la semana
    let nombresDias = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

    // Obtener el número del día de la semana (0 para Domingo, 1 para Lunes, etc.)
    let numeroDia = fechaActual.getDay();

    // Obtener el nombre del día actual utilizando el número del día de la semana para acceder al array
    return nombresDias[numeroDia];
}

// Función para obtener el número de la semana del año
function getWeekNumber() {
    let fecha = new Date();    // Copiamos la fecha para no modificar la original
    // Obtener la fecha actual
    let fechaAux = new Date(fecha);
    // Establecemos el día 4 (jueves) de la primera semana del año como referencia
    fechaAux.setHours(0, 0, 0, 0);
    fechaAux.setDate(fechaAux.getDate() + 3 - (fechaAux.getDay() + 6) % 7);
    // Calculamos el número de días transcurridos desde el 4 de enero hasta la fecha dada
    let inicioAnio = new Date(fechaAux.getFullYear(), 0, 4);
    let milisegundosTranscurridos = fechaAux.getTime() - inicioAnio.getTime();
    // Calculamos el número de semanas redondeando hacia abajo
    return (1 + Math.floor(milisegundosTranscurridos / 86400000 / 7));
}
