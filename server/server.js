require('newrelic');
require('isomorphic-fetch');
require('dotenv').config();
const express = require('express');
const productDetail = require('../services/server.js');
const Layout = require('../templates/productDetailTemplate.js');

const app = express();

const PORT = process.env.PORT;

const API_SERVER = process.env.API_SERVER;

app.use((req, res, next) => {
  if (req.url === '/') {
    res.redirect(301, req.url + '?productId=1');
  }
  next();
});


app.use(express.urlencoded({ extended: false }));

app.use(express.static('./client/'));

app.get('/products/:productId?', (req, res) => {

  const productId = req.query.productId;
  fetch(`${API_SERVER}/productFullData/${productId}`)
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error('Invalid Product ID');
      }
    })
    .then((product) => [productDetail.default(product), product])
    .then(([html, product]) => res.send(Layout(html, product)))
    .catch ((error) => console.log('fetch error', error));
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`listening on port http://localhost:${PORT}`);
});