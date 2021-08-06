//@ts-check

/**
 * Constante que contiene el HTML completo del carrito
 * @type {object}
 */
const shoppingCart = document.querySelector('#carrito');

/**
 * Constante que contiene el HTML completo de la lista de coursos
 * @type {object}
 */
const coursesList = document.querySelector('#lista-cursos');

/**
 * Constante que contiene el HTML del botón vaciar carrito contenido en
 * el carrito, debjo de los cursos añadidos.
 * @type {object}
 */
const cleanShoppingCartBtn = document.querySelector('#vaciar-carrito');

/**
 * Contenedor del carrito de compras, contiene una tabla con el id lista-carrito
 * @type {object}
 */
const shoppingCartContainer = document.querySelector('#lista-carrito tbody');

/**
 * Lista que va a encargarse de contener objetos corresponidentes a 
 * los productos del carrito,
 * actualizando su valor de acuerdo a si se agregan o quitan elementos
 * @type {Array<Object>}
 */
let listItemShoppingCart = [];




loadEventListeners();
/**
 * Función que se encarga de agrupar los eventListeners del carrito de compras
 * @function
 */
function loadEventListeners(){

    document.addEventListener('DOMContentLoaded', () => {
        listItemShoppingCart = JSON.parse( localStorage.getItem('shoppingCart')) || [];
        createHTMLShopCartItem();
    });


    /**
     * Evento clic que tiene como objetivo ejecutar la funcion addCourse
     * @event courses_addEventListener 
     * @param {string} type Tipo de evento 'click'
     * @param {Function} addCourse Función encargada de agregar el curso seleccionado al 
     * carritode compras
     */
    coursesList.addEventListener('click', addCourse);

    /**
     * Evento clíc que tiene como objetivo ejecutar la función deleteCourse
     * @event shoppingCart_addEventListener
     * @param {string} type Tipo de evento 'click'
     * @param {Function} deleteCourse Función encargada de eliminar el producto seleccionado del
     * carrito de compras
     */
    shoppingCart.addEventListener('click', deleteCourse);

    /**
     * Evento clic que tiene como objetivos vaciar la lista 'listItemShoppingCart' y 
     * ejecutar la función 'cleanShoppingCart' para limpiar el código HTML del carrito
     * @event cleanShoppingCartBtn_addEventListener 
     * @param {object} e Objeto de tipo evento
     */
    cleanShoppingCartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        listItemShoppingCart = [];
        cleanShoppingCart();
    });

}

/**
 * Agregar curso al carrito de compras
 * @param {object} e El parámetro es un objeto de tipo evento, lanzado
 * por la función loadEventListeners al recibir un clic.
 * @returns {void}
 */
function addCourse(e){
    e.preventDefault();
    if(e.target.classList.contains('agregar-carrito')){
        const selectedCourse = e.target.parentElement.parentElement
        getInfoProduct(selectedCourse);
    }
}
/**
 * Accede a la información del curso para crear un objeto.
 * @param {object} selectedCourse Curso seleccionado del cual se va a extraer la 
 * información para crear un objeto.
 * @returns {void}
 */
function getInfoProduct(selectedCourse){
    /**
     * Objeto course que va a contener la información necesaria para
     * agregarla al carrito de compras
     * @typedef {Object} course
     * @property {number} id id del curso
     * @property {string} image ruta de la imagen del curso
     * @property {string} title título del curso
     * @property {string} price precio del curso
     * @property {number} quantity cantidad agregada, sólo puede ser 1
     */
    
    /**
     * @type {course}
     */
    const course = {
        id: parseInt(selectedCourse.querySelector('a').getAttribute('data-id')),
        image: selectedCourse.querySelector('img').src,
        title: selectedCourse.querySelector('h4').textContent,
        price: selectedCourse.querySelector('.precio span') === null ? selectedCourse.querySelector('.precio').textContent : selectedCourse.querySelector('.precio span').textContent,
        quantity: 1
    }

    /**
     * @constant {Boolean} productDuplicated Verdadero si el curso ya estaba en el carrito de compras
     */
    const productDuplicated = listItemShoppingCart.some(itemShoppingCart => itemShoppingCart.id === course.id);
    if(productDuplicated){
        const courses = listItemShoppingCart.map(itemShoppingCart => {
            if(itemShoppingCart.id === course.id){
                itemShoppingCart.quantity += 1;
                return itemShoppingCart; //Retorna el objeto actualizado
            } else {
                return itemShoppingCart; //Retorna objetos no duplicados
            }
        });
        listItemShoppingCart = [...courses];
    } else {
        listItemShoppingCart = [...listItemShoppingCart, course];
    }
    createHTMLShopCartItem();
}

/**
 * Crea el nodo td para cada curso que se agrega en el carrito
 * @returns {void}
 */
function createHTMLShopCartItem(){
    cleanShoppingCart();
    listItemShoppingCart.forEach(itemShoppingCart => {
        /**
         * Se crea un nodo tr que va a contener el HTML completo para la fila que utilizará cada producto
         * @constant {object} row Objeto HTML creado con js para contener la información del carrito de compras
         */
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${itemShoppingCart.image}" width=100></td>
            <td>${itemShoppingCart.title}</td>
            <td>${itemShoppingCart.price}</td>
            <td>${itemShoppingCart.quantity}</td>
            <td>
                <a href="#" class="borrar-curso" data-id="${itemShoppingCart.id}">X</a>
            </td>
        `;
        shoppingCartContainer.appendChild(row);

        //Sincronizar con localStorage
        synchronizeStorage();
    });
}

/**
 * Sincroniza el arrelgo listItemShoppingCart con localStorage API para brindar
 * la posibilidad de guardar cursos agregados al carrito de manera local
 * @function synchronizeStorage
 * @returns {void}
 */
function synchronizeStorage(){
    localStorage.setItem('shoppingCart', JSON.stringify(listItemShoppingCart));
}

/**
 * Eliminar el elemento deseado del carrito de compras
 * @param {object} e Objeto del tipo evento
 * @returns {void}
 */
function deleteCourse(e){
    e.preventDefault();
    if(e.target.classList.contains('borrar-curso')){
        const getCourseId = e.target.getAttribute('data-id');
        listItemShoppingCart = listItemShoppingCart.filter(course => course.id != getCourseId);
        createHTMLShopCartItem();
    }
}

/**
 * Limpiar carrito, borrar los elementos del contenedor del carrito y los elimina
 * mediante el iterador while
 * @function 
 * @return {void}
 */
function cleanShoppingCart(){
    while (shoppingCartContainer.firstChild){
        shoppingCartContainer.removeChild(shoppingCartContainer.firstChild)
    }
}