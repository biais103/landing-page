#!/usr/bin/env node

// Color Spectrum CLI - 터미널에서 실행 가능한 색상 스펙트럼 계산기

class ColorSpectrumCLI {
    // HEX를 HSL로 변환
    hexToHsl(hex) {
        hex = hex.replace('#', '');
        
        const r = parseInt(hex.slice(0, 2), 16) / 255;
        const g = parseInt(hex.slice(2, 4), 16) / 255;
        const b = parseInt(hex.slice(4, 6), 16) / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l;

        l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
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
            r = g = b = l;
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

    // 메인 함수: 헥스 코드를 받아서 명도 스펙트럼 계산
    calculateSpectrum(hexColor) {
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
            
            // 80% 명도와 20% 명도 계산
            const lightColor = this.hslToHex(hsl.h, hsl.s, 80);
            const darkColor = this.hslToHex(hsl.h, hsl.s, 20);

            // 결과 출력
            console.log('');
            console.log('🎨 ===============================');
            console.log('   색상 스펙트럼 계산 결과');
            console.log('🎨 ===============================');
            console.log('');
            console.log(`🎯 기준 색상: ${hexColor}`);
            console.log(`☀️  80% 명도: ${lightColor}`);
            console.log(`🌙  20% 명도:  ${darkColor}`);
            console.log('');
            console.log(`📊 HSL 정보: H=${hsl.h}°, S=${hsl.s}%, L=${hsl.l}%`);
            console.log('');
            console.log('📋 CSS 변수 코드:');
            console.log(`   --spectrum-mid: ${hexColor};`);
            console.log(`   --spectrum-80:  ${lightColor};`);
            console.log(`   --spectrum-20:   ${darkColor};`);
            console.log('');

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

    // 도움말 출력
    showHelp() {
        console.log('');
        console.log('🎨 Color Spectrum Calculator');
        console.log('');
        console.log('📝 사용법:');
        console.log('   node js/utils/color-spectrum-cli.js <헥스코드>');
        console.log('');
        console.log('💡 예시:');
        console.log('   node js/utils/color-spectrum-cli.js "#FF0000"');
        console.log('   node js/utils/color-spectrum-cli.js "#00FF00"');
        console.log('   node js/utils/color-spectrum-cli.js "FF0000"   (# 없어도 됨)');
        console.log('');
        console.log('📤 결과:');
        console.log('   - 입력한 색상을 기준으로');
        console.log('   - 80% 명도 (밝은 색상)');
        console.log('   - 20% 명도 (어두운 색상)');
        console.log('   - CSS 변수 코드를 출력합니다');
        console.log('');
    }
}

// CLI 실행 부분
const cli = new ColorSpectrumCLI();

// 명령행 인수 확인
const args = process.argv.slice(2);

if (args.length === 0) {
    console.log('❌ 헥스 코드를 입력해주세요!');
    cli.showHelp();
    process.exit(1);
}

if (args[0] === '--help' || args[0] === '-h') {
    cli.showHelp();
    process.exit(0);
}

// 색상 스펙트럼 계산 실행
const hexColor = args[0];
const result = cli.calculateSpectrum(hexColor);

if (!result) {
    console.log('');
    console.log('💡 도움말을 보려면: node js/utils/color-spectrum-cli.js --help');
    process.exit(1);
} 