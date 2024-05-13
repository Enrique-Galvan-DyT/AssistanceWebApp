temp_dots = [];
try{
    const post_location_Route = env + "Locations/PostLocation?token="
    const delete_location_Route = env + "Locations/DeleteLocation?token="
        
    function allLocations() {
        let token = getCookie("DataUser");
        if (token != null) {
            $.ajax({
                url: post_all_locations_Route + token,
                method: 'POST',
                success: function(response) {
                    // Manejar la respuesta del servidor aquí
                    let locations = JSON.parse(JSON.stringify(response.value))
                    console.table(locations);
                    document.querySelector('#locations tbody').innerHTML = "";
                    
                    if(response.Success){
                        locations.forEach(att => {
                        let tr = `<tr>
                            <th>${att.Id_Location}</th>
                            <td>${att.Name}</td>
                            <td>${att.Coords}</td>
                            <td>${att.Color}</td>
                            <td>${att.Id_Merge}</td>
                            <td>${att.Is_Remote}</td>
                            <td>${att.Status}</td>
                            <td><button type="button" class="btn btn-sm btn-danger" onclick="deletePolygon(${att.Id_Location})">Delete</button></td>
                            </tr>`
                            document.querySelector('#locations tbody').innerHTML += tr;
                            let colors = att.Color.split(',')
                            let name = "";
                            
                            if (att.Name.includes('Edificio')) {
                                name += `<i class="bi bi-building fs-5 text-primary me-2"></i>`
                            }

                            if (att.Name.includes('CEIT')) {
                                name += `<i class="bi bi-buildings fs-5 text-primary me-2"></i>`
                            }

                            if (att.Name.includes('Cafetería')) {
                                name += `<i class="bi bi-cup-hot fs-5 text-primary me-2"></i>`
                            }

                            if (att.Name.includes('Rectoría', 'Vinculación')) {
                                name += `<i class="bi bi-mortarboard fs-5 text-primary me-2"></i>`
                            }

                            if (att.Name.includes('Autobús')) {
                                name += `<i class="bi bi-bus-front fs-5 text-primary me-2"></i>`
                            }

                            if (att.Name.includes('Cancha', 'Parque')) {
                                name += `<i class="bi bi-puzzle fs-5 text-primary me-2"></i>`
                            }

                            if (att.Name.includes('Dios')) {
                                name += `<i class="bi bi-fire fs-5 text-primary me-2"></i>`
                            }
                            
                            if (att.Name.includes('Boscosa', 'Árboles', 'Bosque')) {
                                name += `<i class="bi bi-tree fs-5 text-primary me-2"></i>`
                            }
                            
                            if (att.Name.includes('Battleroyal')) {
                                name += `<i class="bi bi-trophy fs-5 text-primary me-2"></i>`
                            }

                            if (att.Name.includes('Estacionamiento')) {
                                name += `<i class="bi bi-p-circle fs-5 text-primary me-2"></i>`
                            }
                            
                            if (att.Name.includes('casa')) {
                                name += `<i class="bi bi-house fs-5 text-primary me-2"></i>`
                            }
                            name += `<span class="text-muted fw-bold">${att.Name}</span>`;
                            createPolygon(constructLatLng(att.Coords), colors[0], colors[1], name);
                        });
                    }

                    if (!response.is_Allowed) {
                        let interactive_map = document.getElementById('map-locations')
                        interactive_map.parentElement.children[1].remove()
                        interactive_map.classList.remove('col-sm-6')
                        interactive_map.classList.add('col-sm-12')
                    }

                    if (locations.length > 0) {
                        toastFill(response)
                    }
                },
                error: function(error) {
                    // Manejar errores de AJAX aquí
                    deleteCookie("DataUser")
                    console.log(getCookie("DataUser"))
                    setToast(true, error.responseJSON.Message, "danger")
                    
                    loadPartialView("Users/login", document.querySelector(".main"));
                }
            });
        }else{
            tokenError()
        }
    }
    
    function deletePolygon(Id_Location) {
        let token = getCookie("DataUser");
        if (token != null) {
            $.ajax({
                url: delete_location_Route + token + "&Id_Location=" + Id_Location,
                method: 'POST',
                success: function(response) {
                    // Manejar la respuesta del servidor aquí
                    if(response.Success){
                        allLocations()
                    }
                    toastFill(response)
                },
                error: function(error) {
                    // Manejar errores de AJAX aquí
                    deleteCookie("DataUser")
                    console.log(getCookie("DataUser"))
                    setToast(true, error.responseJSON.Message, "danger")
                    
                    loadPartialView("Users/login", document.querySelector(".main"));
                }
            });
        }else{
            tokenError()
        }
    }
    
    function postPolygon() {
        let token = getCookie("DataUser");
        if (token != null) {
            // Construir el objeto con los datos del formulario
            var formData = {
                Name: document.getElementById('Name').value,
                Coords: document.getElementById('Coordinates').value,
                Id_Merge: document.getElementById('Id_Merge').value,
                Color: document.getElementById('BorderColor').value + "," + document.getElementById('FillColor').value,
                Status: document.getElementById('Status').checked,
                Is_Remote: document.getElementById('Is_Remote').checked
            };
            $.ajax({
                url: post_location_Route + token,
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(formData),
                success: function(response) {
                    
                    if (response.Success) {
                        allLocations()
                    }  
    
                    toastFill(response)
                },
                error: function(error) {
                    // Manejar errores de AJAX aquí
                    //deleteCookie("DataUser")
                    console.log(getCookie("DataUser"))
                    setToast(true, error.responseJSON.Message, "danger")
                    
                    //loadPartialView("Users/login", document.querySelector(".main"));
                }
            });
        }else{
            tokenError()
        }
    }
}catch{
    console.log("Hehe");
}
