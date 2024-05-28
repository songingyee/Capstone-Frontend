
function toggleHeart(button, isActive) {
    if (isActive) {
        button.classList.add('active');
    } else {
        button.classList.remove('active');
    }
}

function toggleProduct(productId, button) {
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

// 페이지 로드시 버튼 상태 로드
window.onload = function() {
    loadButtonStates();
}
