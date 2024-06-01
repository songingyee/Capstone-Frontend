let currentPage = 1;
const itemsPerPage = 12; // 페이지당 12개의 상품을 표시
let totalPages = 1; // 총 페이지 수 (초기 값)

async function loadProducts(page) {
    try {
        // 페이지 번호를 URL에 추가하여 데이터 요청
        const response = await fetch(`https://99590e5f-333b-462e-82b8-b3026b4fa106.mock.pstmn.io/women?page=${page}`);
        const data = await response.json();

        // 받아온 데이터를 화면에 추가
        const productList = document.getElementById('productList');
        productList.innerHTML = ''; // 이전에 추가된 내용을 모두삭제

        // 페이지에 표시할 데이터 계산
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageData = data.data.slice(startIndex, endIndex);

        // 각 상품에 대한 정보를 반복하여 HTML에 추가합니다.
        pageData.forEach(product => {
            const listItem = document.createElement('li');
            listItem.id = `product${product.id}`;

            listItem.innerHTML = `
                <div class="img" style="position: relative;">
                    <button type="button" name="button" class="heart" onclick="toggleButton('${listItem.id}', this)"></button>
                    <a href="#" class="producta">
                        <img src="${product.image}" alt="Product Image" class="productimg">
                    </a>
                </div>
                <div class="spacer"></div>
                <div class="text-max">
                    <div class="text_wrap">
                        <div class="brand">${product.company}</div>
                    </div>
                    <div class="spacer1"></div>
                    <div class="size">${product.size}</div>
                    <div class="spacer1"></div>
                    <div class="manual">${product.itemName}</div>
                    <div class="spacer1"></div>
                    <div class="price">
                        <span class="base_price">${product.price}원</span>
                    </div>
                </div>
            `;
            productList.appendChild(listItem);
        });

        // 페이지 로드시 버튼 상태 로드
        loadButtonStates();

        // 전체 페이지 수를 업데이트합니다.
        totalPages = Math.ceil(data.data.length / itemsPerPage);

        // 페이지네이션 업데이트
        updatePagination(page);

    } catch (error) {
        console.error('Failed to load products:', error);
    }
}

function updatePagination(page) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    // 이전 페이지 그룹으로 이동 버튼
    if (page > 1) {
        const prevGroup = document.createElement('button');
        prevGroup.innerText = '<';
        prevGroup.onclick = () => changePage(currentPage - 1);
        pagination.appendChild(prevGroup);
    }

    // 페이지 번호 버튼
    const maxVisiblePages = 10;
    const startPage = Math.floor((page - 1) / maxVisiblePages) * maxVisiblePages + 1;
    const endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement('button');
        pageButton.innerText = i;
        if (i === page) {
            pageButton.classList.add('active');
        }
        pageButton.onclick = () => changePage(i);
        pagination.appendChild(pageButton);
    }

    // 다음 페이지 그룹으로 이동 버튼
    if (page < totalPages) {
        const nextGroup = document.createElement('button');
        nextGroup.innerText = '>';
        nextGroup.onclick = () => changePage(currentPage + 1);
        pagination.appendChild(nextGroup);
    }
}

function changePage(page) {
    if (page < 1 || page > totalPages) {
        return;
    }
    currentPage = page;
    loadProducts(page);
}

function toggleHeart(button, isActive) {
    if (isActive) {
        button.classList.add('clicked');
    } else {
        button.classList.remove('clicked');
    }
}

function toggleButton(productId, button) {
    const productDiv = document.getElementById(productId);
    const productHTML = productDiv.innerHTML;

    // localStorage에서 저장된 제품 목록을 가져옴
    let likedProducts = localStorage.getItem('likedProducts');
    likedProducts = likedProducts ? JSON.parse(likedProducts) : [];

    // 이미 추가된 제품인지 확인
    const index = likedProducts.findIndex(product => product.id === productId);
    if (index === -1) {
        likedProducts.push({ id: productId, html: productHTML });
        localStorage.setItem('likedProducts', JSON.stringify(likedProducts));
        alert('위시리스트에 추가되었습니다.');
    } else {
        likedProducts.splice(index, 1);
        localStorage.setItem('likedProducts', JSON.stringify(likedProducts));
        alert('위시리스트에서 제거되었습니다.');
    }

    // 버튼 상태를 설정함
    toggleHeart(button, index === -1);
    saveButtonState(productId, index === -1);
}

function saveButtonState(productId, isActive) {
    let buttonStates = localStorage.getItem('buttonStates');
    buttonStates = buttonStates ? JSON.parse(buttonStates) : {};
    buttonStates[productId] = isActive;
    localStorage.setItem('buttonStates', JSON.stringify(buttonStates));
}

function loadButtonStates() {
    let buttonStates = localStorage.getItem('buttonStates');
    buttonStates = buttonStates ? JSON.parse(buttonStates) : {};
    for (const [productId, isActive] of Object.entries(buttonStates)) {
        const button = document.querySelector(`#${productId} .heart`);
        if (button) {
            toggleHeart(button, isActive);
        }
    }
}

// 페이지가 로드될 때 옷 정보를 불러오는 함수를 호출합니다. 초기 페이지 번호를 1로 설정합니다.
window.onload = function() {
    loadProducts(currentPage); // 페이지 1의 데이터를 불러옵니다.
};
