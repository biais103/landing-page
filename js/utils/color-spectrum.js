// Color Spectrum Utility - 헥스 코드 기준 명도 계산 및 CSS 변수 설정

class ColorSpectrum {
    // HEX를 HSL로 변환
    hexToHsl(hex) {
        // # 제거
        hex = hex.replace('#', '');
        
        // RGB 값 추출
        const r = parseInt(hex.slice(0, 2), 16) / 255;
        const g = parseInt(hex.slice(2, 4), 16) / 255;
        const b = parseInt(hex.slice(4, 6), 16) / 255;

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

    // 메인 함수: 헥스 코드를 받아서 명도 스펙트럼 계산 및 CSS 변수 설정
    setColorSpectrum(hexColor) {
        // 입력값 검증
        if (!hexColor || typeof hexColor !== 'string') {
            console.error('❌ 오류: 올바른 헥스 코드를 입력해주세요. (예: #FF0000)');
            return false;
        }

        // # 없으면 추가
        if (!hexColor.startsWith('#')) {
            hexColor = '#' + hexColor;
        }

        // 헥스 코드 형식 검증
        const hexPattern = /^#[0-9A-Fa-f]{6}$/;
        if (!hexPattern.test(hexColor)) {
            console.error('❌ 오류: 올바른 6자리 헥스 코드를 입력해주세요. (예: #FF0000)');
            return false;
        }

        try {
            // HSL로 변환
            const hsl = this.hexToHsl(hexColor);
            
            // 80% 명도와 5% 명도 계산 (색조와 채도는 동일하게 유지)
            const lightColor = this.hslToHex(hsl.h, hsl.s, 80); // 80% 명도
            const darkColor = this.hslToHex(hsl.h, hsl.s, 20);   // 20% 명도

            // CSS 변수에 설정
            const root = document.documentElement;
            root.style.setProperty('--spectrum-80', lightColor);
            root.style.setProperty('--spectrum-20', darkColor);
            root.style.setProperty('--spectrum-mid', hexColor);

            // 성공 메시지
            console.log('✅ 색상 스펙트럼이 성공적으로 설정되었습니다!');
            console.log(`🎨 기준 색상 (--spectrum-mid): ${hexColor}`);
            console.log(`☀️ 밝은 색상 (--spectrum-80): ${lightColor}`);
            console.log(`🌙 어두운 색상 (--spectrum-20): ${darkColor}`);
            console.log(`📊 원본 HSL: H=${hsl.h}°, S=${hsl.s}%, L=${hsl.l}%`);

            return {
                original: hexColor,
                light: lightColor,
                dark: darkColor,
                hsl: hsl
            };

        } catch (error) {
            console.error('❌ 색상 계산 중 오류가 발생했습니다:', error.message);
            return false;
        }
    }

    // 현재 설정된 CSS 변수들 확인
    getCurrentSpectrum() {
        const root = document.documentElement;
        const style = getComputedStyle(root);
        
        const spectrum = {
            mid: style.getPropertyValue('--spectrum-mid').trim(),
            light: style.getPropertyValue('--spectrum-80').trim(),
            dark: style.getPropertyValue('--spectrum-20').trim()
        };

        console.log('📋 현재 설정된 색상 스펙트럼:');
        console.log(`🎨 기준 색상: ${spectrum.mid}`);
        console.log(`☀️ 밝은 색상: ${spectrum.light}`);
        console.log(`🌙 어두운 색상: ${spectrum.dark}`);

        return spectrum;
    }
}

// 전역에서 사용할 수 있도록 설정
window.ColorSpectrum = ColorSpectrum;
window.colorSpectrum = new ColorSpectrum();

// 사용 예시를 콘솔에 출력
console.log('🎨 Color Spectrum 유틸리티가 로드되었습니다!');
console.log('📝 사용 방법:');
console.log('   colorSpectrum.setColorSpectrum("#FF0000")  // 빨간색 기준으로 설정');
console.log('   colorSpectrum.getCurrentSpectrum()        // 현재 설정 확인');
console.log('');
console.log('💡 터미널에서 사용하려면:');
console.log('   node js/utils/color-spectrum-cli.js "#FF0000"'); 