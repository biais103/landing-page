// 모든 이미지 가져오기
const images = document.querySelectorAll('.image');
let currentIndex = 0;

// 이미지 전환 함수 (깜빡임 절대 없음)
function showImage(index) {
    // 이전에 활성화된 이미지만 찾아서 숨기기
    const prevActive = document.querySelector('.image.active');
    if (prevActive) {
        prevActive.classList.remove('active');
    }
    
    // 새 이미지 보이기
    images[index].classList.add('active');
}

// 휠 이벤트 처리
document.addEventListener('wheel', function(event) {
    if (event.deltaY > 0) {
        // 아래로 스크롤 - 다음 이미지
        if (currentIndex < images.length - 1) {
            currentIndex++;
            showImage(currentIndex);
        }
    } else {
        // 위로 스크롤 - 이전 이미지
        if (currentIndex > 0) {
            currentIndex--;
            showImage(currentIndex);
        }
    }
});

// 터치 이벤트 처리
let touchStartY = 0;

document.addEventListener('touchstart', function(event) {
    touchStartY = event.touches[0].clientY;
});

document.addEventListener('touchend', function(event) {
    const touchEndY = event.changedTouches[0].clientY;
    const difference = touchStartY - touchEndY;
    
    if (Math.abs(difference) > 50) {
        if (difference > 0) {
            if (currentIndex < images.length - 1) {
                currentIndex++;
                showImage(currentIndex);
            }
        } else {
            if (currentIndex > 0) {
                currentIndex--;
                showImage(currentIndex);
            }
        }
    }
});