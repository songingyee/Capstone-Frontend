document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('file-input');
    const deleteButton = document.getElementById('delete-button');
    const completedMessage = document.getElementById('completed-message');
    const recommendationsContainer = document.getElementById('recommendations');

    // 세션 유효성 확인
    fetch('http://localhost:8080/api/session', {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => {
        if (response.ok) {
            // 유효한 세션인 경우 계속 진행
            initializeEventListeners();
        } else {
            // 유효하지 않은 세션인 경우 로그인 페이지로 이동
            window.location.href = 'login.html';
        }
    })
    .catch(error => {
        console.error('Session check failed:', error);
        window.location.href = 'login.html'; // 에러 발생 시 로그인 페이지로 이동
    });

    function initializeEventListeners() {
        fileInput.addEventListener('change', handleFileUpload);
        deleteButton.addEventListener('click', handleDeleteButtonClick);
    }

    function handleFileUpload() {
        const file = this.files[0];
        if (!file) {
            return;
        }
        const fileName = file.name;
        completedMessage.innerText = `Completed!\n ${fileName}`;
        completedMessage.style.display = 'block';
        deleteButton.style.display = 'inline-block';

        const formData = new FormData();
        formData.append('file', file);

        fetch('http://localhost:8080/api/upload', {
            method: 'POST',
            body: formData,
            credentials: 'include'
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Network response was not ok.');
        })
        .then(data => {
            console.log('Server response:', data);
            fetchRecommendations();
        })
        .catch(error => {
            console.error('Error uploading file:', error);
        });
    }

    function handleDeleteButtonClick(event) {
        event.preventDefault();
        fileInput.value = '';
        deleteButton.style.display = 'none';
        completedMessage.style.display = 'none';
        recommendationsContainer.innerHTML = '';
    }

    function fetchRecommendations() {
        fetch('http://localhost:8080/api/recommend', {
            method: 'GET',
            credentials: 'include'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayRecommendations(data);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    }

    function displayRecommendations(recommendations) {
        recommendationsContainer.innerHTML = '';

        if (!Array.isArray(recommendations)) {
            recommendations = [recommendations];
        }

        recommendations.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('recommendation');
            itemDiv.innerHTML = `
                <div class="recommendation-info">
                    <img src="${item.image}" alt="${item.itemName}">
                    <h3>${item.company}</h3>
                    <p>${item.itemName}</p>
                    <p>${item.price} 원</p>
                    <p><a href="${item.siteUrl}" target="_blank">More Info</a></p>
                </div>
            `;
            recommendationsContainer.appendChild(itemDiv);
        });
    }
});
