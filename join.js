
document.addEventListener("DOMContentLoaded", () => {
    const selectAllCheckbox = document.querySelector(".select-all");

    const individualCheckboxes = document.querySelectorAll(".agreement-table .checkbox input[type='checkbox']");

    selectAllCheckbox.addEventListener("change", (e) => {
        const isChecked = e.target.checked;
        individualCheckboxes.forEach((checkbox) => {
            checkbox.checked = isChecked;
        });
    });

    individualCheckboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", () => {
            const allChecked = Array.from(individualCheckboxes).every((cb) => cb.checked);
            selectAllCheckbox.checked = allChecked;
        });
    });
});
/////////////////////////////////////////////////////////////////////////////////////
function showPopup(popupId) { /* 팝업을 표시하는 함수 */
    document.querySelector(`#${popupId}`).style.display = "block"; // 팝업 표시
    document.querySelector(".popup-overlay").style.display = "block"; // 오버레이 표시
}

function hidePopup(popupId) { /* 팝업을 숨기는 함수 */
    document.querySelector(`#${popupId}`).style.display = "none"; // 팝업 숨김
    document.querySelector(".popup-overlay").style.display = "none"; // 오버레이 숨김
}
/////////////////////////////////////////////////////////////////////////////////////

function undateEmailDomain() {
    const emailField = document.getElementsByName("email")[0];
    const selectedDomain = document.getElementsByName("mailslc")[0].value;

    if (selectedDomain === "sel") {
        emailField.value = ""; // 직접 입력을 위해 필드 초기화
        emailField.readOnly = false; // 입력 가능하게 설정
    } else {
        emailField.value = selectedDomain; // 선택된 도메인으로 설정
        emailField.readOnly = true; // 읽기 전용으로 설정
    }
}

function passwords1() {
    var pwd = document.getElementById("pwd").value; // 비밀번호 필드 값
    var message = document.getElementById("error-message"); // 오류 메시지 표시 위치

    var isCorrectLength = pwd.length >= 8 && pwd.length <= 10; // 길이 검사
    var hasLetter = /[a-zA-Z]/.test(pwd); // 영문 포함 여부
    var hasNumber = /\d/.test(pwd); // 숫자 포함 여부

    if (pwd.length < 8) {
        message.textContent = "⚠️ 비밀번호는 8~10자 사이로 입력해주세요.";
        message.style.color = "red";
    } else if (!hasLetter || !hasNumber) {
        message.textContent = "⚠️ 영어와 숫자를 모두 사용하여 입력해주세요.";
        message.style.color = "red";
    } else {
        message.textContent = ""; // 모든 조건이 만족되면 메시지 제거
    }
}

function checkPasswords() { // 비밀번호 비교 함수
    var pwd1 = document.getElementById("pwd").value; // 비밀번호 필드 값
    var pwd2 = document.getElementById("pwdCheck").value; // 비밀번호 확인 필드 값
    var message = document.getElementById("passwordMessage"); // 메시지 출력 위치
if (pwd1.length > 0 && pwd2.length > 0) {    
    if (pwd1 === pwd2) { // 비밀번호가 일치할 경우
        message.textContent = "비밀번호가 일치합니다."; // 메시지 내용
        message.style.color = "green"// 메시지 색상
    } else { // 비밀번호가 일치하지 않을 경우
        message.textContent = "⚠️ 비밀번호가 일치하지 않습니다."; // 메시지 내용
        message.style.color = "red"; // 메시지 색상
    }
}
}

// DOMContentLoaded 이벤트를 사용하여 문서가 로드될 때 실행
document.addEventListener("DOMContentLoaded", function() {
// 윈도우 리사이즈 이벤트에 대한 핸들러
function updatePlaceholder() {
// 현재 윈도우 너비를 가져옴
var windowWidth = window.innerWidth;

// 입력 필드 요소 가져오기
var emailInput = document.querySelector("#email");
var nameInput = document.querySelector("#myname");
var pwdInput = document.querySelector("#pwd");
var pwdCheckInput = document.querySelector("#pwdCheck");

// 너비가 768 이하일 때
if (windowWidth <= 768) {
    if (emailInput) {
        emailInput.setAttribute("placeholder", "이메일 입력을 입력해 주세요");
    }
    if (nameInput) {
        nameInput.setAttribute("placeholder", "이름을 입력해 주세요");
    }
    if (pwdInput) {
        pwdInput.setAttribute("placeholder", "비밀번호를 입력해주세요");
    }
    if (pwdCheckInput) {
        pwdCheckInput.setAttribute("placeholder", "비밀번호를 다시 입력해 주세요");
    }
} else {
    // 너비가 768을 초과할 때
    if (emailInput) {
        emailInput.setAttribute("placeholder", "이메일");
    }
    if (nameInput) {
        nameInput.setAttribute("placeholder", "ex) 홍길동");
    }
    if (pwdInput) {
        pwdInput.setAttribute("placeholder", "영문+숫자 조합");
    }
    if (pwdCheckInput) {
        pwdCheckInput.setAttribute("placeholder", "");
    }
}
}

// 윈도우 리사이즈 시 플레이스홀더 업데이트
window.addEventListener("resize", updatePlaceholder);

// 페이지 로드 시 한 번 실행
updatePlaceholder();
});

////////////////////////////////////////////////////////////////////////////
function moveToMain() {
    // 메인 화면으로 이동
    window.location.href = 'main.html';
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////api


document.addEventListener('DOMContentLoaded', function() {
    // 확인 버튼 클릭 시
    document.querySelector('.but4').addEventListener('click', function() {
        // 폼 데이터 수집
        const email = document.getElementById('email').value;
        const password = document.getElementById('pwd').value;
        const name = document.getElementById('myname').value;
        const gender = document.querySelector('input[name="gender"]:checked').value;
        const age = document.getElementById('age').value;
        const height = document.getElementById('height').value;
        const weight = document.getElementById('weight').value;
        const waist = document.getElementById('waist').value;
        const eventInfo = document.querySelector('input[name="event_info"]:checked').value;

        // JSON 형식으로 변환
        const userData = {
            email: email,
            password: password,
            name: name,
            gender: gender,
            age: age,
            height: height,
            weight: weight,
            waist: waist,
            event_info: eventInfo
        };

        // 서버로 전송 (목 서버 URL 사용)
    // 서버로 전송 (목 서버 URL 사용)
    fetch('https://e2f5eafc-c6e1-4743-95b4-7c57406f6815.mock.pstmn.io/join', { // 실제 목 서버 URL로 대체
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      // 사용자에게 성공 메시지 표시 등
    })
    .catch(error => {
      console.error('Error:', error);
      // 사용자에게 오류 메시지 표시 등
    });
  });

});
