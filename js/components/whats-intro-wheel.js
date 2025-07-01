// Whats Section Intro - Wheel Move Effect

class WheelMoveIntro {
    constructor() {
        this.images = null;
        this.currentIndex = 0;
        this.isWheelMoveComplete = false;
        this.introSection = null;
        this.isIntroActive = false;
        this.progressBar = null;
        this.progressFill = null;
        this.init();
    }

    init() {
        // intro 섹션과 이미지들 찾기
        this.introSection = document.querySelector('.whats-section--intro');
        this.images = document.querySelectorAll('.wheel-image');
        this.progressBar = document.querySelector('.wheel-progress-bar');
        this.progressFill = document.querySelector('.wheel-progress-bar__fill');
        
        if (!this.introSection || !this.images.length) {
            console.error('intro 섹션 또는 wheel 이미지들을 찾을 수 없습니다.');
            return;
        }

        if (!this.progressBar || !this.progressFill) {
            console.error('progress bar 요소들을 찾을 수 없습니다.');
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
        
        // 상태바 업데이트
        this.updateProgressBar();
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

    // intro 섹션 비활성화 (3D 큐브 효과)
    deactivateIntro() {
        this.isIntroActive = false;
        this.introSection.classList.remove('active');
        this.introSection.classList.add('cube-rotate-out');
        console.log('Intro 섹션 비활성화됨 (3D 큐브 좌측 회전)');
        
        // 완전 비활성화 처리
        setTimeout(() => {
            this.introSection.classList.add('deactivated');
            this.introSection.classList.remove('cube-rotate-out');
        }, 1400); // 1.4초로 연장
    }

    // intro 섹션 재활성화 (middle에서 돌아올 때 - 3D 큐브 효과)
    reactivateIntro() {
        this.isIntroActive = true;
        this.introSection.classList.remove('deactivated', 'cube-rotate-out');
        this.introSection.classList.add('active', 'cube-rotate-in');
        
        // 마지막 이미지로 설정 (역방향 진입)
        this.currentIndex = this.images.length - 1;
        this.isWheelMoveComplete = true;
        this.showImage(this.currentIndex);
        
        console.log('intro 재활성화 완료 - 3D 큐브 우측에서 회전하여 마지막 이미지 설정');
        
        // 애니메이션 완료 후 cube-rotate-in 클래스 제거
        setTimeout(() => {
            this.introSection.classList.remove('cube-rotate-in');
        }, 1400);
    }

    // 섹션 전환 트리거
    triggerSectionTransition() {
        console.log('섹션 전환 시작: intro → middle');
        
        // intro 페이드아웃
        this.deactivateIntro();
        
        // middle 섹션 페이드인
        if (window.layeredSectionManager) {
            window.layeredSectionManager.activateMiddleFromIntro();
        }
    }

    // 역방향 섹션 전환 (middle → intro)
    triggerReverseTransition() {
        console.log('섹션 역전환 시작: middle → intro');
        
        // intro 재활성화
        this.reactivateIntro();
        
        // middle 섹션 비활성화
        if (window.layeredSectionManager) {
            window.layeredSectionManager.deactivateMiddleToIntro();
        } else {
            console.error('layeredSectionManager가 존재하지 않습니다!');
        }
    }

    // 상태바 업데이트
    updateProgressBar() {
        if (!this.progressFill || !this.images.length) return;
        
        // 현재 진행도 계산 (1부터 시작하므로 +1)
        const progress = ((this.currentIndex + 1) / this.images.length) * 100;
        
        // 상태바 width 업데이트
        this.progressFill.style.width = `${progress}%`;
        
        // 마지막 이미지인 경우 완료 클래스 추가
        if (this.currentIndex === this.images.length - 1) {
            this.progressFill.classList.add('complete');
        } else {
            this.progressFill.classList.remove('complete');
        }
        
        // console.log(`상태바 업데이트: ${this.currentIndex + 1}/${this.images.length} (${progress.toFixed(1)}%)`);
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