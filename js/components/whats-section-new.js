// 새로운 Whats Section Component - 레이어 전환 효과

class LayeredSectionManager {
    constructor() {
        this.introSection = null;
        this.middleSection = null;
        this.firstSection = null;
        this.secondSection = null;
        this.isTransitioned = false;
        this.isIntroToMiddleTransitioned = false; // intro → middle 전환 상태
        this.isMiddleToFirstTransitioned = false; // middle → first 전환 상태
        this.lastTransitionTime = 0; // 마지막 전환 시간
        this.transitionCooldown = 1000; // 전환 쿨다운 시간 (1초)
        this.init();
    }

    init() {
        // 섹션 요소들 찾기
        this.introSection = document.querySelector('.whats-section--intro');
        this.middleSection = document.querySelector('.whats-section--middle');
        this.firstSection = document.querySelector('.whats-section--first');
        this.secondSection = document.querySelector('.whats-section--second');
        
        if (!this.middleSection || !this.firstSection || !this.secondSection) {
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
            
            // 아래로 스크롤 - middle에서 first로, first에서 second로
            if (currentScrollY > lastScrollY && currentScrollY > 50 && timeSinceLastTransition > 500) {
                if (this.isIntroToMiddleTransitioned && !this.isMiddleToFirstTransitioned && !this.isTransitioned) {
                    // middle → first
                    console.log('스크롤: middle → first 전환 트리거');
                    this.activateFirstFromMiddle();
                } else if (this.isMiddleToFirstTransitioned && !this.isTransitioned) {
                    // first → second
                    console.log('스크롤: first → second 전환 트리거');
                    this.triggerTransition();
                }
            }
            // 위로 스크롤 - 역방향 전환들
            else if (currentScrollY < lastScrollY && timeSinceLastTransition > 500) {
                if (this.isTransitioned) {
                    // second → first (가장 우선순위)
                    console.log('스크롤: second → first 전환 트리거');
                    this.triggerBackTransition();
                } else if (this.isMiddleToFirstTransitioned && !this.isTransitioned) {
                    // first → middle (second가 비활성화된 상태에서만)
                    console.log('스크롤: first → middle 전환 트리거');
                    this.deactivateFirstToMiddle();
                } else if (this.isIntroToMiddleTransitioned && 
                          !this.isMiddleToFirstTransitioned &&
                          currentScrollY <= 10 && 
                          timeSinceLastTransition > 1000) {
                    // middle → intro (middle에서만, 조건을 더 까다롭게)
                    console.log('스크롤: middle → intro 전환 트리거');
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
                if (this.isIntroToMiddleTransitioned && !this.isMiddleToFirstTransitioned && !this.isTransitioned && timeSinceLastTransition > 500) {
                    // middle → first
                    console.log('키보드: middle → first 전환 트리거');
                    this.activateFirstFromMiddle();
                } else if (this.isMiddleToFirstTransitioned && !this.isTransitioned && timeSinceLastTransition > 500) {
                    // first → second
                    console.log('키보드: first → second 전환 트리거');
                    this.triggerTransition();
                }
            } else if (event.code === 'ArrowUp') {
                event.preventDefault();
                if (this.isTransitioned && timeSinceLastTransition > 500) {
                    // second → first (가장 우선순위)
                    console.log('키보드: second → first 전환 트리거');
                    this.triggerBackTransition();
                } else if (this.isMiddleToFirstTransitioned && !this.isTransitioned && timeSinceLastTransition > 500) {
                    // first → middle (second가 비활성화된 상태에서만)
                    console.log('키보드: first → middle 전환 트리거');
                    this.deactivateFirstToMiddle();
                } else if (this.isIntroToMiddleTransitioned && !this.isMiddleToFirstTransitioned && timeSinceLastTransition > 1000) {
                    // middle → intro (middle에서만, 조건을 더 까다롭게)
                    console.log('키보드: middle → intro 전환 트리거');
                    this.triggerBackToIntro();
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
            
            // middle 섹션에서 아래로 휠 시 first로 전환
            if (this.isIntroToMiddleTransitioned && 
                !this.isMiddleToFirstTransitioned && 
                !this.isTransitioned &&
                event.deltaY > 0 && 
                timeSinceLastTransition > 500) {
                
                event.preventDefault();
                console.log('휠: middle → first 전환 트리거');
                this.activateFirstFromMiddle();
            }
            // middle 섹션에서 위로 휠 시 intro로 전환 (조건을 더 까다롭게)
            else if (this.isIntroToMiddleTransitioned && 
                !this.isMiddleToFirstTransitioned && 
                event.deltaY < 0 && 
                window.scrollY <= 10 &&
                timeSinceLastTransition > 1000) {
                
                event.preventDefault();
                console.log('휠: middle → intro 전환 트리거');
                this.triggerBackToIntro();
            }
            // first 섹션에서 아래로 휠 시 second로 전환
            else if (this.isMiddleToFirstTransitioned && 
                !this.isTransitioned &&
                event.deltaY > 0 && 
                timeSinceLastTransition > 500) {
                
                event.preventDefault();
                console.log('휠: first → second 전환 트리거');
                this.triggerTransition();
            }
            // second 섹션에서 위로 휠 시 first로 전환
            else if (this.isTransitioned && 
                event.deltaY < 0 && 
                timeSinceLastTransition > 500) {
                
                event.preventDefault();
                console.log('휠: second → first 전환 트리거');
                this.triggerBackTransition();
            }
            // first 섹션에서 위로 휠 시 middle로 전환 (second가 비활성화된 상태에서만)
            else if (this.isMiddleToFirstTransitioned && 
                !this.isTransitioned &&
                event.deltaY < 0 && 
                timeSinceLastTransition > 500) {
                
                event.preventDefault();
                console.log('휠: first → middle 전환 트리거');
                this.deactivateFirstToMiddle();
            }
        }, { passive: false });

        // 테스트용: middle 섹션 더블클릭으로 intro 전환
        if (this.middleSection) {
            this.middleSection.addEventListener('dblclick', () => {
                if (this.isIntroToMiddleTransitioned && !this.isMiddleToFirstTransitioned) {
                    this.triggerBackToIntro();
                }
            });
        }
    }

    // intro에서 middle로 전환 (3D 큐브 효과)
    activateMiddleFromIntro() {
        if (this.isIntroToMiddleTransitioned) return;
        
        this.isIntroToMiddleTransitioned = true;
        this.lastTransitionTime = Date.now();
        
        // middle 섹션 3D 큐브 전환
        this.middleSection.classList.add('cube-rotate-in');
        
        console.log('섹션 전환 실행됨 (intro → middle) - 3D 큐브 좌우 회전');
        
        // 전환 완료 후 콜백
        setTimeout(() => {
            this.onIntroToMiddleComplete();
        }, 1400); // 1.4초로 연장
    }

    // middle에서 first로 전환
    activateFirstFromMiddle() {
        if (this.isMiddleToFirstTransitioned) return;
        
        this.isMiddleToFirstTransitioned = true;
        this.lastTransitionTime = Date.now();
        
        // middle 섹션 슬라이드 아웃
        this.middleSection.classList.add('slide-out');
        
        // first 섹션 페이드인
        this.firstSection.classList.add('fade-in-from-intro');
        
        console.log('섹션 전환 실행됨 (middle → first)');
        
        // 전환 완료 후 콜백
        setTimeout(() => {
            this.onMiddleToFirstComplete();
        }, 800);
    }

    // first에서 middle로 역전환
    deactivateFirstToMiddle() {
        if (!this.isMiddleToFirstTransitioned) return;
        
        this.isMiddleToFirstTransitioned = false;
        this.lastTransitionTime = Date.now();
        
        // first 섹션 페이드아웃
        this.firstSection.classList.remove('fade-in-from-intro');
        
        // middle 섹션 슬라이드 인
        this.middleSection.classList.remove('slide-out');
        
        console.log('섹션 역전환 실행됨 (first → middle)');
        
        // 전환 완료 후 콜백
        setTimeout(() => {
            this.onFirstToMiddleComplete();
        }, 800);
    }

    // middle에서 intro로 역전환 (3D 큐브 효과)
    deactivateMiddleToIntro() {
        if (!this.isIntroToMiddleTransitioned) {
            console.log('deactivateMiddleToIntro: 이미 intro로 전환된 상태입니다.');
            return;
        }
        
        console.log('middle 섹션 3D 큐브 역전환 시작');
        
        this.isIntroToMiddleTransitioned = false;
        this.lastTransitionTime = Date.now();
        
        // middle 섹션 3D 큐브 역전환 (오른쪽으로 회전하면서 사라짐)
        this.middleSection.classList.remove('cube-rotate-in');
        
        // 강제로 브라우저가 DOM 변경을 인식하도록 reflow 트리거
        this.middleSection.offsetHeight;
        
        this.middleSection.classList.add('cube-rotate-out');
        
        console.log('middle 섹션 오른쪽으로 3D 큐브 회전하면서 사라짐, intro와 역방향 잘맞된 3D 큐브 전환 구현');
        
        // 전환 완료 후 콜백
        setTimeout(() => {
            this.onMiddleToIntroComplete();
            // 애니메이션 완료 후 클래스 정리
            this.middleSection.classList.remove('cube-rotate-out');
            console.log('middle 섹션 cube-rotate-out 클래스 제거됨');
        }, 1400);
    }

    // middle → intro 역전환 트리거 (개선된 로직)
    triggerBackToIntro() {
        console.log('middle → intro 역전환 시작');
        
        // middle → first 전환이 이미 시작된 상태라면 중단
        if (this.isMiddleToFirstTransitioned) {
            console.log('middle → first 전환이 이미 진행 중이므로 intro 역전환을 중단합니다.');
            return;
        }
        
        if (window.wheelMoveIntro) {
            // middle 섹션과 intro 섹션 동시에 3D 큐브 전환 시작
            this.deactivateMiddleToIntro();
            window.wheelMoveIntro.triggerReverseTransition();
        } else {
            console.error('wheelMoveIntro가 존재하지 않습니다!');
            this.deactivateMiddleToIntro();
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

    // second에서 first로 역전환 (수정된 로직)
    triggerBackTransition() {
        if (!this.isTransitioned) return;
        
        this.isTransitioned = false;
        this.lastTransitionTime = Date.now();
        
        // 두 번째 섹션 페이드 아웃
        this.secondSection.classList.remove('fade-in');
        
        // 첫 번째 섹션 슬라이드 인 - 단, middle → first 전환이 완료된 상태인지 확인
        if (this.isMiddleToFirstTransitioned) {
            this.firstSection.classList.remove('slide-out');
            // first 섹션이 다시 보이도록 fade-in-from-intro 클래스 유지
            if (!this.firstSection.classList.contains('fade-in-from-intro')) {
                this.firstSection.classList.add('fade-in-from-intro');
            }
        }
        
        console.log('섹션 역전환 실행됨 (second → first)', {
            isMiddleToFirstTransitioned: this.isMiddleToFirstTransitioned,
            isTransitioned: this.isTransitioned
        });
    }

    // 부드러운 스크롤 - 다음 섹션으로
    smoothScrollToNext() {
        this.triggerTransition();
    }
    
    // 부드러운 스크롤 - 맨 위로
    smoothScrollToTop() {
        this.triggerBackTransition();
    }

    // intro → middle 전환 완료 콜백
    onIntroToMiddleComplete() {
        console.log('intro → middle 전환 완료');
    }

    // middle → first 전환 완료 콜백
    onMiddleToFirstComplete() {
        console.log('middle → first 전환 완료');
    }

    // first → middle 전환 완료 콜백
    onFirstToMiddleComplete() {
        console.log('first → middle 전환 완료');
    }

    // middle → intro 전환 완료 콜백
    onMiddleToIntroComplete() {
        console.log('middle → intro 전환 완료');
    }

    // first → second 전환 완료 콜백 (기존)
    onTransitionComplete() {
        console.log('first → second 전환 완료');
    }

    // 현재 상태 출력 (디버깅용)
    logCurrentState() {
        console.log('=== 현재 섹션 상태 ===', {
            isIntroToMiddleTransitioned: this.isIntroToMiddleTransitioned,
            isMiddleToFirstTransitioned: this.isMiddleToFirstTransitioned,
            isTransitioned: this.isTransitioned,
            lastTransitionTime: this.lastTransitionTime,
            timeSinceLastTransition: Date.now() - this.lastTransitionTime
        });
    }

    // 전환 상태 리셋 (테스트용)
    resetTransition() {
        this.isTransitioned = false;
        this.isIntroToMiddleTransitioned = false;
        this.isMiddleToFirstTransitioned = false;
        this.lastTransitionTime = 0;
        
        // 3D 큐브 클래스들도 포함해서 정리
        this.middleSection.classList.remove('cube-rotate-in', 'cube-rotate-out', 'slide-out');
        this.firstSection.classList.remove('slide-out', 'fade-in-from-intro');
        this.secondSection.classList.remove('fade-in');
        
        if (this.introSection) {
            this.introSection.classList.remove('active', 'cube-rotate-out', 'cube-rotate-in', 'deactivated');
        }
        
        console.log('모든 섹션 상태가 리셋되었습니다 (3D 큐브 좌우 회전 클래스 포함).');
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

// 현재 상태 확인 함수 (디버깅용)
window.logSectionState = function() {
    if (window.layeredSectionManager) {
        window.layeredSectionManager.logCurrentState();
    }
};

// 섹션 상태 리셋 함수 (디버깅용)
window.resetSectionState = function() {
    if (window.layeredSectionManager) {
        window.layeredSectionManager.resetTransition();
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
