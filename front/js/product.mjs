import { fn } from './function.mjs'

const param = new URLSearchParams(document.location.search);
const id = param.get("id")

fn.getSpecific(id).then(e => {
    document.querySelector(".item__img").appendChild(fn.stringToHtml(`<img src="${e.imageUrl}" alt="${e.altTxt}">`))
    document.querySelector("#title").textContent = e.name
    document.querySelector("#price").textContent =  e.price
    document.querySelector("#description").textContent =  e.description
    const select = document.querySelector("#colors")
    e.colors.forEach(color => {
        select.appendChild(fn.stringToHtml(`<option value="${color}">${color}</option>`))
    })

})




