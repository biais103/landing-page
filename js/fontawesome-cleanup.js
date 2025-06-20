// FontAwesome Attribution 제거
document.addEventListener('DOMContentLoaded', function() {
    // FontAwesome attribution 요소들을 제거하는 함수
    function removeFontAwesomeAttribution() {
        // 하단에 나타나는 FontAwesome copyright 요소들 찾기
        const attributionSelectors = [
            'div[style*="position: fixed"][style*="bottom: 0"]',
            'div[style*="z-index: 999999"]',
            'div[style*="font-family: FontAwesome"]',
            'div[style*="font-family: \'Font Awesome\'"]',
            'div[style*="Copyright 2024 Fonticons"]',
            'div[style*="fontawesome.com"]',
            'div[style*="License -"]',
            '[data-fa-kit]',
            '.fa-kit-attribution'
        ];

        attributionSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (element && element.textContent.includes('Font Awesome') || 
                    element.textContent.includes('fontawesome') ||
                    element.textContent.includes('Copyright 2024 Fonticons') ||
                    element.textContent.includes('License -')) {
                    element.remove();
                }
            });
        });

        // body의 마지막 자식 요소 중 FontAwesome attribution 확인 및 제거
        const bodyChildren = document.body.children;
        const lastChild = bodyChildren[bodyChildren.length - 1];
        
        if (lastChild && 
            lastChild.style.position === 'fixed' && 
            (lastChild.textContent.includes('Font Awesome') || 
             lastChild.textContent.includes('fontawesome.com'))) {
            lastChild.remove();
        }
    }

    // 페이지 로드 직후 실행
    removeFontAwesomeAttribution();

    // 약간의 지연 후 다시 실행 (FontAwesome이 늦게 로드될 수 있음)
    setTimeout(removeFontAwesomeAttribution, 500);
    setTimeout(removeFontAwesomeAttribution, 1000);
    setTimeout(removeFontAwesomeAttribution, 2000);

    // DOM 변경 감지하여 새로 추가되는 attribution 요소 제거
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // Element node
                        const element = node;
                        if ((element.style && element.style.position === 'fixed') || 
                            element.textContent.includes('Font Awesome') ||
                            element.textContent.includes('fontawesome.com') ||
                            element.textContent.includes('Copyright 2024 Fonticons')) {
                            element.remove();
                        }
                    }
                });
            }
        });
    });

    // body 요소의 변경사항 감지
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}); 