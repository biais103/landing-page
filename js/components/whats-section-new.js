// 새로운 Whats Section Component - 레이어 전환 효과

class LayeredSectionManager {
    constructor() {
        this.introSection = null;
        this.firstSection = null;
        this.secondSection = null;
        this.isTransitioned = false;
        this.isIntroToFirstTransitioned = false; // intro → first 전환 상태
        this.lastTransitionTime = 0; // 마지막 전환 시간
        this.transitionCooldown = 1000; // 전환 쿨다운 시간 (1초)
        this.init();
    }

    init() {
        // 섹션 요소들 찾기
        this.introSection = document.querySelector('.whats-section--intro');
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

        // 스크롤 이벤트 (양방향) - intro가 비활성화되었을 때만
        let lastScrollY = 0;
        window.addEventListener('scroll', () => {
            // intro 섹션이 활성화되어 있으면 스크롤 이벤트 무시
            if (window.wheelMoveIntro && window.wheelMoveIntro.isIntroActive) {
                return;
            }
            
            const currentScrollY = window.scrollY;
            const currentTime = Date.now();
            const timeSinceLastTransition = currentTime - this.lastTransitionTime;
            
            // 아래로 스크롤 - first에서 second로
            if (!this.isTransitioned && this.isIntroToFirstTransitioned && currentScrollY > lastScrollY && currentScrollY > 50) {
                this.triggerTransition();
            }
            // 위로 스크롤 - second에서 first로, 또는 first에서 intro로
            else if (currentScrollY < lastScrollY) {
                if (this.isTransitioned) {
                    // second → first
                    this.triggerBackTransition();
                } else if (this.isIntroToFirstTransitioned && 
                          currentScrollY <= 50 && 
                          timeSinceLastTransition > 500) {
                    // first → intro (조건 완화: 50px 이하, 500ms 쿨다운)
                    console.log(`[DEBUG] 스크롤 조건 충족 - scrollY: ${currentScrollY}, timeSince: ${timeSinceLastTransition}`);
                    this.triggerBackToIntro();
                }
            }
            
            lastScrollY = currentScrollY;
        });

        // 키보드 이벤트
        document.addEventListener('keydown', (event) => {
            // intro 섹션이 활성화되어 있으면 키보드 이벤트 무시
            if (window.wheelMoveIntro && window.wheelMoveIntro.isIntroActive) {
                return;
            }
            
            const currentTime = Date.now();
            const timeSinceLastTransition = currentTime - this.lastTransitionTime;
            
            if (event.code === 'Space' || event.code === 'ArrowDown') {
                event.preventDefault();
                if (!this.isTransitioned && this.isIntroToFirstTransitioned) {
                    this.triggerTransition();
                }
            } else if (event.code === 'ArrowUp') {
                event.preventDefault();
                if (this.isTransitioned) {
                    this.triggerBackTransition();
                } else if (this.isIntroToFirstTransitioned && 
                          timeSinceLastTransition > 500) {
                    console.log('[DEBUG] Keyboard: Triggering first → intro transition');
                    this.triggerBackToIntro();
                } else if (event.code === 'KeyT') {
                    // 테스트용: T 키로 first → intro 강제 전환
                    if (this.isIntroToFirstTransitioned && !this.isTransitioned) {
                        console.log('[DEBUG] T키: 강제 first → intro 전환');
                        this.triggerBackToIntro();
                    }
                }
            }
        });

        // 추가: 마우스 휠 이벤트 (passive: false로 설정)
        document.addEventListener('wheel', (event) => {
            // intro 섹션이 활성화되어 있으면 휠 이벤트 무시
            if (window.wheelMoveIntro && window.wheelMoveIntro.isIntroActive) {
                return;
            }

            const currentTime = Date.now();
            const timeSinceLastTransition = currentTime - this.lastTransitionTime;
            
            // first 섹션에서 위로 휠 시 intro로 전환
            if (this.isIntroToFirstTransitioned && 
                !this.isTransitioned && 
                event.deltaY < 0 && 
                window.scrollY <= 50 &&
                timeSinceLastTransition > 500) {
                
                console.log('[DEBUG] Wheel: Triggering first → intro transition');
                event.preventDefault();
                this.triggerBackToIntro();
            }
        }, { passive: false });

        // 테스트용: first 섹션 더블클릭으로 intro 전환
        if (this.firstSection) {
            this.firstSection.addEventListener('dblclick', () => {
                if (this.isIntroToFirstTransitioned && !this.isTransitioned) {
                    console.log('[DEBUG] Double-click: Triggering first → intro transition');
                    this.triggerBackToIntro();
                }
            });
        }
    }

    // intro에서 first로 전환
    activateFirstFromIntro() {
        if (this.isIntroToFirstTransitioned) return;
        
        this.isIntroToFirstTransitioned = true;
        this.lastTransitionTime = Date.now();
        
        // first 섹션 페이드인
        this.firstSection.classList.add('fade-in-from-intro');
        
        console.log('섹션 전환 실행됨 (intro → first)');
        
        // 전환 완료 후 콜백
        setTimeout(() => {
            this.onIntroToFirstComplete();
        }, 800);
    }

    // first에서 intro로 역전환
    deactivateFirstToIntro() {
        console.log('[DEBUG] deactivateFirstToIntro() 시작');
        console.log('[DEBUG] isIntroToFirstTransitioned:', this.isIntroToFirstTransitioned);
        
        if (!this.isIntroToFirstTransitioned) {
            console.log('[DEBUG] 이미 intro로 전환됨 - 종료');
            return;
        }
        
        this.isIntroToFirstTransitioned = false;
        this.lastTransitionTime = Date.now();
        
        // first 섹션 페이드아웃
        console.log('[DEBUG] first 섹션 페이드아웃 적용');
        this.firstSection.classList.remove('fade-in-from-intro');
        
        console.log('[DEBUG] 섹션 역전환 실행됨 (first → intro)');
        
        // 전환 완료 후 콜백
        setTimeout(() => {
            this.onFirstToIntroComplete();
        }, 800);
    }

    // first → intro 역전환 트리거
    triggerBackToIntro() {
        console.log('[DEBUG] triggerBackToIntro 호출됨');
        console.log('[DEBUG] window.wheelMoveIntro 존재:', !!window.wheelMoveIntro);
        console.log('[DEBUG] isIntroToFirstTransitioned:', this.isIntroToFirstTransitioned);
        console.log('[DEBUG] isTransitioned:', this.isTransitioned);
        
        if (window.wheelMoveIntro) {
            console.log('[DEBUG] wheelMoveIntro.triggerReverseTransition() 호출');
            window.wheelMoveIntro.triggerReverseTransition();
        } else {
            console.error('[ERROR] window.wheelMoveIntro가 존재하지 않습니다!');
            
            // 직접 first 섹션 비활성화 시도
            console.log('[DEBUG] 직접 first 섹션 비활성화 시도');
            this.deactivateFirstToIntro();
        }
    }

    // first → second 전환 (기존 로직)
    triggerTransition() {
        if (this.isTransitioned) return;
        
        this.isTransitioned = true;
        this.lastTransitionTime = Date.now();
        
        // 첫 번째 섹션 슬라이드 아웃
        this.firstSection.classList.add('slide-out');
        
        // 두 번째 섹션 페이드 인
        this.secondSection.classList.add('fade-in');
        
        console.log('섹션 전환 실행됨 (first → second)');
        
        // 전환 완료 후 콜백
        setTimeout(() => {
            this.onTransitionComplete();
        }, 800);
    }

    // second에서 first로 역전환 (기존 로직)
    triggerBackTransition() {
        if (!this.isTransitioned) return;
        
        this.isTransitioned = false;
        this.lastTransitionTime = Date.now();
        
        // 첫 번째 섹션 슬라이드 인
        this.firstSection.classList.remove('slide-out');
        
        // 두 번째 섹션 페이드 아웃
        this.secondSection.classList.remove('fade-in');
        
        console.log('섹션 역전환 실행됨 (second → first)');
    }

    // 부드러운 스크롤 - 다음 섹션으로
    smoothScrollToNext() {
        this.triggerTransition();
    }
    
    // 부드러운 스크롤 - 맨 위로
    smoothScrollToTop() {
        this.triggerBackTransition();
    }

    // intro → first 전환 완료 콜백
    onIntroToFirstComplete() {
        console.log('intro → first 전환 완료');
    }

    // first → intro 전환 완료 콜백
    onFirstToIntroComplete() {
        console.log('first → intro 전환 완료');
    }

    // first → second 전환 완료 콜백 (기존)
    onTransitionComplete() {
        console.log('first → second 전환 완료');
    }

    // 전환 상태 리셋 (테스트용)
    resetTransition() {
        this.isTransitioned = false;
        this.isIntroToFirstTransitioned = false;
        this.lastTransitionTime = 0;
        this.firstSection.classList.remove('slide-out', 'fade-in-from-intro');
        this.secondSection.classList.remove('fade-in');
        if (this.introSection) {
            this.introSection.classList.remove('active', 'fade-out', 'deactivated');
        }
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

// first → intro 역전환 트리거 함수
window.triggerBackToIntroTransition = function() {
    if (window.layeredSectionManager) {
        window.layeredSectionManager.triggerBackToIntro();
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
