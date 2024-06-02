document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('file-input');
    const deleteButton = document.getElementById('delete-button');
    const completedMessage = document.getElementById('completed-message');

    fileInput.addEventListener('change', function() {
        const file = this.files[0];
        const fileName = file.name;
        completedMessage.innerText = `Completed!\n ${fileName}`;
        completedMessage.style.display = 'block';
        deleteButton.style.display = 'inline-block';

        // 파일을 FormData에 추가합니다.
        const formData = new FormData();
        formData.append('file', file);

        // API 엔드포인트로 POST 요청을 보냅니다.
        fetch('http://localhost:8080/api/upload', {
            method: 'POST',
            body: formData,
            // 세션 ID를 쿠키에 설정합니다.
            credentials: 'same-origin'
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Network response was not ok.');
        })
        .then(data => {
            // 서버로부터의 응답을 처리합니다.
            console.log('Server response:', data);
        })
        .catch(error => {
            console.error('Error uploading file:', error);
        });
    });

    deleteButton.addEventListener('click', function(event) {
        event.preventDefault();
        fileInput.value = '';
        deleteButton.style.display = 'none';
        completedMessage.style.display = 'none';
    });
});  


// /api/recommend로 GET 요청을 보내어 추천 상품 정보를 가져옵니다.
fetch('http://localhost:8080/api/recommend')
     // 세션 ID를 쿠키에 설정합니다.
     credentials: 'same-origin'
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // 추천 상품 정보를 HTML에 동적으로 추가합니다.
        const recommendDiv = document.getElementById('recommend');
        
         // 데이터가 배열이 아닌 경우에 대비하여 배열로 감싸줍니다.
            if (!Array.isArray(data)) {
                data = [data];
            }

        data.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('item');
            itemDiv.innerHTML = `
                <div class="item-info">
                    <img src="${item.image}" alt="${item.itemName}">
                    <h3>${item.company}</h3>
                    <p>${item.itemName}</p>
                    <p>${item.price} 원</p>
                    <p><a href="${item.siteUrl}" target="_blank">More Info</a></p>
                </div>
            `;
            recommendDiv.appendChild(itemDiv);
        });
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });