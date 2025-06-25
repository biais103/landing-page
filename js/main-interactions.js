/**
 * Main page interactions
 * Apple-style smooth scroll and interactive effects
 */

// 인트로 애니메이션 초기화
function initIntroAnimation() {
    const introSection = document.querySelector('.intro-section');
    const cosmicStar = document.querySelector('.cosmic-breathing-star');
    const clickButton = document.querySelector('.click-button');
    const mainScreen = document.querySelector('.main-screen');
    
    if (!introSection || !cosmicStar || !clickButton || !mainScreen) return;
    
    // 페이지 로드 시 스크롤 비활성화
    document.body.style.overflow = 'hidden';
    
    // Click 버튼 클릭 이벤트
    clickButton.addEventListener('click', function() {
        const breathingStar = cosmicStar.querySelector('.breathing-star');
        
        // 0. 클릭과 동시에 버튼 즉시 숨기기 (애니메이션과 트랜지션 모두 무시)
        clickButton.style.animation = 'none';
        clickButton.style.transition = 'none';
        clickButton.style.opacity = '0';
        clickButton.style.pointerEvents = 'none';
        clickButton.style.visibility = 'hidden';
        
        // 1. 별 폭발 애니메이션 시작
        if (breathingStar) {
            breathingStar.classList.add('exploding');
        }
        
        // 2. 0.65초 후 main-screen 페이드인 시작 (기존 1.3초에서 절반 앞당김)
        setTimeout(() => {
            mainScreen.classList.add('fade-in');
        }, 650);
        
        // 3. 0.8초 후 (별 폭발 애니메이션 완료 후) intro-section 페이드아웃 시작
        setTimeout(() => {
            introSection.classList.add('fade-out');
            cosmicStar.classList.add('explode');
        }, 800);
        
        // 4. 2초 후 요소들 완전 제거 및 스크롤 활성화
        setTimeout(() => {
            introSection.style.display = 'none';
            cosmicStar.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 2000);
    });
}

// DOM 로드 완료 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    initIntroAnimation();
    initTextAnimations();
    initWhatsStickyScroll();
    initBenefitSectionAnimations();
    initFeaturesSectionAnimations();
    initContactSectionAnimations();
    initEmailSubmission();
});

// 텍스트 애니메이션 초기화
function initTextAnimations() {
    // Text reveal animation on load
    const textElements = document.querySelectorAll('.whats-main-title, .whats-subtitle, .whats-description, .whats-highlight');
    
    textElements.forEach((element, index) => {
        element.style.animationDelay = `${0.3 + (index * 0.3)}s`;
    });
}

// Whats 섹션 순차적 스크롤 스냅 (건너뛰기 방지)
function initWhatsStickyScroll() {
    const stickyContainer = document.querySelector('.whats-sticky-container');
    const whatsSections = Array.from(document.querySelectorAll('.whats-section'));
    if (!stickyContainer || whatsSections.length === 0) return;

    let currentSection = 0;
    let isBlocked = false;
    let wheelAccumulator = 0; // 휠 누적값
    let lastWheelTime = 0;

    // 각 섹션의 스크롤 위치 계산
    function getSectionScrollTop(sectionIndex) {
        return stickyContainer.offsetTop + sectionIndex * window.innerHeight;
    }

    // 섹션 활성화/비활성화
    function updateActiveSection(newSection) {
        whatsSections.forEach((section, idx) => {
            if (idx === newSection) section.classList.add('active');
            else section.classList.remove('active');
        });
        currentSection = newSection;
    }

    // 부드러운 섹션 이동
    function goToSection(sectionIndex) {
        if (sectionIndex < 0 || sectionIndex >= whatsSections.length) return;
        
        const targetScrollTop = getSectionScrollTop(sectionIndex);
        window.scrollTo({
            top: targetScrollTop,
            behavior: 'smooth'
        });
        updateActiveSection(sectionIndex);
    }

    // 개선된 휠 이벤트 처리 (순차적 전환 보장)
    function onWheel(e) {
        if (isBlocked) {
            e.preventDefault();
            return;
        }

        const scrollY = window.scrollY;
        const containerTop = stickyContainer.offsetTop;
        const containerBottom = containerTop + stickyContainer.offsetHeight - window.innerHeight;
        
        // whats 섹션 영역 내에서만 동작
        if (scrollY < containerTop - 50 || scrollY > containerBottom + 50) {
            wheelAccumulator = 0; // 영역 벗어나면 누적값 초기화
            return;
        }

        const currentTime = Date.now();
        const timeDiff = currentTime - lastWheelTime;
        
        // 휠 누적값 계산 (빠른 스크롤 감지)
        if (timeDiff > 150) {
            wheelAccumulator = 0; // 150ms 이상 간격이면 누적값 초기화
        }
        
        wheelAccumulator += Math.abs(e.deltaY);
        lastWheelTime = currentTime;
        
        // 휠 방향 감지
        const direction = e.deltaY > 0 ? 1 : -1;
        let targetSection = currentSection;

        // 누적값이 임계치를 넘으면 섹션 전환 (빠른 스크롤이라도 한 번에 하나씩만)
        const threshold = 100; // 임계치 (조정 가능)
        
        if (wheelAccumulator >= threshold) {
            if (direction > 0 && currentSection < whatsSections.length - 1) {
                // 다음 whats 섹션으로 이동 (순차적)
                e.preventDefault();
                targetSection = currentSection + 1;
                wheelAccumulator = 0; // 누적값 초기화
            } else if (direction < 0 && currentSection > 0) {
                // 이전 whats 섹션으로 이동 (순차적)
                e.preventDefault();
                targetSection = currentSection - 1;
                wheelAccumulator = 0; // 누적값 초기화
            } else if (direction > 0 && currentSection === whatsSections.length - 1) {
                // 마지막 whats 섹션에서 아래로 휠: 일반 스크롤로 넘어가도록 허용
                wheelAccumulator = 0;
                return;
            } else if (direction < 0 && currentSection === 0) {
                // 첫 번째 whats 섹션에서 위로 휠: intro로 돌아가거나 무시
                e.preventDefault();
                wheelAccumulator = 0;
                return;
            }
        } else {
            // 임계치 미달시 기본 스크롤 방지
            e.preventDefault();
        }

        if (targetSection !== currentSection) {
            // 휠 블로킹 (연속 휠 방지) - 더 긴 시간으로 설정
            isBlocked = true;
            goToSection(targetSection);
            
            // 800ms 후 블로킹 해제 (부드러운 스크롤 완료 대기)
            setTimeout(() => {
                isBlocked = false;
            }, 800);
        }
    }

    // 터치/스와이프 지원 (모바일)
    let touchStartY = 0;
    let touchEndY = 0;
    
    function onTouchStart(e) {
        touchStartY = e.touches[0].clientY;
    }
    
    function onTouchEnd(e) {
        if (isBlocked) return;
        
        touchEndY = e.changedTouches[0].clientY;
        const touchDiff = touchStartY - touchEndY;
        
        // 최소 스와이프 거리
        if (Math.abs(touchDiff) < 50) return;
        
        const scrollY = window.scrollY;
        const containerTop = stickyContainer.offsetTop;
        const containerBottom = containerTop + stickyContainer.offsetHeight - window.innerHeight;
        
        // whats 섹션 영역 내에서만 동작
        if (scrollY < containerTop - 50 || scrollY > containerBottom + 50) return;
        
        let targetSection = currentSection;
        
        if (touchDiff > 0 && currentSection < whatsSections.length - 1) {
            // 위로 스와이프 (다음 섹션)
            e.preventDefault();
            targetSection = currentSection + 1;
        } else if (touchDiff < 0 && currentSection > 0) {
            // 아래로 스와이프 (이전 섹션)
            e.preventDefault();
            targetSection = currentSection - 1;
        }
        
        if (targetSection !== currentSection) {
            isBlocked = true;
            goToSection(targetSection);
            
            setTimeout(() => {
                isBlocked = false;
            }, 800);
        }
    }

    // 이벤트 리스너 등록
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: false });

    // 키보드 네비게이션 지원
    function onKeyDown(e) {
        if (isBlocked) return;
        
        const scrollY = window.scrollY;
        const containerTop = stickyContainer.offsetTop;
        const containerBottom = containerTop + stickyContainer.offsetHeight - window.innerHeight;
        
        // whats 섹션 영역 내에서만 동작
        if (scrollY < containerTop - 50 || scrollY > containerBottom + 50) return;
        
        let targetSection = currentSection;
        
        if ((e.key === 'ArrowDown' || e.key === 'PageDown') && currentSection < whatsSections.length - 1) {
            e.preventDefault();
            targetSection = currentSection + 1;
        } else if ((e.key === 'ArrowUp' || e.key === 'PageUp') && currentSection > 0) {
            e.preventDefault();
            targetSection = currentSection - 1;
        }
        
        if (targetSection !== currentSection) {
            isBlocked = true;
            goToSection(targetSection);
            
            setTimeout(() => {
                isBlocked = false;
            }, 800);
        }
    }
    
    window.addEventListener('keydown', onKeyDown);

    // 스크롤 위치 동기화 (외부 스크롤 시)
    window.addEventListener('scroll', function() {
        if (isBlocked) return;

        const scrollY = window.scrollY;
        const containerTop = stickyContainer.offsetTop;
        const containerBottom = containerTop + stickyContainer.offsetHeight - window.innerHeight;
        
        // whats 섹션 영역 내에서 현재 어떤 섹션이 보이는지 감지
        if (scrollY >= containerTop && scrollY <= containerBottom) {
            const relativeScrollY = scrollY - containerTop;
            const targetSectionIndex = Math.round(relativeScrollY / window.innerHeight);
            
            if (targetSectionIndex !== currentSection && 
                targetSectionIndex >= 0 && 
                targetSectionIndex < whatsSections.length) {
                updateActiveSection(targetSectionIndex);
            }
        }
    }, { passive: true });

    // 리사이즈 시 현재 섹션 위치로 재조정
    window.addEventListener('resize', () => {
        setTimeout(() => {
            goToSection(currentSection);
        }, 100);
    });

    // 초기 상태
    updateActiveSection(0);
    setTimeout(() => {
        goToSection(0);
    }, 100);
}

// Benefit 섹션들 스크롤 애니메이션 초기화
function initBenefitSectionAnimations() {
    // benefit-1의 요소들
    const benefit1Headline = document.querySelector('#benefit-1 .benefit-headline');
    const benefit1Container = document.querySelector('#benefit-1 .benefit-container');
    
    // benefit-2의 요소들
    const benefit2Description = document.querySelector('#benefit-2 .benefit-description');
    const benefit2ToFeature = document.querySelector('#benefit-2 .benefit-description__to-feature');
    
    // benefit-1 애니메이션 초기화
    if (benefit1Headline && benefit1Container) {
        initBenefit1Animations(benefit1Headline, benefit1Container);
    }
    
    // benefit-2 애니메이션 초기화
    if (benefit2Description) {
        initBenefit2Animations(benefit2Description, benefit2ToFeature);
    }
}

function initBenefit1Animations(benefitHeadline, benefitContainer) {
    
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
                }, 500);
                
                headlineObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    headlineObserver.observe(benefitHeadline);
    
    // Benefit-1 섹션 시차 효과 (whats 섹션 영역 제외)
    let isScrolling = false;
    
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            requestAnimationFrame(() => {
                const benefit1Section = document.querySelector('#benefit-1');
                const whatsContainer = document.querySelector('.whats-sticky-container');
                
                if (benefit1Section && whatsContainer) {
                    const scrollY = window.scrollY;
                    const whatsTop = whatsContainer.offsetTop;
                    const whatsBottom = whatsTop + whatsContainer.offsetHeight;
                    
                    // whats 섹션 영역이 아닐 때만 시차 효과 실행
                    if (scrollY < whatsTop - 100 || scrollY > whatsBottom + 100) {
                        const rect = benefit1Section.getBoundingClientRect();
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
                        }
                    }
                }
                
                isScrolling = false;
            });
            isScrolling = true;
        }
    });
}

function initBenefit2Animations(benefitDescription, benefitToFeature) {
    // Intersection Observer 설정
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '-50px 0px -50px 0px'
    };
    
    // 설명 관찰자
    const descriptionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // 설명이 나타난 후 0.6초 뒤에 화살표 애니메이션 트리거 (있을 경우)
                if (benefitToFeature) {
                    setTimeout(() => {
                        benefitToFeature.classList.add('visible');
                    }, 600);
                }
                
                descriptionObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    descriptionObserver.observe(benefitDescription);
    
    // Benefit-2 섹션 시차 효과 (whats 섹션 영역 제외)
    let isScrolling = false;
    
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            requestAnimationFrame(() => {
                const benefit2Section = document.querySelector('#benefit-2');
                const whatsContainer = document.querySelector('.whats-sticky-container');
                
                if (benefit2Section && whatsContainer) {
                    const scrollY = window.scrollY;
                    const whatsTop = whatsContainer.offsetTop;
                    const whatsBottom = whatsTop + whatsContainer.offsetHeight;
                    
                    // whats 섹션 영역이 아닐 때만 시차 효과 실행
                    if (scrollY < whatsTop - 100 || scrollY > whatsBottom + 100) {
                        const rect = benefit2Section.getBoundingClientRect();
                        const windowHeight = window.innerHeight;
                        
                        // 섹션이 뷰포트에 있을 때만 실행
                        if (rect.top < windowHeight && rect.bottom > 0) {
                            const progress = Math.max(0, Math.min(1, (windowHeight - rect.top) / windowHeight));
                            
                            // 미묘한 시차 효과
                            if (benefitDescription.classList.contains('visible')) {
                                benefitDescription.style.transform = `translateY(${(1 - progress) * 15}px)`;
                            }
                            
                            if (benefitToFeature && benefitToFeature.classList.contains('visible')) {
                                benefitToFeature.style.transform = `translateY(${(1 - progress) * 10}px)`;
                            }
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
    
    // Features 섹션 시차 효과 (whats 섹션 영역 제외)
    let isScrolling = false;
    
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            requestAnimationFrame(() => {
                const featuresSection = document.querySelector('.features-section');
                const whatsContainer = document.querySelector('.whats-sticky-container');
                
                if (featuresSection && whatsContainer) {
                    const scrollY = window.scrollY;
                    const whatsTop = whatsContainer.offsetTop;
                    const whatsBottom = whatsTop + whatsContainer.offsetHeight;
                    
                    // whats 섹션 영역이 아닐 때만 시차 효과 실행
                    if (scrollY < whatsTop - 100 || scrollY > whatsBottom + 100) {
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
                }
                
                isScrolling = false;
            });
            isScrolling = true;
        }
    });
} 