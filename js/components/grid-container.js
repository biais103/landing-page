// Grid Container Component - 동적 격자 생성 및 관리

class GridContainer {
    constructor() {
        this.gridContainer = null;
        this.gridCells = [];
        this.animatingCells = new Set(); // 현재 애니메이션 중인 셀들을 추적
        this.setupResizeListener(); // 창 크기 변경 감지
    }

    // 뷰포트에 맞는 격자 크기 계산
    calculateGridDimensions() {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // 정사각형 셀 크기를 먼저 결정 (적당한 크기로)
        const desiredCellSize = 24; // 24px 기준 셀 크기
        
        // 화면을 꽉 채우기 위한 격자 수 계산
        const cols = Math.ceil(viewportWidth / desiredCellSize);
        const rows = Math.ceil(viewportHeight / desiredCellSize);
        
        // 실제 셀 크기를 화면에 맞춰 조정 (정사각형 유지)
        const actualCellWidth = viewportWidth / cols;
        const actualCellHeight = viewportHeight / rows;
        
        // 정사각형을 유지하기 위해 더 작은 값 사용
        const cellSize = Math.min(actualCellWidth, actualCellHeight);
        
        // 최종 격자 수 재계산 (화면을 꽉 채우도록)
        const finalCols = Math.ceil(viewportWidth / cellSize);
        const finalRows = Math.ceil(viewportHeight / cellSize);
        
        console.log(`격자 계산: ${finalCols}x${finalRows} (총 ${finalCols * finalRows}개 셀)`);
        console.log(`셀 크기: ${cellSize.toFixed(2)}x${cellSize.toFixed(2)}px`);
        console.log(`뷰포트: ${viewportWidth}x${viewportHeight}px`);
        
        return {
            cols: finalCols,
            rows: finalRows,
            totalCells: finalCols * finalRows,
            cellWidth: cellSize,
            cellHeight: cellSize
        };
    }

    // CSS 그리드 설정
    setupGridCSS(dimensions) {
        const { cols, rows, cellWidth, cellHeight } = dimensions;
        
        // 격자가 화면을 완전히 채우도록 설정
        this.gridContainer.style.width = '100vw';
        this.gridContainer.style.height = '100vh';
        this.gridContainer.style.gridTemplateColumns = `repeat(${cols}, ${cellWidth}px)`;
        this.gridContainer.style.gridTemplateRows = `repeat(${rows}, ${cellHeight}px)`;
    }

    // 창 크기 변경 감지 설정
    setupResizeListener() {
        // 창 크기 변경 시 격자 재생성
        window.addEventListener('resize', () => {
            if (this.gridContainer && this.gridContainer.parentElement) {
                this.createGrid(this.gridContainer.parentElement);
            }
        });
    }

    // 격자 생성
    createGrid(targetElement) {
        if (!targetElement) {
            console.error('격자를 생성할 대상 요소가 없습니다.');
            return null;
        }

        // 기존 격자가 있다면 제거
        this.removeGrid(targetElement);

        // 격자 크기 계산
        const dimensions = this.calculateGridDimensions();

        // 격자 컨테이너 생성
        this.gridContainer = document.createElement('div');
        this.gridContainer.className = 'grid-container';
        
        // CSS 그리드 설정
        this.setupGridCSS(dimensions);

        // 격자 셀 생성
        for (let i = 0; i < dimensions.totalCells; i++) {
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
        gridCell.addEventListener('mouseenter', () => {
            this.startHoverAnimation(gridCell);
        });

        gridCell.addEventListener('mouseleave', () => {
            this.scheduleColorReset(gridCell);
        });
    }

    // 호버 애니메이션 시작
    startHoverAnimation(gridCell) {
        // 이미 애니메이션 중이면 중단하고 다시 시작
        if (this.animatingCells.has(gridCell)) {
            gridCell.classList.remove('hover-animating');
            this.animatingCells.delete(gridCell);
            // 짧은 지연 후 다시 시작하여 애니메이션 리셋
            setTimeout(() => {
                this.startHoverAnimation(gridCell);
            }, 10);
            return;
        }

        // 호버 애니메이션 시작
        this.animatingCells.add(gridCell);
        gridCell.classList.add('hover-animating');

        // 3초 후 애니메이션 완료
        setTimeout(() => {
            this.animatingCells.delete(gridCell);
            gridCell.classList.remove('hover-animating');
        }, 3000);
    }

    // 색상 리셋 스케줄링
    scheduleColorReset(gridCell) {
        // 애니메이션이 진행 중인지 확인
        if (this.animatingCells.has(gridCell)) {
            // 애니메이션이 완료될 때까지 기다림 (3초)
            const checkAnimation = () => {
                if (!this.animatingCells.has(gridCell)) {
                    // 애니메이션 완료 후 원래 색상으로 복원
                    gridCell.style.backgroundColor = '';
                } else {
                    // 아직 애니메이션 중이면 100ms 후 다시 확인
                    setTimeout(checkAnimation, 100);
                }
            };
            checkAnimation();
        } else {
            // 애니메이션이 없으면 즉시 복원
            gridCell.style.backgroundColor = '';
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

    // 미리 정의된 색상 팔레트에서 랜덤 색상 생성
    generateRandomColor() {
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
            '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
            '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2'
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

    // 모든 셀 색상 초기화 (기본 색상으로 복원)
    clearColors() {
        this.gridCells.forEach(cell => {
            cell.classList.remove('hover-animating');
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
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GridContainer;
} else {
    window.GridContainer = GridContainer;
}

// 기본 인스턴스 생성 및 전역 변수로 설정
window.gridContainer = new GridContainer(); 