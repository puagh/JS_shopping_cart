//@ts-nocheck

//Variables
const carrito = document.querySelector('#carrito');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
const listaCursos = document.querySelector('#lista-cursos');
let articulosCarrito = [];

cargarEventListeners();
//Crear una función donde se registran todos los event listeners
//para que no queden en la ventana global
function cargarEventListeners(){
    //cuando agregas un curso presionando agregar al carrito
    listaCursos.addEventListener('click', agregarCurso);

    //Elimina cursos del carrito
    carrito.addEventListener('click', eliminarCurso);

    //Vaciar carrito
    vaciarCarritoBtn.addEventListener('click', () =>{
        articulosCarrito = []; //Reseteamos el arreglo del carrito
        limpiarHTML(); //Limpiamos el HTML del carrito
    });
}

//Funciones
function agregarCurso(e){
    e.preventDefault();
    if(e.target.classList.contains('agregar-carrito')){
        //Traversing para obtener el curso seleccionado
        const cursoSeleccionado = e.target.parentElement.parentElement;
        leerDatosCurso(cursoSeleccionado);
    }
}

//elimina un curso del carrito
function eliminarCurso(e){
    if(e.target.classList.contains('borrar-curso')){
        const cursoId = e.target.getAttribute('data-id');
        //elimina del arreglo de articulosCarrito por el data-id
        articulosCarrito = articulosCarrito.filter( curso => curso.id !== cursoId);
        //actualizar HTML del carrito
        carritoHTML();
    }
}

//Lee el contenido del HTML al que le damos click y extrae la información del curso
function leerDatosCurso(curso){

    //Crear un objeto con el contenido del curso actual
    const infoCurso = {
        imagen : curso.querySelector('img').src,
        titulo : curso.querySelector('h4').textContent,
        precio : curso.querySelector('.precio span') === null ? (curso.querySelector('.precio').textContent) : (curso.querySelector('.precio span').textContent),
        id : curso.querySelector('a').getAttribute('data-id'), 
        cantidad : 1
    }

    //Revisa si un elemento ya existe en el carrito
    const existe = articulosCarrito.some( curso => curso.id === infoCurso.id);
    if (existe){
        //Actualizamos la cantidad
        const cursos = articulosCarrito.map( curso => {
            if(curso.id === infoCurso.id){
                curso.cantidad += 1;
                return curso; //Retorna el objeto actualizado
            } else {
                return curso; //Retorna objetos no duplicados
            }
        });
        articulosCarrito = [...cursos];
    } else{
        //Agregamos el curso al carrito
        articulosCarrito = [...articulosCarrito, infoCurso]; 
    }
    
    carritoHTML();
}

//Muestra el carrito de compras en el HTML
function carritoHTML(){
    //Limpiar el HTML
    limpiarHTML();
    //Recorre el carrito y genera el HTML
    articulosCarrito.forEach(curso =>{

        //Una vez que funciona el código, se utiliza destructuring
        //para mejorar el código
        const {imagen, titulo, precio, cantidad, id} = curso;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${imagen}" width=100></td>
            <td>${titulo}</td>
            <td>${precio}</td>
            <td>${cantidad}</td>
            <td>
                <a href="#" class="borrar-curso" data-id="${id}">X</a>
            </td>
        `;
        //Agregal el HTML del carrito en el table body
        contenedorCarrito.appendChild(row);
    });
}

//Elimina los curso del TBODY
function limpiarHTML(){
    //Forma lenta
    //contenedorCarrito.innerHTML = '';
    while(contenedorCarrito.firstChild){
        contenedorCarrito.removeChild(contenedorCarrito.firstChild)
    }
}