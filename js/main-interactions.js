/**
 * Main page interactions
 * Apple-style smooth scroll and interactive effects
 */

// DOM 로드 완료 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    initScrollInteractions();
    initTextAnimations();
    initBenefitSectionAnimations();
    initFeaturesSectionAnimations();
    initContactSectionAnimations();
    initEmailSubmission();
});

// 스크롤 인터랙션 초기화
function initScrollInteractions() {
    const whatsContainer = document.querySelector('.whats-container');
    
    if (!whatsContainer) return;
    
    // Parallax effect on scroll
    window.addEventListener('scroll', function() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const elementTop = whatsContainer.offsetTop;
        const elementHeight = whatsContainer.offsetHeight;
        
        // Calculate when element is in viewport
        if (scrollY + windowHeight > elementTop && scrollY < elementTop + elementHeight) {
            const progress = (scrollY + windowHeight - elementTop) / (windowHeight + elementHeight);
            const transform = Math.max(0, Math.min(1, progress));
            
            // Subtle parallax movement
            whatsContainer.style.transform = `translateY(${(1 - transform) * 20}px)`;
            whatsContainer.style.opacity = Math.min(1, transform * 1.5);
        }
    });
}



// 텍스트 애니메이션 초기화
function initTextAnimations() {
    // Text reveal animation on load
    const textElements = document.querySelectorAll('.whats-main-title, .whats-subtitle, .whats-description, .whats-highlight');
    
    textElements.forEach((element, index) => {
        element.style.animationDelay = `${0.3 + (index * 0.3)}s`;
    });
}

// Benefit 섹션 스크롤 애니메이션 초기화
function initBenefitSectionAnimations() {
    const benefitHeadline = document.querySelector('.benefit-headline');
    const benefitContainer = document.querySelector('.benefit-container');
    const benefitDescription = document.querySelector('.benefit-description');
    const benefitToFeature = document.querySelector('.benefit-description__to-feature');
    
    if (!benefitHeadline || !benefitContainer || !benefitDescription || !benefitToFeature) return;
    
    // Intersection Observer 설정
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '-50px 0px -50px 0px'
    };
    
    // 헤드라인 관찰자
    const headlineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // 헤드라인이 나타난 후 0.5초 뒤에 컨테이너 애니메이션 트리거
                setTimeout(() => {
                    benefitContainer.classList.add('visible');
                    // 컨테이너가 나타난 후 0.8초 뒤에 설명 문구 애니메이션 트리거
                    setTimeout(() => {
                        benefitDescription.classList.add('visible');
                        // 설명 문구가 나타난 후 0.6초 뒤에 화살표 애니메이션 트리거
                        setTimeout(() => {
                            benefitToFeature.classList.add('visible');
                        }, 600);
                    }, 800);
                }, 500);
                
                headlineObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    headlineObserver.observe(benefitHeadline);
    

    
    // 추가적인 스크롤 효과 (시차 효과) - 쓰로틀링 적용
    let isScrolling = false;
    
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            requestAnimationFrame(() => {
                const benefitSection = document.querySelector('.benefit-section');
                
                if (benefitSection) {
                    const rect = benefitSection.getBoundingClientRect();
                    const windowHeight = window.innerHeight;
                    
                    // 섹션이 뷰포트에 있을 때만 실행
                    if (rect.top < windowHeight && rect.bottom > 0) {
                        const progress = Math.max(0, Math.min(1, (windowHeight - rect.top) / windowHeight));
                        
                                        // 미묘한 시차 효과
                if (benefitHeadline.classList.contains('visible')) {
                    benefitHeadline.style.transform = `translateY(${(1 - progress) * 10}px)`;
                }
                
                if (benefitContainer.classList.contains('visible')) {
                    benefitContainer.style.transform = `translateY(${(1 - progress) * 20}px)`;
                }
                
                if (benefitDescription.classList.contains('visible')) {
                    benefitDescription.style.transform = `translateY(${(1 - progress) * 15}px)`;
                }
                
                if (benefitToFeature.classList.contains('visible')) {
                    benefitToFeature.style.transform = `translateY(${(1 - progress) * 10}px)`;
                }
                    }
                }
                
                isScrolling = false;
            });
            isScrolling = true;
        }
    });
}

// Contact 섹션 스크롤 애니메이션 초기화
function initContactSectionAnimations() {
    const contactHeadline = document.querySelector('.contact-headline');
    const contactContainer = document.querySelector('.contact-container');
    
    if (!contactHeadline || !contactContainer) return;
    
    // Intersection Observer 설정
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '-50px 0px -50px 0px'
    };
    
    // 헤드라인 관찰자
    const headlineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // 헤드라인이 나타난 후 0.5초 뒤에 컨테이너 애니메이션 트리거
                setTimeout(() => {
                    contactContainer.classList.add('visible');
                }, 500);
                
                headlineObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    headlineObserver.observe(contactHeadline);
}

// 이메일 제출 기능 초기화
function initEmailSubmission() {
    const emailInput = document.querySelector('.contact-container__input input');
    const submitButton = document.querySelector('.contact-container__button');
    const contactContainer = document.querySelector('.contact-container');
    
    if (!emailInput || !submitButton || !contactContainer) return;
    
    // 이메일 유효성 검사 함수
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // 메시지 표시 함수
    function showMessage(message, isSuccess = true) {
        // 기존 메시지 제거
        const existingMessage = contactContainer.querySelector('.contact-success, .contact-error');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // 새 메시지 생성
        const messageDiv = document.createElement('div');
        messageDiv.className = isSuccess ? 'contact-success' : 'contact-error';
        messageDiv.textContent = message;
        
        contactContainer.appendChild(messageDiv);
        
        // 애니메이션으로 표시
        setTimeout(() => {
            messageDiv.classList.add('visible');
        }, 100);
        
        // 3초 후 자동 제거
        setTimeout(() => {
            messageDiv.classList.remove('visible');
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.remove();
                }
            }, 300);
        }, 3000);
    }
    
    // 이메일 저장 함수 (Formspree 사용)
    async function saveEmail(email) {
        try {
            // 로컬 스토리지에서 중복 확인 (선택사항)
            const savedEmails = JSON.parse(localStorage.getItem('newsletterEmails') || '[]');
            if (savedEmails.includes(email)) {
                showMessage('이미 등록된 이메일입니다.', false);
                return false;
            }
            
            // Formspree로 이메일 전송
            // TODO: 'YOUR_FORM_ID'를 실제 Formspree Form ID로 교체하세요
            const response = await fetch('https://formspree.io/f/xrbkapgb', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    message: '인터랙티브 웹사이트 제작 서비스 알림 신청',
                    timestamp: new Date().toISOString(),
                    source: 'Landing Page'
                })
            });
            
            if (response.ok) {
                // 로컬 스토리지에도 저장 (백업용)
                savedEmails.push(email);
                localStorage.setItem('newsletterEmails', JSON.stringify(savedEmails));
                
                return true;
            } else {
                throw new Error('서버 응답 오류');
            }
            
        } catch (error) {
            console.error('이메일 저장 오류:', error);
            return false;
        }
    }
    
    // 버튼 클릭 이벤트
    submitButton.addEventListener('click', async function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        
        // 이메일 유효성 검사
        if (!email) {
            showMessage('이메일을 입력해주세요.', false);
            emailInput.focus();
            return;
        }
        
        if (!isValidEmail(email)) {
            showMessage('올바른 이메일 형식을 입력해주세요.', false);
            emailInput.focus();
            return;
        }
        
        // 버튼 비활성화
        submitButton.disabled = true;
        submitButton.textContent = '저장 중...';
        
        // 이메일 저장
        const success = saveEmail(email);
        
        setTimeout(() => {
            if (success) {
                showMessage('알림 신청이 완료되었습니다! 서비스 오픈 시 이메일로 알려드리겠습니다.', true);
                emailInput.value = '';
            } else {
                showMessage('저장 중 오류가 발생했습니다. 다시 시도해주세요.', false);
            }
            
            // 버튼 복원
            submitButton.disabled = false;
            submitButton.textContent = '알림 받기';
        }, 1000);
    });
    
    // Enter 키 지원
    emailInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            submitButton.click();
        }
    });
    
    // 입력 시 실시간 유효성 검사
    emailInput.addEventListener('input', function() {
        const email = this.value.trim();
        
        if (email && isValidEmail(email)) {
            this.style.borderColor = 'rgba(34, 197, 94, 0.5)';
        } else if (email) {
            this.style.borderColor = 'rgba(239, 68, 68, 0.5)';
        } else {
            this.style.borderColor = 'rgba(96, 165, 250, 0.3)';
        }
    });
}

// Features 섹션 스크롤 애니메이션 초기화
function initFeaturesSectionAnimations() {
    const featuresHeadline = document.querySelector('.features-headline');
    const featuresContainer = document.querySelector('.features-container');
    const featureDescription = document.querySelector('.feature-description');
    
    if (!featuresHeadline || !featuresContainer || !featureDescription) return;
    
    // Intersection Observer 설정
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '-50px 0px -50px 0px'
    };
    
    // 헤드라인 관찰자
    const headlineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // 헤드라인이 나타난 후 0.5초 뒤에 컨테이너 애니메이션 트리거
                setTimeout(() => {
                    featuresContainer.classList.add('visible');
                    // 컨테이너가 나타난 후 1초 뒤에 설명 문구 애니메이션 트리거
                    setTimeout(() => {
                        featureDescription.classList.add('visible');
                    }, 1000);
                }, 500);
                
                headlineObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    headlineObserver.observe(featuresHeadline);
    
    // 추가적인 스크롤 효과 (시차 효과)
    let isScrolling = false;
    
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            requestAnimationFrame(() => {
                const featuresSection = document.querySelector('.features-section');
                
                if (featuresSection) {
                    const rect = featuresSection.getBoundingClientRect();
                    const windowHeight = window.innerHeight;
                    
                    // 섹션이 뷰포트에 있을 때만 실행
                    if (rect.top < windowHeight && rect.bottom > 0) {
                        const progress = Math.max(0, Math.min(1, (windowHeight - rect.top) / windowHeight));
                        
                        // 미묘한 시차 효과
                        if (featuresHeadline.classList.contains('visible')) {
                            featuresHeadline.style.transform = `translateY(${(1 - progress) * 10}px)`;
                        }
                        
                        if (featuresContainer.classList.contains('visible')) {
                            featuresContainer.style.transform = `translateY(${(1 - progress) * 20}px)`;
                        }
                        
                        if (featureDescription.classList.contains('visible')) {
                            featureDescription.style.transform = `translateY(${(1 - progress) * 15}px)`;
                        }
                    }
                }
                
                isScrolling = false;
            });
            isScrolling = true;
        }
    });
} 