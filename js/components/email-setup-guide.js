/**
 * Formspree 설정 가이드
 * 
 * 1. https://formspree.io 에서 계정 생성
 * 2. 새 Form 생성: "Landing Page Newsletter" 
 * 3. Form ID 복사 (예: xpznvlog)
 * 4. main-interactions.js 파일에서 아래 라인 수정:
 * 
 * 변경 전:
 * const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
 * 
 * 변경 후:
 * const response = await fetch('https://formspree.io/f/실제_FORM_ID', {
 * 
 * 예시:
 * const response = await fetch('https://formspree.io/f/xpznvlog', {
 */

// 예시 설정
const FORMSPREE_SETUP_EXAMPLE = {
    formId: 'xrbkapgb', // 실제 Form ID로 교체
    endpoint: 'https://formspree.io/f/xrbkapgb',
    
    // 테스트용 함수
    testConnection: async function() {
        try {
            const response = await fetch(this.endpoint, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: 'test@example.com',
                    message: '테스트 이메일',
                    timestamp: new Date().toISOString()
                })
            });
            
            console.log('Formspree 연결 테스트:', response.ok ? '성공' : '실패');
        } catch (error) {
            console.error('연결 테스트 실패:', error);
        }
    }
}; 