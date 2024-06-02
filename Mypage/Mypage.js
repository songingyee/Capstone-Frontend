document.addEventListener('DOMContentLoaded', () => {
  // 쿠키에서 세션 ID 가져오기
  const sessionId = getCookie('sessionId');

  // API에서 데이터 가져오기
  fetch('http://localhost:8080/api/mypage/{memberId}', {
      headers: {
          'Session-ID': sessionId // 세션 ID를 헤더에 포함하여 서버로 전송
      }
  })
  .then(response => response.json())
  .then(data => {
      // My Information 렌더링
      document.getElementById('email').textContent = data.email;
      document.getElementById('gender').textContent = data.gender;
      document.getElementById('age').textContent = data.age;
      document.getElementById('height').textContent = data.height;
      document.getElementById('weight').textContent = data.weight;
      document.getElementById('waist').textContent = data.waist;

      // My Reviews 렌더링
      const myReviewsContainer = document.getElementById('myReviews');
      if (myReviewsContainer) {
          data.myReviewItems.forEach(item => {
              const reviewItem = document.createElement('div');
              reviewItem.classList.add('review-item');
              reviewItem.innerHTML = `
                  <img src="${item.image}" alt="${item.itemName}">
                  <h4>${item.itemName}</h4>
                  <p>Price: ${item.price}원</p>
                  <p>Brand: ${item.company}</p>
                  <p>Size: ${item.size}</p>
              `;
              myReviewsContainer.appendChild(reviewItem);
          });
      }

      // Shopping Cart 렌더링
      const shoppingCartContainer = document.getElementById('shoppingCart');
      if (shoppingCartContainer) {
          data.shoppingCartItems.forEach(item => {
              const cartItem = document.createElement('div');
              cartItem.classList.add('cart-item');
              cartItem.innerHTML = `
                  <img src="${item.image}" alt="${item.itemName}">
                  <h4>${item.itemName}</h4>
                  <p>Price: ${item.price} 원</p>
                  <p>Brand: ${item.company}</p>
                  <p>Size: ${item.size}</p>
              `;
              shoppingCartContainer.appendChild(cartItem);
          });
      }
  })
  .catch(error => {
      console.error('Error:', error);
  });
});

// 쿠키에서 특정 이름의 쿠키 값을 가져옴
function getCookie(name) {
  const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
  return cookieValue ? cookieValue.pop() : '';
}
