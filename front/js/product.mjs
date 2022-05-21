import { fn } from "./function.mjs";

const param = new URLSearchParams(document.location.search);
const id = param.get("id");

// Fonction qui ajoute un item au local storage et propose d'être rediriger vers la page de d'acceuil

const addItem = (id, color, quantity,price) => {
  let cart = JSON.parse(localStorage.getItem("cart"));
  cart ? cart :  wxcart = [];
  const isInCart = cart.find(product => product.id === id && product.color === color);
  isInCart
    ? (isInCart.quantity += quantity)
    : cart.push({ "id":id, "color":color, "quantity" :quantity , "price" : price });
  localStorage.setItem("cart", JSON.stringify(cart));
  confirm("Produit ajouté , retourné à l'acceuil ?") ? window.location.href = "http://127.0.0.1:5500/front/html/index.html" : null

}



// UI creation 
fn.getSpecific(id).then((res) => {
  document
    .querySelector(".item__img")
    .appendChild(
      fn.stringToHtml(`<img src="${res.imageUrl}" alt="${res.altTxt}">`)
    );
  document.querySelector("#title").textContent = res.name;
  document.querySelector("#price").textContent = res.price;
  document.querySelector("#description").textContent = res.description;
  
  const select = document.querySelector("#colors");
  res.colors.forEach((color) => {
    select.appendChild(
      fn.stringToHtml(`<option value="${color}">${color}</option>`)
    );
  });

  document.querySelector("#addToCart").addEventListener("click", () => {

    const color = document.querySelector("#colors").value;
    const quantity = parseInt(document.querySelector("#quantity").value);
    const price = res.price;
    // id is already used as a page param 
    if (id && color && quantity && price) {
      addItem(id, color, quantity,price);
    } else {
      color ? null : alert("Veuillez choisir une couleur")
      quantity ? null : alert("Sélectionner une quantité")
    }
  });
});


