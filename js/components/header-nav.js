/**
 * Header Navigation JavaScript
 * 링크 클릭 시 부드러운 스크롤과 intro 건너뛰기 처리
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Header Nav JavaScript 초기화');
    
    // 모든 header-nav 링크 선택
    const navLinks = document.querySelectorAll('.header-nav__link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // What's 링크인 경우 특별 처리
            if (href === '#main-screen') {
                e.preventDefault(); // 기본 링크 동작 방지
                
                console.log('What\'s 링크 클릭됨 - intro 건너뛰고 main-screen으로 스크롤');
                
                // intro 강제 숨김
                hideIntroSection();
                
                // main-screen으로 스크롤
                scrollToMainScreen();
                
                return false;
            }
            
            // 다른 섹션으로의 링크는 정상 처리
            if (href.startsWith('#') && href !== '#main-screen') {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
                
                return false;
            }
            
            // 외부 링크(page.html 등)는 그대로 진행
        });
    });
});

function hideIntroSection() {
    const introSection = document.querySelector('.intro-section');
    const cosmicStar = document.querySelector('.cosmic-breathing-star');
    const mainScreen = document.querySelector('.main-screen');
    
    if (introSection) {
        introSection.style.display = 'none';
        introSection.style.opacity = '0';
        introSection.style.visibility = 'hidden';
        introSection.style.pointerEvents = 'none';
        introSection.style.zIndex = '-1';
    }
    
    if (cosmicStar) {
        cosmicStar.style.display = 'none';
        cosmicStar.style.opacity = '0';
        cosmicStar.style.visibility = 'hidden';
        cosmicStar.style.zIndex = '-1';
    }
    
    if (mainScreen) {
        mainScreen.style.opacity = '1';
        mainScreen.style.display = 'block';
        mainScreen.classList.add('fade-in');
    }
    
    // 스크롤 활성화
    document.body.style.overflow = 'auto';
    
    // wheel-move intro 활성화
    if (window.activateIntroSection) {
        window.activateIntroSection();
    }
    
    console.log('Intro section 강제 숨김 완료');
}

function scrollToMainScreen() {
    setTimeout(() => {
        const mainScreenElement = document.getElementById('main-screen');
        if (mainScreenElement) {
            mainScreenElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            console.log('main-screen으로 스크롤 완료');
        }
    }, 100);
}
