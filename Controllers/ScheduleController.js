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
                
                //let schedule = response.value.simpleSchedules
                let schedule = combinarHorariosYClases(response.value.Hours, response.value.simpleSchedules)
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
                                    Monday: "",
                                    Tuesday: "",
                                    Wednesday: "",
                                    Thursday: "",
                                    Friday: ""
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
                                            //
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
                setToast(true, error.responseJSON.Message, "danger")
            }
        });
    }else{
        tokenError()
    }
}


function combinarHorariosYClases(horarios, clases) {
    // Crear un objeto para almacenar el resultado
    let resultado = [];

    // Iterar sobre los días de la semana
    const diasSemana = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    diasSemana.forEach(dia => {
        // Iterar sobre todas las horas
        horarios.forEach(horario => {
            // Verificar si hay una clase programada para esta hora y día
            let clase = clases.find(c => c.Time === horario.Time && c.Day === dia);

            // Agregar la clase o una hora vacía al resultado
            resultado.push({
                Time: horario.Time,
                TimeName: horario.Name,
                Day: dia,
                Module: clase ? clase.Module || "" : "",
                Teacher: clase ? clase.Teacher || "" : "",
                has_Teacher_Attendance: clase ? clase.has_Teacher_Attendance || false : false,
                has_Student_Attendance: clase ? clase.has_Student_Attendance || false : false,
                Teacher_Attendance_date: clase ? clase.Teacher_Attendance_date || "0001-01-01T00:00:00" : "0001-01-01T00:00:00",
                Student_Attendance_date: clase ? clase.Student_Attendance_date || "0001-01-01T00:00:00" : "0001-01-01T00:00:00"
            });
        });
    });

    return resultado;
}
