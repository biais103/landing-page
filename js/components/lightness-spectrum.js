// Lightness Spectrum Generator Component
// HEX 색상을 입력받아 5%~95% 명도 범위의 동적 스펙트럼 생성

class LightnessSpectrum {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentColor = '#003962'; // 기본 색상
        this.init();
    }

    // 컴포넌트 초기화
    init() {
        this.createHTML();
        this.bindEvents();
        this.generateSpectrum(this.currentColor);
    }

    // HTML 구조 생성
    createHTML() {
        this.container.innerHTML = `
            <div class="lightness-spectrum">
                <h2 class="spectrum-title">동적 명도 스펙트럼 생성기</h2>
                
                <div class="color-input-section">
                    <div class="input-group">
                        <label for="hex-input">HEX 색상 코드:</label>
                        <input type="text" id="hex-input" class="hex-input" value="${this.currentColor}" placeholder="#003962">
                    </div>
                    
                    <div class="input-group">
                        <label for="color-picker">컬러 피커:</label>
                        <input type="color" id="color-picker" class="color-picker" value="${this.currentColor}">
                    </div>
                </div>

                <div class="current-color-info">
                    <div class="current-color-preview"></div>
                    <div class="current-color-details">
                        <span class="current-hex">${this.currentColor}</span>
                        <span class="current-lightness">명도: 0%</span>
                    </div>
                </div>

                <div class="spectrum-container">
                    <h3>명도 스펙트럼 (5% ~ 95%)</h3>
                    <div class="spectrum-grid" id="spectrum-grid">
                        <!-- 스펙트럼 색상들이 여기에 동적으로 생성됩니다 -->
                    </div>
                </div>
            </div>
        `;
    }

    // 이벤트 바인딩
    bindEvents() {
        const hexInput = this.container.querySelector('#hex-input');
        const colorPicker = this.container.querySelector('#color-picker');

        // HEX 입력 필드 변경
        hexInput.addEventListener('input', (e) => {
            const hexValue = e.target.value;
            if (this.isValidHex(hexValue)) {
                this.currentColor = hexValue;
                colorPicker.value = hexValue;
                this.generateSpectrum(hexValue);
            }
        });

        // 컬러 피커 변경
        colorPicker.addEventListener('input', (e) => {
            this.currentColor = e.target.value;
            hexInput.value = e.target.value;
            this.generateSpectrum(e.target.value);
        });
    }

    // HEX 색상 유효성 검사
    isValidHex(hex) {
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
    }

    // HEX를 HSL로 변환
    hexToHsl(hex) {
        // HEX를 RGB로 변환
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l;

        l = (max + min) / 2;

        if (max === min) {
            h = s = 0; // 무채색
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    }

    // HSL을 HEX로 변환
    hslToHex(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;

        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };

        let r, g, b;

        if (s === 0) {
            r = g = b = l; // 무채색
        } else {
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        const toHex = (c) => {
            const hex = Math.round(c * 255).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };

        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }

    // 동적 명도 스펙트럼 생성
    generateLightnessSteps(currentLightness) {
        const steps = [];
        const minL = 5;
        const maxL = 95;
        
        // 기준 명도를 포함한 9-11단계 생성
        if (currentLightness <= 15) {
            // 낮은 명도 (9단계)
            steps.push(5, 10, 15, currentLightness, 25, 40, 60, 80, 95);
        } else if (currentLightness <= 30) {
            // 중간-낮은 명도 (10단계)
            steps.push(5, 10, 15, 25, currentLightness, 40, 55, 70, 85, 95);
        } else if (currentLightness <= 60) {
            // 중간 명도 (10단계)
            steps.push(5, 15, 25, 35, 45, currentLightness, 70, 80, 90, 95);
        } else if (currentLightness <= 80) {
            // 중간-높은 명도 (11단계)
            steps.push(5, 15, 25, 35, 45, 55, 65, currentLightness, 85, 90, 95);
        } else {
            // 높은 명도 (9단계)
            steps.push(5, 20, 35, 50, 65, currentLightness, 85, 90, 95);
        }

        // 중복 제거 및 정렬
        return [...new Set(steps)].sort((a, b) => a - b);
    }

    // 스펙트럼 생성
    generateSpectrum(hexColor) {
        const hsl = this.hexToHsl(hexColor);
        const lightnessSteps = this.generateLightnessSteps(hsl.l);
        
        // 현재 색상 정보 업데이트
        this.updateCurrentColorInfo(hexColor, hsl.l);
        
        // 스펙트럼 그리드 생성
        const spectrumGrid = this.container.querySelector('#spectrum-grid');
        spectrumGrid.innerHTML = '';

        lightnessSteps.forEach(lightness => {
            const spectrumHex = this.hslToHex(hsl.h, hsl.s, lightness);
            const isCurrentColor = lightness === hsl.l;
            
            const colorItem = document.createElement('div');
            colorItem.className = `spectrum-item ${isCurrentColor ? 'current' : ''}`;
            colorItem.innerHTML = `
                <div class="color-swatch" style="background-color: ${spectrumHex}"></div>
                <div class="color-info">
                    <span class="lightness-value">${lightness}%</span>
                    <span class="hex-value">${spectrumHex.toUpperCase()}</span>
                    ${isCurrentColor ? '<span class="current-indicator">기준</span>' : ''}
                </div>
            `;
            
            spectrumGrid.appendChild(colorItem);
        });
    }

    // 현재 색상 정보 업데이트
    updateCurrentColorInfo(hexColor, lightness) {
        const preview = this.container.querySelector('.current-color-preview');
        const hexSpan = this.container.querySelector('.current-hex');
        const lightnessSpan = this.container.querySelector('.current-lightness');
        
        preview.style.backgroundColor = hexColor;
        hexSpan.textContent = hexColor.toUpperCase();
        lightnessSpan.textContent = `명도: ${lightness}%`;
    }

    // 외부에서 색상 설정
    setColor(hexColor) {
        if (this.isValidHex(hexColor)) {
            this.currentColor = hexColor;
            this.container.querySelector('#hex-input').value = hexColor;
            this.container.querySelector('#color-picker').value = hexColor;
            this.generateSpectrum(hexColor);
        }
    }

    // 현재 스펙트럼 데이터 반환
    getSpectrumData() {
        const hsl = this.hexToHsl(this.currentColor);
        const lightnessSteps = this.generateLightnessSteps(hsl.l);
        
        return lightnessSteps.map(lightness => ({
            lightness,
            hex: this.hslToHex(hsl.h, hsl.s, lightness),
            isCurrent: lightness === hsl.l
        }));
    }
}

// 전역에서 사용할 수 있도록 export
window.LightnessSpectrum = LightnessSpectrum; 