const axios = require('axios')

async function getAuthor(author){
    try {
        const url = `http://localhost:5000/author/${author}`
        const response = await axios.get(url)
        console.log(response.data)
    } catch (error) {
        console.log(error.message)
    }
}

getAuthor('Unknown')