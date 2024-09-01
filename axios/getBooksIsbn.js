const axios = require("axios");

function getBookIsbnPromises(isbn) {
  const url = `http://localhost:5000/isbn/${isbn}`;
  axios
    .get(url)
    .then((response) => console.log(response.data))
    .catch((error) => console.log(error.message));
}

getBookIsbnPromises(2);
