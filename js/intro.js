// 인트로 애니메이션 초기화
function initIntroAnimation() {
    const introSection = document.querySelector('.intro-section');
    const cosmicStar = document.querySelector('.cosmic-breathing-star');
    const clickButton = document.querySelector('.click-button');
    const mainScreen = document.querySelector('.main-screen');
    
    if (!introSection || !cosmicStar || !clickButton || !mainScreen) return;
    
    // URL 해시 체크 - 특정 섹션으로 바로 이동하는 경우 intro 건너뛰기
    const urlHash = window.location.hash;
    if (urlHash && (urlHash === '#main-screen' || urlHash.startsWith('#main-screen'))) {
        skipIntroAndGoToMainScreen();
        return;
    }
    
    // 페이지 로드 시 스크롤 비활성화 (intro가 필요한 경우에만)
    document.body.style.overflow = 'hidden';
    
    // Click 버튼 클릭 이벤트
    clickButton.addEventListener('click', function() {
        performIntroTransition();
    });
}

// intro를 건너뛰고 바로 main-screen으로 이동
function skipIntroAndGoToMainScreen() {
    const introSection = document.querySelector('.intro-section');
    const cosmicStar = document.querySelector('.cosmic-breathing-star');
    const mainScreen = document.querySelector('.main-screen');
    
    // intro 요소들 즉시 숨기기
    if (introSection) {
        introSection.style.display = 'none';
    }
    if (cosmicStar) {
        cosmicStar.style.display = 'none';
    }
    
    // main-screen 즉시 표시
    if (mainScreen) {
        mainScreen.classList.add('fade-in');
    }
    
    // 스크롤 활성화
    document.body.style.overflow = 'auto';
    
    // wheel-move intro 섹션 즉시 활성화
    if (window.activateIntroSection) {
        window.activateIntroSection();
    }
    
    // main-screen으로 스크롤 (약간의 지연 후)
    setTimeout(() => {
        const mainScreenElement = document.getElementById('main-screen');
        if (mainScreenElement) {
            mainScreenElement.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }, 100);
}

// 기존 intro 전환 애니메이션
function performIntroTransition() {
    const introSection = document.querySelector('.intro-section');
    const cosmicStar = document.querySelector('.cosmic-breathing-star');
    const clickButton = document.querySelector('.click-button');
    const mainScreen = document.querySelector('.main-screen');
    
    if (!introSection || !cosmicStar || !clickButton || !mainScreen) return;
    
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
}

// DOM 로드 완료 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    initIntroAnimation();
});

// URL 해시 변경 시에도 처리 (다른 페이지에서 #main-screen으로 이동하는 경우)
window.addEventListener('hashchange', function() {
    const urlHash = window.location.hash;
    if (urlHash && (urlHash === '#main-screen' || urlHash.startsWith('#main-screen'))) {
        skipIntroAndGoToMainScreen();
    }
}); 