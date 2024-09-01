const axios = require('axios')

async function getBookForTitle(title){
    try {
        const url = `http://localhost:5000/title/${title}`
        const response = await axios.get(url)
        console.log(response.data)
    } catch (error) {
        console.log(error.message)
    }
}


getBookForTitle('Things Fall Apart')