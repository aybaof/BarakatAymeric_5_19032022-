import { fn } from './function.mjs'

fn.getAll().then(res =>{
    res.forEach(element => {
      const card = 
      fn.stringToHtml(`
      <a href="./product.html?id=${element._id}">
      <article>
        <img src="${element.imageUrl}" alt="${element.altTxt}">
        <h3 class="productName">${element.name}</h3>
        <p class="productDescription">${element.description}</p>
      </article>
    </a>
      `)
        document.querySelector('#items').appendChild(card)
    })
})