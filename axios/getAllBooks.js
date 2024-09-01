const axios = require('axios')

async function getAllbooks(){
    try {
        const url = `http://localhost:5000/`
        const response = await axios.get(url)
        console.log(response.data)
    } catch (error) {
        console.log(error.message)
    }

}


getAllbooks()