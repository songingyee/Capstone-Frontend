document.addEventListener('DOMContentLoaded', function() {
    const productList = document.getElementById('productList');
    const pagination = document.getElementById('pagination');
    const pageSize = 12; // 한 페이지에 표시할 상품 수
    let currentPage = 1;

    function fetchItems(page) {
        fetch(`http://localhost:8080/api/men?page=${page}`, {
            method: 'GET',
            credentials: 'include' // Include credentials in the request
        })
        .then(response => response.json())
        .then(data => {
            renderItems(data.data);
            renderPagination(data.pageInfo);
        })
        .catch(error => console.error('Error fetching data:', error));
    }

    function renderItems(items) {
        productList.innerHTML = '';
        items.forEach(item => {
            const itemElement = document.createElement('li');
            itemElement.innerHTML = `
                <div class="product-item">
                    <img src="${item.image}" alt="${item.itemName}" class="productimg">
                    <div class="product-info">
                        <h3 class="product-name">${item.itemName}</h3>
                        <p class="product-price">${item.price}원</p>
                        <p class="product-company">${item.company}</p>
                        <p class="product-size">Size: ${item.size}</p>
                    </div>
                    <button class="heart" data-item-id="${item.id}"></button>
                </div>
            `;
            productList.appendChild(itemElement);

            // Add event listener for the heart button
            const heartButton = itemElement.querySelector('.heart');
            heartButton.addEventListener('click', function() {
                const itemId = heartButton.getAttribute('data-item-id');
                if (!heartButton.classList.contains('clicked')) {
                    addCart(itemId, heartButton);
                } else {
                    deleteCartItem(itemId, heartButton);
                }
            });
        });
    }

    function addCart(itemId, heartButton) {
        fetch(`http://localhost:8080/api/addCart/${itemId}`, {
            method: 'POST',
            credentials: 'include'
        })
        .then(response => {
            if (response.ok) {
                toggleHeart(heartButton, true);
            } else {
                console.error('Error adding item to cart');
            }
        })
        .catch(error => console.error('Error adding item to cart:', error));
    }

    function deleteCartItem(itemId, heartButton) {
        fetch(`http://localhost:8080/api/deleteCartItem/${itemId}`, {
            method: 'DELETE',
            credentials: 'include'
        })
        .then(response => {
            if (response.ok) {
                toggleHeart(heartButton, false);
            } else {
                console.error('Error deleting item from cart');
            }
        })
        .catch(error => console.error('Error deleting item from cart:', error));
    }

    function toggleHeart(button, isActive) {
        if (isActive) {
            button.classList.add('clicked');
        } else {
            button.classList.remove('clicked');
        }
    }

    function renderPagination(pageInfo) {
        pagination.innerHTML = '';
        const { page, totalPages } = pageInfo;

        if (page > 1) {
            const prevPage = document.createElement('button');
            prevPage.textContent = 'Previous';
            prevPage.addEventListener('click', () => {
                currentPage -= 1;
                fetchItems(currentPage);
            });
            pagination.appendChild(prevPage);
        }

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            if (i === page) {
                pageButton.classList.add('active');
            } else {
                pageButton.addEventListener('click', () => {
                    currentPage = i;
                    fetchItems(currentPage);
                });
            }
            pagination.appendChild(pageButton);
        }

        if (page < totalPages) {
            const nextPage = document.createElement('button');
            nextPage.textContent = 'Next';
            nextPage.addEventListener('click', () => {
                currentPage += 1;
                fetchItems(currentPage);
            });
            pagination.appendChild(nextPage);
        }
    }

    fetchItems(currentPage);
});
