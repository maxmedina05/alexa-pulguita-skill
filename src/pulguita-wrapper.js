const request = require('request');
const BASE_URL = 'http://52.168.3.123:3000/api/v1';
// const BASE_URL = 'http://localhost:3000/api/v1';

function getProducts() {
  return new Promise((resolve, reject) => {
    request.get(`${BASE_URL}/products?limit=5`, (err, res, body) => {
        if(err) {
          return reject(err);
        }

        let response = JSON.parse(body);
        const names = response.data.map(x => x.name);
        return resolve(names);
      });
  });
}

module.exports.getProducts = getProducts;
