// Grid Container Component - 16x16 격자 생성 및 관리

class GridContainer {
    constructor() {
        this.gridContainer = null;
        this.gridCells = [];
        this.animatingCells = new Set(); // 현재 애니메이션 중인 셀들을 추적
        this.blueSpectrum = this.generateBlueSpectrum(); // --color-blue 기준 명도 스펙트럼
        this.setupSpectrumVariables(); // CSS 커스텀 속성 설정
    }

    // --color-blue (#003962) 기준 명도 스펙트럼 생성
    generateBlueSpectrum() {
        const baseColor = '#003962'; // --color-blue
        const hsl = this.hexToHsl(baseColor);
        const inputLightness = hsl.l; // 실제 명도 (약 19%)
        
        // 19단계 고정 명도 범위 (역순)
        const lightnessSteps = [95, 90, 85, 80, 75, 70, 65, 60, 55, 50, 45, 40, 35, 30, 25, 20, 15, 10, 5];
        
        // 입력 색상의 명도와 가장 가까운 단계 찾기
        const closestStep = lightnessSteps.reduce((closest, current) => {
            return Math.abs(current - inputLightness) < Math.abs(closest - inputLightness) ? current : closest;
        });
        
        console.log(`입력 색상 명도: ${inputLightness}%, 가장 가까운 단계: ${closestStep}%`);
        
        // 전체 19단계 스펙트럼 생성 (HSL의 H, S는 기준 색상과 동일)
        return lightnessSteps.map(lightness => this.hslToHex(hsl.h, hsl.s, lightness));
    }

    // HEX를 HSL로 변환
    hexToHsl(hex) {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;

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

    // CSS 커스텀 속성으로 스펙트럼 색상 설정
    setupSpectrumVariables() {
        const root = document.documentElement;
        
        // 19단계 색상을 CSS 변수로 설정
        this.blueSpectrum.forEach((color, index) => {
            root.style.setProperty(`--spectrum-${index + 1}`, color);
        });
        
        console.log('명도 스펙트럼 색상들:', this.blueSpectrum);
    }

    // 격자 생성
    createGrid(targetElement) {
        if (!targetElement) {
            console.error('격자를 생성할 대상 요소가 없습니다.');
            return null;
        }

        // 기존 격자가 있다면 제거
        this.removeGrid(targetElement);

        // 격자 컨테이너 생성
        this.gridContainer = document.createElement('div');
        this.gridContainer.className = 'grid-container';

        // 16x16 = 256개 격자 셀 생성
        for (let i = 0; i < 256; i++) {
            const gridCell = document.createElement('div');
            gridCell.className = 'grid-cell';
            gridCell.dataset.index = i;
            
            // 마우스 호버 이벤트 추가
            this.addHoverEffect(gridCell);
            
            this.gridContainer.appendChild(gridCell);
            this.gridCells.push(gridCell);
        }

        // 대상 요소에 격자 추가
        targetElement.appendChild(this.gridContainer);
        
        console.log('격자가 성공적으로 생성되었습니다.');
        return this.gridContainer;
    }

    // 마우스 호버 효과 추가
    addHoverEffect(gridCell) {
        let isHovering = false;
        
        gridCell.addEventListener('mouseenter', () => {
            isHovering = true;
            this.startColorAnimation(gridCell, isHovering);
        });

        gridCell.addEventListener('mouseleave', () => {
            isHovering = false;
            // 애니메이션이 완료될 때까지 기다린 후 원래 색상으로 복원
            this.scheduleColorReset(gridCell);
        });
    }

    // 색상 애니메이션 시작
    startColorAnimation(gridCell) {
        // 이미 애니메이션 중이면 중단하고 다시 시작
        if (this.animatingCells.has(gridCell)) {
            gridCell.classList.remove('animating');
            this.animatingCells.delete(gridCell);
            // 짧은 지연 후 다시 시작하여 애니메이션 리셋
            setTimeout(() => {
                this.startColorAnimation(gridCell);
            }, 10);
            return;
        }

        // 애니메이션 시작
        this.animatingCells.add(gridCell);
        gridCell.classList.add('animating');

        // 2초 후 첫 번째 애니메이션 완료 처리
        setTimeout(() => {
            // 2단계: 명도 스펙트럼 애니메이션 시작
            gridCell.classList.remove('animating');
            gridCell.classList.add('spectrum-animating');
            
            // 3초 후 전체 애니메이션 완료
            setTimeout(() => {
                this.animatingCells.delete(gridCell);
                gridCell.classList.remove('spectrum-animating');
            }, 3000);
        }, 2000);
    }

    // 색상 리셋 스케줄링
    scheduleColorReset(gridCell) {
        // 애니메이션이 진행 중인지 확인
        if (this.animatingCells.has(gridCell)) {
            // 전체 애니메이션(1단계 + 2단계)이 완료될 때까지 기다림 (총 5초)
            const checkAnimation = () => {
                if (!this.animatingCells.has(gridCell)) {
                    // 애니메이션 완료 후 원래 색상으로 복원
                    gridCell.style.backgroundColor = '';
                    gridCell.style.transform = '';
                } else {
                    // 아직 애니메이션 중이면 100ms 후 다시 확인
                    setTimeout(checkAnimation, 100);
                }
            };
            checkAnimation();
        } else {
            // 애니메이션이 없으면 즉시 복원
            gridCell.style.backgroundColor = '';
            gridCell.style.transform = '';
        }
    }

    // 기존 격자 제거
    removeGrid(targetElement) {
        const existingGrid = targetElement.querySelector('.grid-container');
        if (existingGrid) {
            existingGrid.remove();
        }
        this.gridContainer = null;
        this.gridCells = [];
        this.animatingCells.clear();
    }

    // 랜덤 색상 생성
    generateRandomColor() {
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
            '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
            '#F8C471', '#82E0AA', '#F1948A', '#85929E', '#D2B4DE'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // HSL 기반 랜덤 색상 생성
    generateRandomHSLColor() {
        const hue = Math.floor(Math.random() * 360);
        const saturation = Math.floor(Math.random() * 50) + 50; // 50-100%
        const lightness = Math.floor(Math.random() * 30) + 40;  // 40-70%
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }

    // RGB 기반 랜덤 색상 생성
    generateRandomRGBColor() {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgb(${r}, ${g}, ${b})`;
    }

    // 모든 격자 셀에 랜덤 색상 적용
    applyRandomColors(colorType = 'preset') {
        if (!this.gridCells.length) {
            console.error('격자 셀이 생성되지 않았습니다.');
            return;
        }

        this.gridCells.forEach(cell => {
            let randomColor;
            
            switch(colorType) {
                case 'hsl':
                    randomColor = this.generateRandomHSLColor();
                    break;
                case 'rgb':
                    randomColor = this.generateRandomRGBColor();
                    break;
                default:
                    randomColor = this.generateRandomColor();
            }
            
            cell.style.backgroundColor = randomColor;
        });

        console.log(`${colorType} 방식으로 랜덤 색상이 적용되었습니다.`);
    }

    // 특정 셀에 색상 적용
    setCellColor(index, color) {
        if (this.gridCells[index]) {
            this.gridCells[index].style.backgroundColor = color;
        }
    }

    // 모든 셀 색상 초기화 (기본 blue로 복원)
    clearColors() {
        this.gridCells.forEach(cell => {
            cell.classList.remove('animating');
            cell.style.backgroundColor = '';
        });
        this.animatingCells.clear();
    }

    // 격자 셀들 반환
    getGridCells() {
        return this.gridCells;
    }

    // 격자 컨테이너 반환
    getGridContainer() {
        return this.gridContainer;
    }

    // 특정 인덱스의 격자 셀 반환
    getGridCell(index) {
        return this.gridCells[index] || null;
    }
}

// 전역에서 사용할 수 있도록 export
window.GridContainer = GridContainer;

// 기본 인스턴스 생성 및 전역 변수로 설정
window.gridContainer = new GridContainer(); 