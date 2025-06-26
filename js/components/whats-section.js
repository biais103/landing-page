// Whats Section Component - 메인 섹션 관리

function initWhatsSection() {
    // bg-1 요소를 정확히 찾기
    const bg1Element = document.querySelector('.bg-1');
    
    if (!bg1Element) {
        console.error('bg-1 요소를 찾을 수 없습니다.');
        return;
    }
    
    // main-screen이 숨겨져 있다면 표시
    const mainScreen = document.querySelector('.main-screen');
    if (mainScreen) {
        const mainStyle = window.getComputedStyle(mainScreen);
        if (mainStyle.display === 'none') {
            mainScreen.style.display = 'block';
            mainScreen.style.opacity = '1';
        }
    }
    
    // GridContainer 컴포넌트를 사용하여 격자 생성
    if (window.gridContainer) {
        window.gridContainer.createGrid(bg1Element);
        console.log('Whats Section이 GridContainer와 함께 초기화되었습니다.');
    } else {
        console.error('GridContainer 컴포넌트가 로드되지 않았습니다.');
    }
}

// 색상 변경 기능들을 전역에서 사용할 수 있도록 설정
window.changeGridColors = function(colorType = 'hsl') {
    if (window.gridContainer) {
        window.gridContainer.applyRandomColors(colorType);
    }
};

window.clearGridColors = function() {
    if (window.gridContainer) {
        window.gridContainer.clearColors();
    }
};

// DOM 로드 후 초기화
document.addEventListener('DOMContentLoaded', function() {
    initWhatsSection();
});

// 추가 안전장치 - window load
window.addEventListener('load', function() {
    if (!document.querySelector('.bg-1 .grid-container')) {
        initWhatsSection();
    }
}); 