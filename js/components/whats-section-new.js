// 새로운 Whats Section Component - 레이어 전환 효과

class LayeredSectionManager {
    constructor() {
        this.firstSection = null;
        this.secondSection = null;
        this.isTransitioned = false;
        this.init();
    }

    init() {
        // 섹션 요소들 찾기
        this.firstSection = document.querySelector('.whats-section--first');
        this.secondSection = document.querySelector('.whats-section--second');
        
        if (!this.firstSection || !this.secondSection) {
            console.error('섹션 요소들을 찾을 수 없습니다.');
            return;
        }

        // 이벤트 리스너 설정
        this.setupEventListeners();
        
        console.log('LayeredSectionManager 초기화 완료');
    }

    setupEventListeners() {
        // 스크롤 화살표 클릭 이벤트
        const scrollArrow = document.querySelector('.scroll-arrow__icon');
        if (scrollArrow) {
            scrollArrow.addEventListener('click', () => {
                this.triggerTransition();
            });
        }

        // 스크롤 이벤트 (양방향)
        let lastScrollY = 0;
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            // 아래로 스크롤 - 첫 번째에서 두 번째로
            if (!this.isTransitioned && currentScrollY > lastScrollY && currentScrollY > 50) {
                this.triggerTransition();
            }
            // 위로 스크롤 - 두 번째에서 첫 번째로
            else if (this.isTransitioned && currentScrollY < lastScrollY) {
                this.triggerBackTransition();
            }
            
            lastScrollY = currentScrollY;
        });

        // 키보드 이벤트
        document.addEventListener('keydown', (event) => {
            if (event.code === 'Space' || event.code === 'ArrowDown') {
                event.preventDefault();
                if (!this.isTransitioned) {
                    this.triggerTransition();
                }
            } else if (event.code === 'ArrowUp') {
                event.preventDefault();
                if (this.isTransitioned) {
                    this.triggerBackTransition();
                }
            }
        });
    }

    triggerTransition() {
        if (this.isTransitioned) return;
        
        this.isTransitioned = true;
        
        // 첫 번째 섹션 슬라이드 아웃
        this.firstSection.classList.add('slide-out');
        
        // 두 번째 섹션 페이드 인
        this.secondSection.classList.add('fade-in');
        
        console.log('섹션 전환 실행됨 (첫 번째 -> 두 번째)');
        
        // 전환 완료 후 콜백 (선택사항)
        setTimeout(() => {
            this.onTransitionComplete();
        }, 800); // 애니메이션 시간과 맞춤
    }

    triggerBackTransition() {
        if (!this.isTransitioned) return;
        
        this.isTransitioned = false;
        
        // 첫 번째 섹션 슬라이드 인
        this.firstSection.classList.remove('slide-out');
        
        // 두 번째 섹션 페이드 아웃
        this.secondSection.classList.remove('fade-in');
        
        console.log('섹션 역전환 실행됨 (두 번째 -> 첫 번째)');
    }

    // 부드러운 스크롤 - 다음 섹션으로
    smoothScrollToNext() {
        this.triggerTransition();
    }
    
    // 부드러운 스크롤 - 맨 위로
    smoothScrollToTop() {
        this.triggerBackTransition();
    }

    onTransitionComplete() {
        console.log('섹션 전환 완료');
        // 필요한 경우 추가 로직 실행
    }

    // 전환 상태 리셋 (테스트용)
    resetTransition() {
        this.isTransitioned = false;
        this.firstSection.classList.remove('slide-out');
        this.secondSection.classList.remove('fade-in');
    }
}

// 기존 whats-section 초기화 함수 수정
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
    
    // 레이어 섹션 매니저 초기화
    window.layeredSectionManager = new LayeredSectionManager();
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

// 전환 트리거 함수 (전역에서 호출 가능)
window.triggerSectionTransition = function() {
    if (window.layeredSectionManager) {
        window.layeredSectionManager.triggerTransition();
    }
};

// 역전환 트리거 함수
window.triggerSectionBackTransition = function() {
    if (window.layeredSectionManager) {
        window.layeredSectionManager.triggerBackTransition();
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
