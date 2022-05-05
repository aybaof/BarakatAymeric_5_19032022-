const urlApi = "http://localhost:3000/api/products/";
const postHeaders = new Headers();
postHeaders.append('Content-Type', 'application/json');

// Module function to avoid repetition

const fn = {
    // requete get all product
    getAll : async () => {
            const res = await fetch(`${urlApi}`)
            const data = await res.json()
            return data
        
    },
    // requete produit unique
    getSpecific : async (id) => {
        const res = await fetch(`${urlApi}${id}`)
        const data = await res.json()
        return data
    },
    // prend un string en paramettre rend un html node 
    stringToHtml : (template) => {
        const parser = new DOMParser();
        const element = parser.parseFromString(template, "text/html");
        return element.body.firstChild;
    },
    // requete post
    postOrder : async (obj , cart) =>{
        const body = {
            contact : obj,
            products : cart
        }
        const res = await fetch(`${urlApi}order/`, {
            method: 'POST',
            headers : postHeaders,
            body : JSON.stringify(body),
        })

        const data = await res.json()
        return data
    }




}

export {fn}