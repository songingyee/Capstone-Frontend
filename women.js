
async function loadProducts() {
    try {
        // 목 서버에서 데이터를 받아옵니다.
        const response = await fetch('http://localhost:8080/api/women?page=X페이지');
        const data = await response.json();

        // 받아온 데이터를 화면에 추가합니다.
        const productList = document.getElementById('productList');
        productList.innerHTML = ''; // 이전에 추가된 내용을 모두 지웁니다.

        // 각 상품에 대한 정보를 반복하여 HTML에 추가합니다.
        data.data.forEach(product => { // 데이터는 'data' 속성에 있습니다.
            const listItem = document.createElement('li');
            listItem.id = `product${product.id}`;

            listItem.innerHTML = `
                <div class="img" style="position: relative;">
                    <button type="button" name="button" class="heart" onclick="toggleButton('${listItem.id}', this)"></button>
                    <a href="#" class="producta">
                        <img src="${product.image}" alt="Product Image" class="productimg">
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
                    <div class="spacer2"></div>
                    </div>
                </div>
                </a>
            `;
            productList.appendChild(listItem);
        });

        // 페이지 로드시 버튼 상태 로드
        loadButtonStates();







    } catch (error) {
        console.error('Failed to load products:', error);
    }
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

// 페이지가 로드될 때 옷 정보를 불러오는 함수를 호출합니다.
window.onload = loadProducts;
