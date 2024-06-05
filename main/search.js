function openSearchWindow() {
    const searchQuery = document.getElementById('search-bar').value;
    if (searchQuery.trim() !== '') {
        const searchUrl = `search_results.html?query=${encodeURIComponent(searchQuery)}`;
        window.location.href = searchUrl;
    }
}

function renderResults(data, query) {
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = '';

    data.data.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('item');

        const imageElement = document.createElement('img');
        imageElement.src = item.image;
        imageElement.alt = item.itemName;
        imageElement.addEventListener('click', () => {
            // 이미지 클릭 시 상품 상세 페이지로 이동
            window.location.href = `Product.html?id=${item.id}`;
        });

        itemElement.appendChild(imageElement);

        const nameElement = document.createElement('h2');
        nameElement.textContent = item.itemName;
        itemElement.appendChild(nameElement);

        const priceElement = document.createElement('p');
        priceElement.textContent = `${item.price}원`;
        itemElement.appendChild(priceElement);

        const companyElement = document.createElement('p');
        companyElement.textContent = `${item.company}`;
        itemElement.appendChild(companyElement);

        const sizeElement = document.createElement('p');
        sizeElement.textContent = `Size: ${item.size}`;
        itemElement.appendChild(sizeElement);

        resultsContainer.appendChild(itemElement);
    });

    // 페이지 정보 렌더링
    const pageInfo = data.pageInfo;
    const totalPages = Math.ceil(data.pageInfo.totalElements / data.pageInfo.size);
    const pagination = document.createElement('div');
    pagination.classList.add('pagination');

    if (pageInfo.page > 1) {
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.addEventListener('click', () => searchItems(query, pageInfo.page - 1));
        pagination.appendChild(prevButton);
    }

    if (pageInfo.page < totalPages) {
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.addEventListener('click', () => searchItems(query, pageInfo.page + 1));
        pagination.appendChild(nextButton);
    }

    resultsContainer.appendChild(pagination);
}

async function searchItems(query, page) {
    try {
        const response = await fetch(`http://localhost:8800/api/search?content=${encodeURIComponent(query)}&page=${page}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        renderResults(data, query);
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('query');

    if (query) {
        searchItems(query, 1);
    }
});
