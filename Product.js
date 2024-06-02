document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('productId');
    loadProductDetails(productId); // 상품 로드
    loadReviews(productId); // 리뷰 로드

    const reviewForm = document.querySelector('.user-review');
    const stars = document.querySelectorAll('.star');
    let selectedRating = 0;

    stars.forEach(star => {
        star.addEventListener('click', function() {
            selectedRating = parseInt(this.getAttribute('data-value'));
            updateStars(selectedRating);
        });
    });

    function updateStars(rating) {
        stars.forEach((star, index) => {
            star.textContent = index < rating ? '⭐' : '☆';
        });
    }

    reviewForm.addEventListener('submit', function(event) {
        event.preventDefault();
        submitReview(productId);
    });

    function loadProductDetails(productId) {
        fetch(`http://localhost:8080/api/itemDetail/${productId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch product details');
            }
            return response.json();
        })
        .then(data => {
            displayProductDetails(data);
        })
        .catch(error => {
            console.error('Error loading product details:', error);
        });
    }

    function displayProductDetails(data) {
        document.getElementById('brand').textContent += data.company;
        document.getElementById('product-name').textContent += data.itemName;
        document.getElementById('type').textContent += data.type || 'N/A';
        document.getElementById('size').textContent += data.size;
        document.getElementById('length').textContent += data.sizeList.length;
        document.getElementById('waist').textContent += data.sizeList.waistWidth;
        document.getElementById('gender').textContent += data.gender || 'N/A';
        document.getElementById('price').textContent += data.price + ' USD';
        document.getElementById('product-image').src = data.image;
        document.getElementById('buy-now-button').onclick = () => window.open(data.siteUrl, '_blank');
        
        // 리뷰 로드
        if (data.itemReview) {
            data.itemReview.forEach(review => {
                addReviewToPage(review.title, review.content, review.star, review.username);
            });
        }
    }

    function submitReview(productId) {
        if (!isLoggedIn()) {
            alert('로그인 후 이용해주세요.');
            window.location.href = 'join.html';
            return;
        }

        const title = document.getElementById('review-title').value;
        const content = document.getElementById('review-content').value;

        if (!title || !content || selectedRating === 0) {
            alert('모든 필드를 채워주세요.');
            return;
        }

        fetch(`http://localhost:8080/api/itemDetail/${productId}/review`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productId: productId,
                title: title,
                content: content,
                star: selectedRating,
                username: 'currentUsername' // 현재 로그인한 사용자의 이름
            })
        }).then(response => {
            if (!response.ok) {
                throw new Error('Review submission failed');
            }
            return response.json();
        }).then(data => {
            addReviewToPage(title, content, selectedRating, 'currentUsername');
            // 입력 필드 초기화
            document.getElementById('review-title').value = '';
            document.getElementById('review-content').value = '';
            updateStars(0);
        }).catch(error => {
            console.error('Error:', error);
            alert('리뷰 제출 중 문제가 발생했습니다: ' + error.message);
        });
    }

    function addReviewToPage(title, content, stars, username) {
        const reviewElement = document.createElement('div');
        reviewElement.classList.add('review');
        reviewElement.innerHTML = `
            <div class="review-user"><strong>${username}</strong></div>
            <div class="review-title">${'⭐'.repeat(stars)} - ${title}</div>
            <div class="review-content">${content}</div>
        `;
        document.querySelector('.user-reviews').appendChild(reviewElement);
    }

    // 리뷰 불러오기 함수
    function loadReviews(productId) {
        fetch(`http://localhost:8080/api/itemDetail/${productId}/reviews`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch reviews');
            }
            return response.json();
        })
        .then(reviews => {
            reviews.forEach(review => {
                addReviewToPage(review.title, review.content, review.star, review.username);
            });
        })
        .catch(error => {
            console.error('Error loading reviews:', error);
        });
    }
});
