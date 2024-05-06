function getSchedule() {
    let token = getCookie("DataUser");
    if (token != null) {
        $.ajax({
            url: post_search_user_schedule + token,
            method: 'POST',
            beforeSend: function() {
                if (document.querySelector('table tbody')) {
                    document.querySelector('table tbody').innerHTML = "";
                    let tr = `<tr>
                    <td colspan="6" class="text-muted text-center align-content-center bg-light">
                                    <div class="d-flex flex-column justify-content-center">
                                        <div class="spinner-grow text-violet d-flex mx-auto" role="status">
                                            <span class="visually-hidden">Loading...</span>
                                        </div>
                                        <div>
                                            Loading content.
                                        </div>
                                    </div>    
                                </td></tr>`
                    
                    document.querySelector('table tbody').innerHTML += tr;
                }  
            },
            success: function(response) {
                // Manejar la respuesta del servidor aquí
                let schedule = response.value
                console.table(schedule);
                /* 
                */
                if (document.querySelector('table tbody')) {
                    document.querySelector('table tbody').innerHTML = "";
                    if(response.Success){
                        // Objeto para almacenar la información por hora y día
                        var horasUnicas = {};
                        // Iterar sobre los datos para almacenar la información por hora y día
                        schedule.forEach(function(item) {
                            if (!horasUnicas[item.Time]) {
                                horasUnicas[item.Time] = {
                                    monday: "",
                                    tuesday: "",
                                    wednesday: "",
                                    thursday: "",
                                    friday: ""
                                };
                            }
                            horasUnicas[item.Time][item.Day] = {
                                Module: item.Module || "",
                                has_Teacher_Attendance: item.has_Teacher_Attendance || false,
                                has_Student_Attendance: item.has_Student_Attendance || false,
                                Teacher: item.Teacher || ""
                            };
                        });
    
                        // Obtener las claves (horas únicas) del objeto horasUnicas y convertirlas en un array
                        var horasArray = Object.keys(horasUnicas);
    
                        // Iterar sobre las horas únicas y sus siguientes para generar las filas de la tabla
                        for (var i = 0; i < horasArray.length - 1; i++) {
                            var horaActual = horasArray[i];
                            var horaSiguiente = horasArray[i + 1];
                            let descanso = false;
    
                            // Generar el contenido de la fila utilizando la cadena HTML
                            let tr = `<tr>
                                        <td class="text-muted">
                                        ${horaActual} 
                                        <hr/>
                                        ${horaSiguiente} 
                                        </td>`;
                            for (var dia in horasUnicas[horaActual]) {
                                if (horaActual == "10:00:00") {
                                    if (!descanso) {
                                        descanso = !descanso;
                                        tr += `<td colspan="5" class="text-muted text-center align-content-center bg-light">DESCANSO</td>`;
                                    }
                                } else {
                                    if (horasUnicas[horaActual].hasOwnProperty(dia)) {
                                        let materia = horasUnicas[horaActual][dia];
                                        if (materia.Module != "") {
                                            let info = horasUnicas[horaActual][dia];
                                            let cellContent = `<span class="fw-medium">${materia.Module}</span><br>`;
                                            cellContent += `<small class="text-muted"><span class="text-primary">Teacher</span>: <span class="fw-light">${info.Teacher}</span></small><br>`;
                                            cellContent += `<div class="d-flex gap-2">`
                                            if (info.has_Teacher_Attendance) {
                                                cellContent += `<i class="bi bi-check text-primary" title="Se hizo pase de lista."></i>`
                                            }
                                            if (info.has_Student_Attendance) {
                                                cellContent += `<i class="bi bi-check-all text-pink" title="Marcaste asistencia."></i>`
                                            }
                                            cellContent += `</div>`
                                            tr += `<td>${cellContent}</td>`;
                                        } else {
                                            tr += `<td></td>`;
                                        }
                                    }
                                }
                            }
                            tr += `</tr>`;
                            document.querySelector('table tbody').innerHTML += tr;
                        }
                    }
                }
                toastFill(response)
            },
            error: function(error) {
                // Manejar errores de AJAX aquí
                console.error("Error en la petición.");
            }
        });
    }else{
        tokenError()
    }
}

//Continuar esta sección