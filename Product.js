document.addEventListener('DOMContentLoaded', function() {
    const reviewForm = document.getElementById('review-form');
    const stars = document.querySelectorAll('.star');
    let selectedRating = 0; // 선택된 별점 초기화

    function displayProductDetails(data) {
        document.getElementById('brand').textContent += data.Brand;
        document.getElementById('product-name').textContent += data.Product;
        document.getElementById('type').textContent += data.TYPE;
        document.getElementById('size').textContent += data.Size;
        document.getElementById('length').textContent += data['Total Length'];
        document.getElementById('waist').textContent += data['Waist width'];
        document.getElementById('gender').textContent += data.gender;
        document.getElementById('price').textContent += data.price + ' USD';
        document.getElementById('product-image').src = data.image;
        document.getElementById('buy-now-button').onclick = () => window.open(data.link, '_blank');
    }

    const params = new URLSearchParams(window.location.search);
    const productId = params.get('productId');
    loadProductDetails(productId);

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
        submitReview();
    });

    function submitReview() {

        const title = document.getElementById('review-title').value;
        const content = document.getElementById('review-content').value;

        if (!title || !content || selectedRating === 0) {
            alert('모든 필드를 채워주세요.');
            return;
        }

        fetch('http://localhost:8080/api/itemDetail/${productId}', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
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
            addReviewToPage(title, content, selectedRating);
            // 입력 필드 초기화
            document.getElementById('review-title').value = '';
            document.getElementById('review-content').value = '';
            updateStars(0);
        }).catch(error => {
            console.error('Error:', error);
            alert('리뷰 제출 중 문제가 발생했습니다: ' + error.message);
        });
    }

    function addReviewToPage(title, content, stars) {
        const reviewElement = document.createElement('div');
        reviewElement.innerHTML = `<strong>${title}</strong><p>${content}</p><p>Rating: ${'⭐'.repeat(stars)}</p>`;
        document.querySelector('.user-reviews').appendChild(reviewElement);
    }



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


});