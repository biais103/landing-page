/**
 * Benefit 섹션 스크롤 애니메이션
 * 요소들이 화면에 나타날 때 fade-in 효과 적용
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Benefit 스크롤 애니메이션 초기화');
    
    // 애니메이션할 요소들 선택
    const observeElements = [
        '.benefit-headline',
        '.benefit-container',
        '.benefit-description',
        '.features-headline',
        '.features-container',
        '.feature-description',
        '.contact-headline',
        '.contact-container'
    ];
    
    // Intersection Observer 설정
    const observerOptions = {
        threshold: 0.1, // 10%가 보이면 트리거
        rootMargin: '0px 0px -50px 0px' // 약간의 여백
    };
    
    // Observer 콜백 함수
    function handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // visible 클래스 추가로 애니메이션 트리거
                entry.target.classList.add('visible');
                console.log('요소가 보이기 시작:', entry.target.className);
            }
        });
    }
    
    // Observer 생성
    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    
    // 각 요소를 관찰 대상에 추가
    observeElements.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            if (element) {
                observer.observe(element);
                console.log('관찰 대상 추가:', selector);
            }
        });
    });
    
    // 페이지 로드 시 즉시 보이는 요소들도 체크
    setTimeout(() => {
        observeElements.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (element) {
                    const rect = element.getBoundingClientRect();
                    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
                    
                    if (isVisible) {
                        element.classList.add('visible');
                        console.log('즉시 표시:', selector);
                    }
                }
            });
        });
    }, 100);
});
