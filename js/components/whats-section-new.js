// 새로운 Whats Section Component - 레이어 전환 효과

class LayeredSectionManager {
    constructor() {
        this.introSection = null;
        this.middleSection = null;
        this.firstSection = null;
        this.secondSection = null;
        this.thirdSection = null;
        this.isTransitioned = false;
        this.isSecondToThirdTransitioned = false; // second → third 전환 상태
        this.isIntroToMiddleTransitioned = false; // intro → middle 전환 상태
        this.isMiddleToFirstTransitioned = false; // middle → first 전환 상태
        this.lastTransitionTime = 0; // 마지막 전환 시간
        this.transitionCooldown = 1000; // 전환 쿨다운 시간 (1초)
        // 마우스 추적 관련 변수들
        this.mouseX = 0;
        this.mouseY = 0;
        this.isSecondSectionActive = false;
        this.secondTitleElement = null;
        this.colorChangeTimer = null;
        this.isContentRevealed = false;
        this.canRevealContent = false;
        this.init();
    }

    init() {
        // 섹션 요소들 찾기
        this.introSection = document.querySelector('.whats-section--intro');
        this.middleSection = document.querySelector('.whats-section--middle');
        this.firstSection = document.querySelector('.whats-section--first');
        this.secondSection = document.querySelector('.whats-section--second');
        this.thirdSection = document.querySelector('.whats-section--third');
        
        if (!this.middleSection || !this.firstSection || !this.secondSection || !this.thirdSection) {
            console.error('섹션 요소들을 찾을 수 없습니다.');
            return;
        }

        // second 섹션 타이틀 요소 찾기
        this.secondTitleElement = this.secondSection.querySelector('.whats-section__title');
        
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
            // 세 번째 섹션에 도달했으면 이벤트 무시하여 기본 스크롤 허용
            if (this.isSecondToThirdTransitioned) {
                return;
            }
            // intro 섹션이 활성화되어 있으면 스크롤 이벤트 무시
            if (window.wheelMoveIntro && window.wheelMoveIntro.isIntroActive) {
                return;
            }
            
            const currentScrollY = window.scrollY;
            const currentTime = Date.now();
            const timeSinceLastTransition = currentTime - this.lastTransitionTime;
            
            // 아래로 스크롤 - middle에서 first로, first에서 second로, second에서 third로
            if (currentScrollY > lastScrollY && currentScrollY > 50 && timeSinceLastTransition > 500) {
                if (this.isIntroToMiddleTransitioned && !this.isMiddleToFirstTransitioned && !this.isTransitioned) {
                    // middle → first
                    console.log('스크롤: middle → first 전환 트리거');
                    this.activateFirstFromMiddle();
                } else if (this.isMiddleToFirstTransitioned && !this.isTransitioned && !this.isSecondToThirdTransitioned) {
                    // first → second
                    console.log('스크롤: first → second 전환 트리거');
                    this.triggerTransition();
                } else if (this.isTransitioned && !this.isSecondToThirdTransitioned) {
                    // second → third
                    console.log('스크롤: second → third 전환 트리거');
                    this.triggerSecondToThirdTransition();
                }
            }
            // 위로 스크롤 - 역방향 전환들
            else if (currentScrollY < lastScrollY && timeSinceLastTransition > 500) {
                if (this.isSecondToThirdTransitioned) {
                    // third → second (최우선순위)
                    console.log('스크롤: third → second 전환 트리거');
                    this.triggerThirdToSecondTransition();
                } else if (this.isTransitioned && !this.isSecondToThirdTransitioned) {
                    // second → first
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
            // 세 번째 섹션 완료 후 키보드 다운 시 main-content로 전환, 업 시 역전환
            if (this.canRevealContent && !this.isContentRevealed) {
                if (event.code === 'Space' || event.code === 'ArrowDown') {
                    event.preventDefault();
                    this.revealContent();
                } else if (event.code === 'ArrowUp') {
                    event.preventDefault();
                    this.triggerThirdToSecondTransition();
                }
                return;
            }
            // main-content가 보이는 상태에서 ArrowUp 시 복귀
            if (this.isContentRevealed) {
                if (event.code === 'ArrowUp') {
                    event.preventDefault();
                    this.revertContent();
                }
                return;
            }
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
                } else if (this.isMiddleToFirstTransitioned && !this.isTransitioned && !this.isSecondToThirdTransitioned && timeSinceLastTransition > 500) {
                    // first → second
                    console.log('키보드: first → second 전환 트리거');
                    this.triggerTransition();
                } else if (this.isTransitioned && !this.isSecondToThirdTransitioned && timeSinceLastTransition > 500) {
                    // second → third
                    console.log('키보드: second → third 전환 트리거');
                    this.triggerSecondToThirdTransition();
                }
            } else if (event.code === 'ArrowUp') {
                event.preventDefault();
                if (this.isSecondToThirdTransitioned && timeSinceLastTransition > 500) {
                    // third → second (최우선순위)
                    console.log('키보드: third → second 전환 트리거');
                    this.triggerThirdToSecondTransition();
                } else if (this.isTransitioned && !this.isSecondToThirdTransitioned && timeSinceLastTransition > 500) {
                    // second → first
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
            // 세 번째 섹션 완료 후 휠 다운 시 main-content로 전환, 업 시 역전환
            if (this.canRevealContent && !this.isContentRevealed) {
                if (event.deltaY > 0) {
                    event.preventDefault();
                    this.revealContent();
                } else if (event.deltaY < 0) {
                    this.triggerThirdToSecondTransition();
                }
                return;
            }
            // main-content가 보이는 상태에서 휠 업 시 복귀
            if (this.isContentRevealed) {
                if (event.deltaY < 0) {
                    event.preventDefault();
                    this.revertContent();
                }
                return;
            }
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
                !this.isSecondToThirdTransitioned &&
                event.deltaY > 0 && 
                timeSinceLastTransition > 500) {
                
                event.preventDefault();
                console.log('휠: first → second 전환 트리거');
                this.triggerTransition();
            }
            // second 섹션에서 아래로 휠 시 third로 전환
            else if (this.isTransitioned && 
                !this.isSecondToThirdTransitioned &&
                event.deltaY > 0 && 
                timeSinceLastTransition > 500) {
                
                event.preventDefault();
                console.log('휠: second → third 전환 트리거');
                this.triggerSecondToThirdTransition();
            }
            // third 섹션에서 위로 휠 시 second로 전환
            else if (this.isSecondToThirdTransitioned && 
                event.deltaY < 0 && 
                timeSinceLastTransition > 500) {
                
                event.preventDefault();
                console.log('휠: third → second 전환 트리거');
                this.triggerThirdToSecondTransition();
            }
            // second 섹션에서 위로 휠 시 first로 전환
            else if (this.isTransitioned && 
                !this.isSecondToThirdTransitioned &&
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

        // 마우스 이동 이벤트 (second 섹션 타이틀 추적용)
        document.addEventListener('mousemove', (event) => {
            this.mouseX = event.clientX;
            this.mouseY = event.clientY;
            
            if (this.isSecondSectionActive && this.secondTitleElement) {
                this.updateSecondTitlePosition();
                this.changeSecondTitleColor();
            }
        });
    }

    // intro에서 middle로 전환 (3D 큐브 효과)
    activateMiddleFromIntro() {
        if (this.isIntroToMiddleTransitioned) return;
        
        this.isIntroToMiddleTransitioned = true;
        this.lastTransitionTime = Date.now();
        
        // middle 섹션 타이틀을 즉시 숨기기 (전환 중 보이지 않도록)
        this.hideMiddleTitle();
        
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
        
        // CRITICAL: second 섹션을 완전히 숨김 (역방향 시 표시 방지)
        this.secondSection.classList.remove('fade-in', 'cube-rotate-in-down', 'cube-rotate-out-up');
        this.secondSection.style.display = 'none';
        
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
        
        // middle 섹션 타이틀 숨기기
        this.hideMiddleTitle();
        
        // middle 섹션 3D 큐브 역전환 (오른쪽으로 회전하면서 사라짐)
        this.middleSection.classList.remove('cube-rotate-in');
        
        // 강제로 브라우저가 DOM 변경을 인식하도록 reflow 트리거
        this.middleSection.offsetHeight;
        
        this.middleSection.classList.add('cube-rotate-out');
        
        // CRITICAL: second 섹션을 완전히 숨김 (역방향 시 표시 방지)
        this.secondSection.classList.remove('fade-in', 'cube-rotate-in-down', 'cube-rotate-out-up');
        this.secondSection.style.display = 'none';
        
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

    // second → third 전환 (3D 큐브 효과)
    triggerSecondToThirdTransition() {
        if (this.isSecondToThirdTransitioned) return;
        
        this.isSecondToThirdTransitioned = true;
        this.lastTransitionTime = Date.now();
        
        // 두 번째 섹션 위로 회전하면서 사라짐
        this.secondSection.classList.add('cube-rotate-out-up');
        
        // 세 번째 섹션 이전 클래스 제거 후 3D 큐브 애니메이션 시작
        this.thirdSection.classList.remove('cube-rotate-out');
        this.thirdSection.classList.add('cube-rotate-in');
        
        console.log('섹션 전환 실행됨 (second → third, 3D 큐브)');
        
        // 전환 완료 후 콜백
        setTimeout(() => {
            this.onSecondToThirdComplete();
        }, 1400);
    }

    // third → second 역전환 (3D 큐브 효과)
    triggerThirdToSecondTransition() {
        if (!this.isSecondToThirdTransitioned) return;
        
        this.isSecondToThirdTransitioned = false;
        this.lastTransitionTime = Date.now();
        
        // 세 번째 섹션 아래로 회전하면서 사라짐
        this.thirdSection.classList.remove('cube-rotate-in');
        this.thirdSection.classList.add('cube-rotate-out');
        
        // 두 번째 섹션을 다시 표시하고 위에서 회전하면서 나타남
        this.secondSection.style.display = 'block';
        this.secondSection.classList.remove('cube-rotate-out-up');
        this.secondSection.classList.add('cube-rotate-in-down');
        
        console.log('섹션 역전환 실행됨 (third → second, 3D 큐브)');
        
        // 전환 완료 후 콜백
        setTimeout(() => {
            this.onThirdToSecondComplete();
        }, 1400);
    }

    // first → second 전환 (기존 로직)
    triggerTransition() {
        if (this.isTransitioned) return;
        
        this.isTransitioned = true;
        this.lastTransitionTime = Date.now();
        
        // 첫 번째 섹션 슬라이드 아웃
        this.firstSection.classList.add('slide-out');
        
        // 두 번째 섹션을 다시 표시하고 페이드 인
        this.secondSection.style.display = 'block';
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
        
        // second 섹션에서 벗어날 때 마우스 추적 비활성화
        this.deactivateSecondSectionMouseTracking();
        
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
        
        // 전환 완료 후 타이틀 글자별 애니메이션 시작
        setTimeout(() => {
            this.animateMiddleTitleChars();
        }, 100); // 전환 완료 후 100ms 지연으로 단축
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
        // second 섹션으로 전환 완료 시 마우스 추적 활성화
        this.activateSecondSectionMouseTracking();
        
        console.log('first → second 전환 완료');
    }

    // second → third 전환 완료 콜백
    onSecondToThirdComplete() {
        // third 섹션으로 전환 시 마우스 추적 비활성화
        this.deactivateSecondSectionMouseTracking();
        // main-content 전환 가능 상태 설정
        this.canRevealContent = true;
        console.log('second → third 전환 완료');
    }

    // third → second 전환 완료 콜백
    onThirdToSecondComplete() {
        // second 섹션으로 돌아올 때 마우스 추적 재활성화
        this.activateSecondSectionMouseTracking();
        console.log('third → second 전환 완료');
    }

    // 현재 상태 출력 (디버깅용)
    logCurrentState() {
        console.log('=== 현재 섹션 상태 ===', {
            isIntroToMiddleTransitioned: this.isIntroToMiddleTransitioned,
            isMiddleToFirstTransitioned: this.isMiddleToFirstTransitioned,
            isTransitioned: this.isTransitioned,
            isSecondToThirdTransitioned: this.isSecondToThirdTransitioned,
            lastTransitionTime: this.lastTransitionTime,
            timeSinceLastTransition: Date.now() - this.lastTransitionTime
        });
    }

    // middle 섹션 타이틀 글자별 애니메이션
    animateMiddleTitleChars() {
        const middleTitle = this.middleSection.querySelector('.whats-section__title');
        if (!middleTitle) {
            console.error('middle 섹션의 타이틀을 찾을 수 없습니다.');
            return;
        }

        // 타이틀을 다시 보이게 설정
        this.showMiddleTitle();

        // 기존 글자 span이 있다면 제거하고 다시 생성
        this.resetMiddleTitleChars(middleTitle);
        
        // 텍스트를 글자별로 분리하여 span으로 감싸기
        this.splitTextIntoChars(middleTitle);
        
        // 애니메이션 트리거
        this.triggerCharAnimation();
        
        console.log('middle 섹션 타이틀 글자별 애니메이션 시작');
    }

    // 기존 글자 span 초기화
    resetMiddleTitleChars(titleElement) {
        // title-animated 클래스 제거
        this.middleSection.classList.remove('title-animated');
        
        // 기존 span 요소들이 있다면 원본 텍스트로 복원
        if (titleElement.querySelector('.title-char')) {
            const originalText = titleElement.textContent;
            titleElement.innerHTML = originalText;
        }
    }

    // 텍스트를 글자별 span으로 분리
    splitTextIntoChars(titleElement) {
        const text = titleElement.textContent.trim(); // 앞뒤 공백 제거
        let htmlContent = '';
        
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const animationDelay = i * 0.06; // 각 글자마다 0.06초씩 지연 (더욱 빠르게)
            
            if (char === ' ') {
                // 공백 문자 처리
                htmlContent += `<span class="title-char space" style="animation-delay: ${animationDelay}s;">&nbsp;</span>`;
            } else {
                // 일반 글자 처리
                htmlContent += `<span class="title-char" style="animation-delay: ${animationDelay}s;">${char}</span>`;
            }
        }
        
        titleElement.innerHTML = htmlContent;
    }

    // 글자별 애니메이션 트리거
    triggerCharAnimation() {
        // DOM 업데이트를 위한 짧은 지연
        requestAnimationFrame(() => {
            this.middleSection.classList.add('title-animated');
        });
    }

    // middle 섹션 타이틀 숨기기
    hideMiddleTitle() {
        const middleTitle = this.middleSection.querySelector('.whats-section__title');
        if (middleTitle) {
            middleTitle.style.opacity = '0';
            middleTitle.style.visibility = 'hidden';
        }
    }

    // middle 섹션 타이틀 보이기
    showMiddleTitle() {
        const middleTitle = this.middleSection.querySelector('.whats-section__title');
        if (middleTitle) {
            middleTitle.style.opacity = '1';
            middleTitle.style.visibility = 'visible';
        }
    }

    // 전환 상태 리셋 (테스트용)
    resetTransition() {
        // 마우스 추적 비활성화
        this.deactivateSecondSectionMouseTracking();
        
        this.isTransitioned = false;
        this.isIntroToMiddleTransitioned = false;
        this.isMiddleToFirstTransitioned = false;
        this.isSecondToThirdTransitioned = false;
        this.lastTransitionTime = 0;
        
        // 3D 큐브 클래스들도 포함해서 정리
        this.middleSection.classList.remove('cube-rotate-in', 'cube-rotate-out', 'slide-out', 'title-animated');
        this.firstSection.classList.remove('slide-out', 'fade-in-from-intro');
        this.secondSection.classList.remove('fade-in', 'cube-rotate-out-up', 'cube-rotate-in-down');
        this.thirdSection.classList.remove('fade-in', 'cube-rotate-out-up', 'cube-rotate-in-down');
        this.thirdSection.classList.remove('cube-rotate-in', 'cube-rotate-out');
        
        if (this.introSection) {
            this.introSection.classList.remove('active', 'cube-rotate-out', 'cube-rotate-in', 'deactivated');
        }
        
        // middle 섹션 타이틀 초기화
        const middleTitle = this.middleSection.querySelector('.whats-section__title');
        if (middleTitle) {
            this.resetMiddleTitleChars(middleTitle);
        }
        
        console.log('모든 섹션 상태가 리셋되었습니다 (3D 큐브 상하 회전 클래스 포함).');
    }

    // 마우스 추적 관련 메서드들
    
    // second 섹션 활성화 시 마우스 추적 시작
    activateSecondSectionMouseTracking() {
        if (!this.secondTitleElement) return;
        
        this.isSecondSectionActive = true;
        
        // 타이틀을 화면 중앙에 초기 위치 설정
        this.secondTitleElement.style.left = '50%';
        this.secondTitleElement.style.top = '50%';
        this.secondTitleElement.style.transform = 'translate(-50%, -50%)';
        
        console.log('second 섹션 마우스 추적 활성화됨');
    }
    
    // second 섹션 비활성화 시 마우스 추적 중지
    deactivateSecondSectionMouseTracking() {
        this.isSecondSectionActive = false;
        
        if (this.secondTitleElement) {
            // 원래 위치로 복원
            this.secondTitleElement.style.position = '';
            this.secondTitleElement.style.left = '';
            this.secondTitleElement.style.top = '';
            this.secondTitleElement.style.transform = '';
            this.secondTitleElement.style.zIndex = '';
        }
        
        // 색상 변경 타이머 정리
        if (this.colorChangeTimer) {
            clearTimeout(this.colorChangeTimer);
            this.colorChangeTimer = null;
        }
        
        console.log('second 섹션 마우스 추적 비활성화됨');
    }
    
    // 마우스 위치에 따른 타이틀 위치 업데이트
    updateSecondTitlePosition() {
        if (!this.secondTitleElement || !this.isSecondSectionActive) return;
        
        // 부드러운 애니메이션을 위해 마우스보다 약간 지연된 움직임
        const smoothingFactor = 0.1;
        const targetX = this.mouseX;
        const targetY = this.mouseY;
        
        // 타이틀의 반 크기만큼 오프셋 (중앙 정렬)
        const offsetX = this.secondTitleElement.offsetWidth / 2;
        const offsetY = this.secondTitleElement.offsetHeight / 2;
        
        this.secondTitleElement.style.left = `${targetX - offsetX}px`;
        this.secondTitleElement.style.top = `${targetY - offsetY}px`;
        this.secondTitleElement.style.transform = 'none';
    }
    
    // 랜덤 색상 변경
    changeSecondTitleColor() {
        if (!this.secondTitleElement || !this.isSecondSectionActive) return;
        
        // 색상 변경 쿨다운 (너무 자주 변경되지 않도록)
        if (this.colorChangeTimer) return;
        
        // 랜덤 HSL 색상 생성
        const hue = Math.floor(Math.random() * 360);
        const saturation = 70 + Math.floor(Math.random() * 30); // 70-100%
        const lightness = 50 + Math.floor(Math.random() * 30);  // 50-80%
        
        const randomColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        this.secondTitleElement.style.color = randomColor;
        
        // 100ms 쿨다운
        this.colorChangeTimer = setTimeout(() => {
            this.colorChangeTimer = null;
        }, 100);
    }

    // main-content로 전환 메서드
    revealContent() {
        if (this.isContentRevealed) return;
        // 한 번 전환 후 추가 전환 막음
        this.isContentRevealed = true;
        this.canRevealContent = false;
        // main-content 미리 표시
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.style.display = 'block';
            requestAnimationFrame(() => { mainContent.style.opacity = '1'; });
        }
        // 부드러운 스크롤로 main-content로 이동
        window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
        // benefit-section 가시화 클래스 추가 (스크롤 후)
        setTimeout(() => {
            const benefitHeadline = document.querySelector('.benefit-headline');
            benefitHeadline?.classList.add('visible');
            const benefitContainer = document.querySelector('.benefit-container');
            benefitContainer?.classList.add('visible');
        }, 500);
    }

    // 메인 컨텐츠에서 위로 스크롤 시 layered section으로 복귀
    revertContent() {
        if (!this.isContentRevealed) return;
        // benefit-section 가시화 클래스 제거
        const benefitHeadline = document.querySelector('.benefit-headline');
        benefitHeadline?.classList.remove('visible');
        const benefitContainer = document.querySelector('.benefit-container');
        benefitContainer?.classList.remove('visible');
        // 부드러운 스크롤로 최상단(레이어 섹션)으로 이동
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // 스크롤 후 main-content 숨기기 및 상태 리셋
        setTimeout(() => {
            const mainContent = document.querySelector('.main-content');
            if (mainContent) {
                mainContent.style.opacity = '0';
                setTimeout(() => { mainContent.style.display = 'none'; }, 300);
            }
            this.isContentRevealed = false;
            // 컨텐츠 복귀 후 다시 reveal 불가능 상태로 리셋
            this.canRevealContent = false;
        }, 500);
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

// second → third 전환 트리거 함수
window.triggerSecondToThirdTransition = function() {
    if (window.layeredSectionManager) {
        window.layeredSectionManager.triggerSecondToThirdTransition();
    }
};

// third → second 역전환 트리거 함수
window.triggerThirdToSecondTransition = function() {
    if (window.layeredSectionManager) {
        window.layeredSectionManager.triggerThirdToSecondTransition();
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
