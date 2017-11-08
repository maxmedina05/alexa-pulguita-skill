const request = require('request');
const BASE_URL = 'http://52.168.3.123:3000/api/v1';
// const BASE_URL = 'http://localhost:3000/api/v1';

function getProducts() {
  return new Promise((resolve, reject) => {
    request.get(`${BASE_URL}/products?limit=10&inStock=1`, (err, res, body) => {
      if (err) {
        return reject(err);
      }

      let response = JSON.parse(body);
      const names = response.data.map(x => x.name);
      return resolve(names);
    });
  });
}

function getIdByName(name) {
  return new Promise((resolve, reject) => {
    request.get(`${BASE_URL}/products?limit=5&name=${name}`, (err, res, body) => {
      if (err) {
        return reject(err);
      }

      let response = JSON.parse(body);
      if (response.success && response.data.length > 0) {
        const product = response.data[0];
        return resolve(product);

      } else {
        reject(new Error("Sorry, that product was sold out!"));
      }
    });
  });
}

function makeOrder(productName) {
  return new Promise((resolve, reject) => {
    getIdByName(productName).
    then(result => {
        let product = {
          productId: result._id,
          quantity: 1
        };
        let newOrder = {
          products: [product],
          totalPrice: result.price
        };

        request.post(`${BASE_URL}/orders`, {
            json: true,
            body: newOrder,
          },
          (err, res, body) => {
            if (err) {
              return reject(err);
            }
            if (!body.success) {
              reject(new Error(body.message));
            } else {
              resolve(body);
            }
          });
      })
      .catch(err => reject(err))
  });
}

// makeOrder("apple")
//   .then(res => {
//     console.log("good: ", res);
//   })
//   .catch(err => console.error(err.message ? err.message : err));

module.exports.getProducts = getProducts;
module.exports.makeOrder = makeOrder;
