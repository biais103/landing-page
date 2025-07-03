/**
 * 이메일 처리 기능 - Formspree 연동
 * page.html의 Contact 섹션에서 사용
 */

class EmailHandler {
    constructor() {
        this.formspreeEndpoint = 'https://formspree.io/f/xrbkapgb'; // email-setup-guide.js에서 확인한 Form ID
        this.emailInput = null;
        this.submitButton = null;
        this.isSubmitting = false;
        this.init();
    }

    init() {
        // DOM 요소들 찾기
        this.emailInput = document.querySelector('.contact-container__input input[type="email"]');
        this.submitButton = document.querySelector('.contact-container__button');

        if (!this.emailInput || !this.submitButton) {
            console.error('이메일 입력 폼 또는 버튼을 찾을 수 없습니다.');
            return;
        }

        console.log('EmailHandler 초기화 완료');
        this.setupEventListeners();
    }

    setupEventListeners() {
        // 버튼 클릭 이벤트
        this.submitButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Enter 키 이벤트
        this.emailInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.handleSubmit();
            }
        });

        // 실시간 입력 유효성 검사
        this.emailInput.addEventListener('input', () => {
            this.validateEmail();
        });
    }

    async handleSubmit() {
        if (this.isSubmitting) {
            console.log('이미 전송 중입니다.');
            return;
        }

        const email = this.emailInput.value.trim();
        
        // 이메일 유효성 검사
        if (!this.isValidEmail(email)) {
            this.showMessage('유효한 이메일 주소를 입력해주세요.', 'error');
            this.emailInput.focus();
            return;
        }

        try {
            this.isSubmitting = true;
            this.setButtonLoading(true);

            // Formspree로 데이터 전송
            const response = await fetch(this.formspreeEndpoint, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    message: '서비스 오픈 알림 요청',
                    source: 'Landing Page Contact Form',
                    timestamp: new Date().toISOString()
                })
            });

            if (response.ok) {
                this.showMessage('알림 신청이 완료되었습니다! 서비스 오픈 시 이메일로 알려드릴게요.', 'success');
                this.emailInput.value = ''; // 입력 필드 초기화
                
                // 성공 시 버튼 텍스트 일시 변경
                this.setButtonSuccess();
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

        } catch (error) {
            console.error('이메일 전송 실패:', error);
            this.showMessage('전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.', 'error');
        } finally {
            this.isSubmitting = false;
            // 3초 후 버튼 상태 복원
            setTimeout(() => {
                this.setButtonLoading(false);
            }, 3000);
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    validateEmail() {
        const email = this.emailInput.value.trim();
        
        if (email === '') {
            this.removeInputState();
            return;
        }

        if (this.isValidEmail(email)) {
            this.setInputValid();
        } else {
            this.setInputInvalid();
        }
    }

    setInputValid() {
        this.emailInput.classList.remove('invalid');
        this.emailInput.classList.add('valid');
    }

    setInputInvalid() {
        this.emailInput.classList.remove('valid');
        this.emailInput.classList.add('invalid');
    }

    removeInputState() {
        this.emailInput.classList.remove('valid', 'invalid');
    }

    setButtonLoading(isLoading) {
        if (isLoading) {
            this.submitButton.textContent = '전송 중...';
            this.submitButton.disabled = true;
            this.submitButton.classList.add('loading');
        } else {
            this.submitButton.textContent = '알림 받기';
            this.submitButton.disabled = false;
            this.submitButton.classList.remove('loading', 'success');
        }
    }

    setButtonSuccess() {
        this.submitButton.textContent = '신청 완료!';
        this.submitButton.classList.add('success');
        this.submitButton.classList.remove('loading');
    }

    showMessage(message, type = 'info') {
        // 기존 메시지가 있다면 제거
        const existingMessage = document.querySelector('.email-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // 메시지 요소 생성
        const messageElement = document.createElement('div');
        messageElement.className = `email-message ${type}`;
        messageElement.textContent = message;
        
        // 메시지를 contact 컨테이너 아래에 추가
        const contactContainer = document.querySelector('.contact-container');
        if (contactContainer) {
            contactContainer.appendChild(messageElement);
            
            // 3초 후 자동 제거
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.remove();
                }
            }, 5000);
        }
    }

    // 테스트용 연결 확인 함수
    async testConnection() {
        try {
            console.log('Formspree 연결 테스트 시작...');
            
            const response = await fetch(this.formspreeEndpoint, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: 'test@example.com',
                    message: '연결 테스트',
                    test: true,
                    timestamp: new Date().toISOString()
                })
            });
            
            if (response.ok) {
                console.log('✅ Formspree 연결 성공!');
                return true;
            } else {
                console.log(`❌ Formspree 연결 실패: ${response.status}`);
                return false;
            }
        } catch (error) {
            console.error('❌ Formspree 연결 테스트 실패:', error);
            return false;
        }
    }
}

// DOM 로드 완료 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    window.emailHandler = new EmailHandler();
    
    // 개발자 콘솔에서 테스트할 수 있도록 전역 함수 제공
    window.testEmailConnection = function() {
        if (window.emailHandler) {
            return window.emailHandler.testConnection();
        }
    };
    
    console.log('이메일 처리 기능 로드 완료');
});
