// Whats Section Intro - Wheel Move Effect

class WheelMoveIntro {
    constructor() {
        this.images = null;
        this.currentIndex = 0;
        this.isWheelMoveComplete = false;
        this.introSection = null;
        this.isIntroActive = false;
        this.init();
    }

    init() {
        // intro 섹션과 이미지들 찾기
        this.introSection = document.querySelector('.whats-section--intro');
        this.images = document.querySelectorAll('.wheel-image');
        
        if (!this.introSection || !this.images.length) {
            console.error('intro 섹션 또는 wheel 이미지들을 찾을 수 없습니다.');
            return;
        }

        console.log(`WheelMoveIntro 초기화 - ${this.images.length}개 이미지 로드됨`);
        
        // 이벤트 리스너 설정
        this.setupEventListeners();
    }

    setupEventListeners() {
        // 스크롤 이벤트 처리 - intro 섹션이 활성화되었을 때만
        document.addEventListener('wheel', (event) => {
            if (!this.isIntroActive) return;
            
            event.preventDefault(); // 기본 스크롤 방지
            
            if (event.deltaY > 0) {
                // 아래로 스크롤 - 다음 이미지 또는 섹션 전환
                this.handleDownScroll();
            } else if (event.deltaY < 0) {
                // 위로 스크롤 - 이전 이미지
                this.handleUpScroll();
            }
        }, { passive: false });

        // 터치 이벤트 처리
        let touchStartY = 0;
        
        document.addEventListener('touchstart', (event) => {
            if (!this.isIntroActive) return;
            touchStartY = event.touches[0].clientY;
        });

        document.addEventListener('touchend', (event) => {
            if (!this.isIntroActive) return;
            
            const touchEndY = event.changedTouches[0].clientY;
            const difference = touchStartY - touchEndY;
            
            if (Math.abs(difference) > 50) {
                if (difference > 0) {
                    // 위로 스와이프 - 다음 이미지
                    this.handleDownScroll();
                } else {
                    // 아래로 스와이프 - 이전 이미지
                    this.handleUpScroll();
                }
            }
        });
    }

    handleDownScroll() {
        if (this.currentIndex < this.images.length - 1) {
            // 다음 이미지로 이동
            this.currentIndex++;
            this.showImage(this.currentIndex);
            
            // 마지막 이미지에 도달했을 때
            if (this.currentIndex === this.images.length - 1) {
                this.isWheelMoveComplete = true;
                console.log('Wheel move 완료 - 다음 스크롤로 섹션 전환');
            }
        } else if (this.isWheelMoveComplete) {
            // 마지막 이미지에서 한 번 더 스크롤 - 섹션 전환
            this.triggerSectionTransition();
        }
    }

    handleUpScroll() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.showImage(this.currentIndex);
            
            // 마지막 이미지에서 벗어났으면 완료 상태 해제
            if (this.currentIndex < this.images.length - 1) {
                this.isWheelMoveComplete = false;
            }
        }
    }

    showImage(index) {
        // 이전에 활성화된 이미지 숨기기
        const prevActive = document.querySelector('.wheel-image.active');
        if (prevActive) {
            prevActive.classList.remove('active');
        }
        
        // 새 이미지 보이기
        if (this.images[index]) {
            this.images[index].classList.add('active');
        }
        
        console.log(`이미지 전환: ${index + 1}/${this.images.length}`);
    }

    // intro 섹션 활성화
    activateIntro() {
        this.isIntroActive = true;
        this.introSection.classList.add('active');
        this.currentIndex = 0;
        this.isWheelMoveComplete = false;
        this.showImage(0);
        console.log('Intro 섹션 활성화됨');
    }

    // intro 섹션 비활성화
    deactivateIntro() {
        this.isIntroActive = false;
        this.introSection.classList.remove('active');
        this.introSection.classList.add('fade-out');
        console.log('Intro 섹션 비활성화됨');
        
        // 완전 비활성화 처리
        setTimeout(() => {
            this.introSection.classList.add('deactivated');
            this.introSection.classList.remove('fade-out');
        }, 800);
    }

    // intro 섹션 재활성화 (first에서 돌아올 때)
    reactivateIntro() {
        console.log('[DEBUG] reactivateIntro() 시작');
        console.log('[DEBUG] introSection 존재:', !!this.introSection);
        console.log('[DEBUG] images 개수:', this.images ? this.images.length : 0);
        
        this.isIntroActive = true;
        this.introSection.classList.remove('deactivated', 'fade-out');
        this.introSection.classList.add('active');
        
        // 마지막 이미지로 설정 (역방향 진입)
        this.currentIndex = this.images.length - 1;
        this.isWheelMoveComplete = true;
        this.showImage(this.currentIndex);
        
        console.log('[DEBUG] intro 재활성화 완료 - 이미지:', this.currentIndex + 1);
    }

    // 섹션 전환 트리거
    triggerSectionTransition() {
        console.log('섹션 전환 시작: intro → first');
        
        // intro 페이드아웃
        this.deactivateIntro();
        
        // first 섹션 페이드인
        if (window.layeredSectionManager) {
            window.layeredSectionManager.activateFirstFromIntro();
        }
    }

    // 역방향 섹션 전환 (first → intro)
    triggerReverseTransition() {
        console.log('[DEBUG] wheelMoveIntro.triggerReverseTransition() 시작');
        console.log('[DEBUG] 현재 isIntroActive:', this.isIntroActive);
        console.log('[DEBUG] layeredSectionManager 존재:', !!window.layeredSectionManager);
        
        // intro 재활성화
        console.log('[DEBUG] intro 재활성화 중...');
        this.reactivateIntro();
        
        // first 섹션 비활성화
        if (window.layeredSectionManager) {
            console.log('[DEBUG] first 섹션 비활성화 중...');
            window.layeredSectionManager.deactivateFirstToIntro();
        } else {
            console.error('[ERROR] window.layeredSectionManager가 존재하지 않습니다!');
        }
        
        console.log('[DEBUG] wheelMoveIntro.triggerReverseTransition() 완료');
    }

    // 리셋 (테스트용)
    reset() {
        this.currentIndex = 0;
        this.isWheelMoveComplete = false;
        this.isIntroActive = false;
        this.introSection.classList.remove('active', 'fade-out', 'deactivated');
        this.showImage(0);
        console.log('WheelMoveIntro 리셋됨');
    }
}

// 전역에서 사용할 수 있도록 설정
window.wheelMoveIntro = new WheelMoveIntro();

// 전역 함수들
window.activateIntroSection = function() {
    if (window.wheelMoveIntro) {
        window.wheelMoveIntro.activateIntro();
    }
};

window.reactivateIntroSection = function() {
    if (window.wheelMoveIntro) {
        window.wheelMoveIntro.reactivateIntro();
    }
};

window.triggerIntroReverseTransition = function() {
    if (window.wheelMoveIntro) {
        window.wheelMoveIntro.triggerReverseTransition();
    }
};

window.resetIntroSection = function() {
    if (window.wheelMoveIntro) {
        window.wheelMoveIntro.reset();
    }
};

console.log('WheelMoveIntro 컴포넌트 로드 완료'); 