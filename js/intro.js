// 인트로 애니메이션 초기화
function initIntroAnimation() {
    const introSection = document.querySelector('.intro-section');
    const cosmicStar = document.querySelector('.cosmic-breathing-star');
    const clickButton = document.querySelector('.click-button');
    const mainScreen = document.querySelector('.main-screen');
    
    if (!introSection || !cosmicStar || !clickButton || !mainScreen) return;
    
    // 페이지 로드 시 스크롤 비활성화
    document.body.style.overflow = 'hidden';
    
    // Click 버튼 클릭 이벤트
    clickButton.addEventListener('click', function() {
        const breathingStar = cosmicStar.querySelector('.breathing-star');
        
        // 0. 클릭과 동시에 버튼 즉시 숨기기 (애니메이션과 트랜지션 모두 무시)
        clickButton.style.animation = 'none';
        clickButton.style.transition = 'none';
        clickButton.style.opacity = '0';
        clickButton.style.pointerEvents = 'none';
        clickButton.style.visibility = 'hidden';
        
        // 1. 별 폭발 애니메이션 시작
        if (breathingStar) {
            breathingStar.classList.add('exploding');
        }
        
        // 2. 0.65초 후 main-screen 페이드인 시작
        setTimeout(() => {
            mainScreen.classList.add('fade-in');
        }, 650);
        
        // 3. 0.8초 후 (별 폭발 애니메이션 완료 후) intro-section 페이드아웃 시작
        setTimeout(() => {
            introSection.classList.add('fade-out');
            cosmicStar.classList.add('explode');
        }, 800);
        
        // 4. 1.5초 후 whats-section--intro 활성화
        setTimeout(() => {
            // intro-section과 cosmic-star 완전 제거
            introSection.style.display = 'none';
            cosmicStar.style.display = 'none';
            
            // wheel-move intro 섹션 활성화
            if (window.activateIntroSection) {
                window.activateIntroSection();
            }
            
            // 스크롤 활성화 (wheel-move가 스크롤을 제어함)
            document.body.style.overflow = 'auto';
        }, 1500);
    });
}

// DOM 로드 완료 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    initIntroAnimation();
}); 