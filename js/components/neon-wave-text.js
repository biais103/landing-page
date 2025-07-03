/**
 * 네온 글로우와 물결 효과를 결합한 텍스트 애니메이션
 * 각 글자별로 지연시간을 적용하여 파도처럼 움직이는 효과
 */

class NeonWaveText {
    constructor(selector) {
        this.element = document.querySelector(selector);
        if (!this.element) {
            console.warn(`Element with selector "${selector}" not found`);
            return;
        }
        this.init();
    }

    init() {
        // 원본 텍스트 저장
        this.originalText = this.element.innerHTML;
        
        // 텍스트를 글자별로 분리하고 애니메이션 적용
        this.splitTextToLetters();
    }

    splitTextToLetters() {
        // HTML 내용을 파싱하여 텍스트와 태그를 분리
        const htmlContent = this.originalText;
        let result = '';
        let letterIndex = 0;

        // HTML을 파싱하여 텍스트 노드만 처리
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;
        
        result = this.processNode(tempDiv, letterIndex);
        
        // 결과를 element에 적용
        this.element.innerHTML = result.html;
    }

    processNode(node, letterIndex = 0) {
        let html = '';
        let currentLetterIndex = letterIndex;

        for (let child of node.childNodes) {
            if (child.nodeType === Node.TEXT_NODE) {
                // 텍스트 노드인 경우 글자별로 분리
                const text = child.textContent;
                for (let i = 0; i < text.length; i++) {
                    const char = text[i];
                    
                    if (char === ' ') {
                        // 공백 처리
                        html += '<span class="neon-wave-space"></span>';
                    } else if (char === '\n') {
                        // 줄바꿈 처리
                        html += '<span class="neon-wave-br"></span>';
                    } else if (char.trim() !== '') {
                        // 일반 글자 처리
                        const delay = currentLetterIndex * 0.1;
                        html += `<span class="neon-wave-letter" style="animation-delay: ${delay}s, ${delay}s;">${char}</span>`;
                        currentLetterIndex++;
                    }
                }
            } else if (child.nodeType === Node.ELEMENT_NODE) {
                // HTML 요소인 경우
                if (child.tagName.toLowerCase() === 'br') {
                    // <br> 태그 처리
                    html += '<span class="neon-wave-br"></span>';
                } else {
                    // 다른 HTML 요소는 재귀적으로 처리
                    const processed = this.processNode(child, currentLetterIndex);
                    html += `<${child.tagName.toLowerCase()}>${processed.html}</${child.tagName.toLowerCase()}>`;
                    currentLetterIndex = processed.letterIndex;
                }
            }
        }

        return {
            html: html,
            letterIndex: currentLetterIndex
        };
    }

    // 애니메이션 재시작
    restart() {
        this.splitTextToLetters();
    }

    // 원본 텍스트로 복원
    restore() {
        this.element.innerHTML = this.originalText;
    }
}

// DOM이 로드된 후 자동으로 실행
document.addEventListener('DOMContentLoaded', function() {
    // contact-headline__title에 네온 웨이브 효과 적용
    const neonWaveText = new NeonWaveText('.contact-headline__title');
    
    // 전역에서 접근 가능하도록 window 객체에 추가 (디버깅용)
    window.neonWaveText = neonWaveText;
});

// ES 모듈로 내보내기
export default NeonWaveText;