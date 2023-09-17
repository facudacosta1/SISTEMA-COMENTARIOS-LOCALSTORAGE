let btnEnviar = document.getElementById('btnEnviar');
let btnBuscar = document.getElementById('btnBuscar');
let inputBuscar = document.getElementById('inputBuscar');
let contenedorEnviarComentario = document.getElementById('contenedorEnviarComentario');
const contenedorResultados = document.getElementById('contenedorResultados');
const contenedorComentarios = document.getElementById('contenedorComentarios');
const BASE_URL = 'https://images-api.nasa.gov/search?q=';

document.addEventListener('DOMContentLoaded',function(){
    
})
/*
--------------------------------------------------------
EVENTO AL BOTON BUSCAR
--------------------------------------------------------
*/

btnBuscar.addEventListener('click', function(e){
    e.preventDefault();
    // Obtiene el valor del campo de búsqueda
    const searchTerm = inputBuscar.value.toLowerCase();

    // Verifica si el campo de búsqueda está vacío
    if (searchTerm.trim() === "") {
        alert("Por favor, ingresa un término de búsqueda.");
        return; // Sale de la función si el campo está vacío
    }

    // Realiza la búsqueda en la API y muestra los resultados
    realizarBusqueda(searchTerm);
});

/*
--------------------------------------------------------
FUNCION PARA OBTENER LOS ELEMENTOS RELACIONADOS CON LA BUSQUEDA
--------------------------------------------------------
*/
function realizarBusqueda(searchTerm) {
    const url = BASE_URL + searchTerm;
    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            const elementos = data.collection.items;
            let content = '';

            if (elementos.length === 0) {
                // No se encontraron resultados, oculta el contenedor de comentarios
                contenedorEnviarComentario.style.display = 'none';
                alert("No se encontraron resultados para la búsqueda.");
            } else {
                // Se encontraron resultados, muestra el contenedor de comentarios
                contenedorEnviarComentario.style.display = 'block';

                for (let i = 0; i < 4 && i < elementos.length; i++) {
                    const metaData = elementos[i].data[0];
                    const imageUrl = elementos[i].links[0].href;
                    content += `
                    <div>
                        <div class="info-container">
                            <img src="${imageUrl}" alt="${metaData.title}">
                            <h5 class="content-title">${metaData.title}</h5>
                            <p class="content-description">${metaData.description}</p>
                            <div> <!-- Cerramos la etiqueta 'div' correctamente -->
                                <small>Fecha: ${metaData.date_created}</small>
                            </div>
                        </div>
                    </div>
                    `;
                }
            }
            contenedorResultados.innerHTML = content; 
            // Muestra los comentarios relacionados con la búsqueda actual
            mostrarComentarios(searchTerm);
        })
        .catch((error) => {
            console.error(error);
        });
}

/*
--------------------------------------------------------
FUNCION PARA MOSTRAR COMENTARIOS
--------------------------------------------------------
*/
function mostrarComentarios(searchTerm) {
    const comentariosAnteriores = JSON.parse(localStorage.getItem(searchTerm));

    // Limpia el contenedor de comentarios antes de agregar los nuevos
    contenedorComentarios.innerHTML = '';

    if (comentariosAnteriores && Array.isArray(comentariosAnteriores.comentarios)) {
        comentariosAnteriores.comentarios.forEach(element => {
            // Crea un nuevo párrafo para cada comentario
            const comentarioP = document.createElement('p');
            comentarioP.classList.add('comentario');

            // Crea un elemento en negrita (negrita) para el usuario
            const usuarioStrong = document.createElement('strong');
            usuarioStrong.textContent = `${element.usuario}: `;


            // Agrega el elemento en negrita y el comentario al párrafo
            comentarioP.appendChild(usuarioStrong);
            comentarioP.appendChild(document.createTextNode(element.comentario));
              // Agrega el puntaje al párrafo del comentario
              const puntajeSpan = document.createElement('span');
              puntajeSpan.textContent = `, mi calificación es: ${element.puntaje}`;
              comentarioP.appendChild(puntajeSpan);
  
              // Agrega el párrafo del comentario al contenedor de comentarios
              contenedorComentarios.appendChild(comentarioP);
        });
    } else {
        console.log(`No se encontraron comentarios para ${searchTerm}`);
    }
}

/*
--------------------------------------------------------
EVENTO AL BOTON PARA ENVIAR COMENTARIO
--------------------------------------------------------
*/

btnEnviar.addEventListener('click', function(e){
    e.preventDefault();
    const inputComentario = document.getElementById('inputComentario');
    const inputUsuario = document.getElementById('inputUsuario');
    const inputRange = document.getElementById('inputRange');
    const searchTerm = inputBuscar.value.toLowerCase();
    
    let comentario = {
        "usuario": inputUsuario.value,
        "comentario": inputComentario.value,
        "puntaje": inputRange.value,
    }

    // Verifica que los campos de usuario y comentario no estén vacíos antes de agregar el comentario
    if (comentario.usuario.trim() !== "" && comentario.comentario.trim() !== "") {
        const comentariosGuardados = JSON.parse(localStorage.getItem(searchTerm)) || {comentarios: []};
        comentariosGuardados.comentarios.push(comentario);
        localStorage.setItem(searchTerm, JSON.stringify(comentariosGuardados));

        // Limpia los campos de usuario y comentario después de agregar el comentario
        inputUsuario.value = "";
        inputComentario.value = "";

        // Muestra el nuevo comentario
        mostrarComentarios(searchTerm);
    } else {
        alert("Por favor, completa los campos de usuario y comentario.");
    }
});
