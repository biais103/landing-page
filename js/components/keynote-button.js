// Keynote 스타일 인터랙티브 버튼
class KeynoteButton {
    constructor(selector) {
        this.button = document.querySelector(selector);
        this.init();
    }

    init() {
        if (!this.button) return;
        
        this.addEventListeners();
        this.addEnhancedEffects();
        // 초기 상태에서 파티클 효과 활성화
        this.activateParticles();
    }

    addEventListeners() {
        // 클릭 이벤트
        this.button.addEventListener('click', (e) => {
            this.handleClick(e);
        });

        // 마우스 이벤트
        this.button.addEventListener('mouseenter', () => {
            this.handleMouseEnter();
        });

        this.button.addEventListener('mouseleave', () => {
            this.handleMouseLeave();
        });

        // 터치 이벤트 (모바일)
        this.button.addEventListener('touchstart', (e) => {
            this.handleTouchStart(e);
        });
    }

    handleClick(e) {
        // 리플 효과 트리거
        this.createRipple(e);
        
        // 버튼 액션 (여기서는 benefit 섹션으로 스크롤)
        this.scrollToBenefit();
    }

    handleMouseEnter() {
        // 파티클 효과 비활성화 (호버 시 사라짐)
        this.deactivateParticles();
    }

    handleMouseLeave() {
        // 파티클 효과 활성화 (기본 상태로 복귀)
        this.activateParticles();
    }

    handleTouchStart(e) {
        // 모바일에서 터치 피드백
        this.button.style.transform = 'translateY(0)';
        setTimeout(() => {
            this.button.style.transform = '';
        }, 150);
    }

    createRipple(e) {
        const rect = this.button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // 임시 리플 요소 생성
        const ripple = document.createElement('div');
        ripple.className = 'keynote-ripple';
        ripple.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.4);
            transform: translate(-50%, -50%);
            animation: rippleEffect 0.6s ease-out;
            pointer-events: none;
            z-index: 10;
        `;

        this.button.appendChild(ripple);

        // 애니메이션 완료 후 제거
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    activateParticles() {
        const particles = this.button.querySelectorAll('.particle');
        particles.forEach((particle, index) => {
            setTimeout(() => {
                particle.style.animation = 'particleFloat 2s ease-in-out infinite';
                particle.style.opacity = '1';
            }, index * 100);
        });
    }

    deactivateParticles() {
        const particles = this.button.querySelectorAll('.particle');
        particles.forEach(particle => {
            particle.style.animation = 'none';
            particle.style.opacity = '0';
        });
    }

    scrollToBenefit() {
        // page.html 페이지로 이동
        window.location.href = 'page.html';
    }

    addEnhancedEffects() {
        // CSS 키프레임 애니메이션을 동적으로 추가
        const style = document.createElement('style');
        style.textContent = `
            @keyframes rippleEffect {
                0% {
                    width: 0;
                    height: 0;
                    opacity: 1;
                }
                100% {
                    width: 300px;
                    height: 300px;
                    opacity: 0;
                }
            }
            
            .keynote-button:hover .keynote-button__glow {
                animation: glowPulse 2s ease-in-out infinite;
            }
            
                         @keyframes glowPulse {
                 0%, 100% {
                     opacity: 0.2;
                     transform: scale(1);
                 }
                 50% {
                     opacity: 0.4;
                     transform: scale(1.1);
                 }
             }
        `;
        document.head.appendChild(style);
    }
}

// DOM 로드 완료 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    new KeynoteButton('#learn-more-btn');
});

export default KeynoteButton; 