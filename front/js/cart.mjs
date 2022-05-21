import { fn } from "./function.mjs";
let cart = JSON.parse(localStorage.getItem("cart"))
  ? JSON.parse(localStorage.getItem("cart"))
  : [];

const currentLocation = window.location.href;


// If statement using location because cart is being used in 2 different path
if (currentLocation === "http://127.0.0.1:5500/front/html/cart.html") {
  
  // display error msg in case of error in regexValidation , str is the error msg , input is the selector where the error msg has been fired
  const errorMsg = (str, input) => {
    const errorLabel = document.querySelector(`#${input}ErrorMsg`)  
    errorLabel.textContent = str;
    document.querySelector(`input#${input}`).addEventListener("keydown" , () => {
      errorLabel.textContent = ''
    })
  };
  // Logic + UI
  const totalAmount = () => {
    let total = 0;
    let nbProduct = 0;
    cart.forEach((item) => {
      total += item.price * item.quantity;
      nbProduct += item.quantity;
    });
    document.querySelector("#totalPrice").textContent = total;
    document.querySelector("#totalQuantity").textContent = nbProduct;
  };
  // product = idProduct to delete , logic + UI
  const deleteItem = (product) => {
      cart = cart.filter(
          (productInCart) => productInCart.id !== product.id
        );
        localStorage.setItem("cart", JSON.stringify(cart));
        document.querySelector(`.cart__item[data-id="${product.id}"][data-color=${product.color}]`).remove()
        totalAmount();
  } 
  
  
  // product = product ID , logic + UI
  const updateQuantity = (product) => {
              const productToUpdate = cart.find(
              (productInCart) =>
                productInCart.id === product.id &&
                productInCart.color === product.color
            );
            const card = document.querySelector(`.cart__item[data-id="${product.id}"][data-color=${product.color}]`)
            parseInt(card.querySelector(".itemQuantity").value) > 0
              ? (productToUpdate.quantity = parseInt(
                  card.querySelector(".itemQuantity").value
                ))
              : (productToUpdate.quantity = 1);
            localStorage.setItem("cart", JSON.stringify(cart));
            totalAmount();
  }
  // validation du formulaire avant l'envois au serveur
  const regexValidation = (obj) => {
      //  patern : { tout caractére visible  + @ + tout caractére visible + . + tout caractére visible }
      const regexEmail = /^\S+@\S+\.\S+$/;
      // toute lettre 
      const regexStr = /^[a-zA-Z]/;
      // tout caractére alphanumérique
      const regexAdress = /[A-Za-z0-9]/;
      let isValidishEmail = regexEmail.test(obj.email);
      if (cart.length >= 1) {
           return new Promise((resolve, reject) => {
            regexStr.test(obj.firstName)
              ? null
              : reject({
                  txt: "Veuillez entrer un prénom valide",
                  input: "firstName",
                });
    
            regexStr.test(obj.lastName)
              ? null
              : reject({
                  txt: "Veuillez entrer un nom valide",
                  input: "lastName",
                });
            regexAdress.test(obj.address)
              ? null
              : reject({
                  txt: "Veuillez entrer une adresse valide",
                  input: "address",
                });
            regexAdress.test(obj.city)
              ? null
              : reject({
                  txt: "Veuillez entrer une ville valide",
                  input: "city",
                });
            isValidishEmail
              ? resolve()
              : reject({
                  txt: "Veuillez entrer une adresse email valide",
                  input: "email",
                });
          })}
  }
    // forEach cart statement : ui + event
  cart.forEach((product) => {
    fn.getSpecific(product.id)
      .then((get) => {
        const card = fn.stringToHtml(`
    <article class="cart__item" data-id="${product.id}" data-color="${product.color}">
        <div class="cart__item__img">
            <img src="${get.imageUrl}" alt="${get.altTxt}">
        </div>
        <div class="cart__item__content">
            <div class="cart__item__content__description">
                <h2>${get.name}</h2>
                <p>${product.color}</p>
                <p>${get.price} €</p>
            </div>
            <div class="cart__item__content__settings">
                <div class="cart__item__content__settings__quantity">
                    <p>Qté : </p>
                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
                </div>
                <div class="cart__item__content__settings__delete">
                    <p class="deleteItem">Supprimer</p>
                </div>
            </div>
        </div>
    </article>
     `);

        card.querySelector(".deleteItem").addEventListener("click", () => {
          deleteItem(product)
        });
        card.querySelector(".itemQuantity").addEventListener("change", () => {
          updateQuantity(product)
        });
        document.querySelector("#cart__items").appendChild(card);
        totalAmount();
      })
      .catch((e) => alert(e));
  });

//   post start event 
  document.querySelector("#order").addEventListener("click", (event) => {
    event.preventDefault();
    // init object contact req back
    const contact = {
      firstName: document.querySelector("#firstName").value,
      lastName: document.querySelector("#lastName").value,
      address: document.querySelector("#address").value,
      city: document.querySelector("#city").value,
      email: document.querySelector("#email").value,
    };
        regexValidation(contact).then(() => {
            // preparation for api that take only array Id , missing color 
          let cartProductId = [];
          cart.forEach((item) => {
            for (let i = 0; i < item.quantity; i++) {
              cartProductId.push(item.id);
            }
          });
          // post request and redirection if resolve
          fn.postOrder(contact, cartProductId).then((order) => {
            localStorage.removeItem("cart");
            window.location = `http://127.0.0.1:5500/front/html/confirmation.html?orderId=${order.orderId}`;
          });
        })
        .catch((error) => {
          errorMsg(error.txt, error.input);
        });
  });
} else {
    // confirmation part 
  const param = new URLSearchParams(document.location.search);
  const orderId = param.get("orderId");
  document.querySelector("#orderId").textContent = orderId;
}
