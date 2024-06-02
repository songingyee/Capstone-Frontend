

window.onload = function() {
    currentSlide(1); // 페이지가 로드될 때 1번째 로드
};

var slideIndex = 1;
showSlides(slideIndex);

// 이전/다음 버튼을 누를 때 슬라이드 이동
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// 동그라미 네비게이션을 클릭하여 슬라이드 이동
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}    
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";  
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";  
  dots[slideIndex-1].className += " active";
}
//동그라미네비게이션
