// server.js
const express = require('express');
const app = express();
// 데이터베이스 연결 및 모델 정의

app.get('/api/products/:id', (req, res) => {
  const productId = req.params.id;
  // 데이터베이스에서 제품 정보와 리뷰 데이터를 가져옴
  Product.findById(productId)
    .populate('itemReview')
    .then(product => {
      res.json(product);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Server Error');
    });
});

app.listen(3000, () => console.log('Server started on port 3000'));