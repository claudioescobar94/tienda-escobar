let stockProductos;
const contenedorProductos = document.getElementById("contenedor-productos");

const contenedorCarrito = document.getElementById("carrito-contenedor");

const botonVaciar = document.getElementById("vaciar-carrito");

const botonComprar = document.getElementById("comprar");

const contadorCarrito = document.getElementById("contadorCarrito");

const cantidad = document.getElementById("cantidad");
const precioTotal = document.getElementById("precioTotal");
const cantidadTotal = document.getElementById("cantidadTotal");
const inputSearch = document.getElementById("buscador");
const buttonSearch = document.getElementById("boton-buscar");

let carrito = [];

(async () => {
   const getData = async () => {
     const response = await fetch("../assets/js/stock.json");
     const data = await response.json();
     stockProductos = data;
     return data;
   };

   await getData();

   await renderProductos(stockProductos);
 })();

/* fetch("../assets/js/stock.json").then(res=> res.json()).then(data =>{
  console.log(data);
  renderProductos(data)

}) */

document.addEventListener("DOMContentLoaded", async () => {
  if (localStorage.getItem("carrito")) {
    carrito = JSON.parse(localStorage.getItem("carrito"));
    actualizarCarrito();
  }
});

botonVaciar.addEventListener("click", () => {
  carrito.length = 0;
  actualizarCarrito();
});

botonComprar.addEventListener("click", () => {
  if (carrito.length !== 0) {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Gracias por su compra",
      showConfirmButton: false,
      timer: 1500,
    });
    carrito.length = 0;
    localStorage.setItem("carrito", JSON.stringify(carrito));
  } else {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Debes elegir un producto para comprar!",
    });
  }

  actualizarCarrito();
});

const renderProductos = (productos) => {
  productos.forEach((producto) => {
    const div = document.createElement("div");
    div.classList.add("producto");
    div.innerHTML = `
        <img src=${producto.img} alt= "">
        <div>
        <h3>${producto.nombre}</h3>
        <p>Talle: ${producto.talle}</p>
        <p class="precioProducto">Precio:$ ${producto.precio}</p>
        <button id="agregar${producto.id}" class="boton-agregar">Agregar <i class="fas fa-shopping-cart"></i></button>
        </div>
        `;
    contenedorProductos.appendChild(div);

    const boton = document.getElementById(`agregar${producto.id}`);

    boton.addEventListener("click", () => {
      agregarAlCarrito(producto.id);
    });
  });
};

const agregarAlCarrito = (prodId) => {
  const existe = carrito.some((prod) => prod.id === prodId);

  if (existe) {
    const prod = carrito.map((prod) => {
      if (prod.id === prodId) {
        prod.cantidad++;
      }
    });
  } else {
    const item = stockProductos.find((prod) => prod.id === prodId);
    carrito.push(item);
  }

  actualizarCarrito();
};

const eliminarDelCarrito = (prodId) => {
  const item = carrito.find((prod) => prod.id === prodId);

  const indice = carrito.indexOf(item);

  carrito.splice(indice, 1);

  actualizarCarrito();
  console.log(carrito);
};

const actualizarCarrito = () => {
  contenedorCarrito.innerHTML = "";

  carrito.forEach((prod) => {
    const div = document.createElement("div");
    div.className = "productoEnCarrito";
    div.innerHTML = `
        <p>${prod.nombre}</p>
        <p>Precio:$${prod.precio}</p>
        <p>Cantidad: <span id="cantidad">${prod.cantidad}</span></p>
        <button onclick="eliminarDelCarrito(${prod.id})" class="boton-eliminar"><i class="fas fa-trash-alt"></i></button>
        `;

    contenedorCarrito.appendChild(div);

    localStorage.setItem("carrito", JSON.stringify(carrito));
  });

  contadorCarrito.innerText = carrito.length;
  precioTotal.innerText = carrito.reduce(
    (acc, prod) => acc + prod.cantidad * prod.precio,
    0
  );
};

inputSearch.addEventListener("keyup", (event) => {
  const searchText = event.target.value.toLowerCase();

  if (event.target.matches("#buscador")) {
    document.querySelectorAll(".producto").forEach((producto) => {
      producto.textContent.toLowerCase().includes(searchText)
        ? producto.classList.remove("filter")
        : producto.classList.add("filter");
    });
  }

  if (event.key === "Escape") {
    event.target.value = "";
  }
});

