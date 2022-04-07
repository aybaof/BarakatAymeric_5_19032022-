const fn = {

    getAll : async () => {
            const res = await fetch(`http://localhost:3000/api/products/`)
            const data = await res.json()
            return data
        
    },

    getSpecific : async (id) => {
        const res = await fetch(`http://localhost:3000/api/products/${id}`)
        const data = await res.json()
        return data
    },

    stringToHtml : (template) => {
        const parser = new DOMParser();
        const element = parser.parseFromString(template, "text/html");
        return element.body.firstChild;
    }


}

export {fn}