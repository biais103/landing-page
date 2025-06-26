// 회전 오버레이 관리
document.addEventListener('DOMContentLoaded', function() {
    const rotateOverlay = document.getElementById('rotate-overlay');
    
    if (!rotateOverlay) return;

    // 화면 회전 감지 및 오버레이 표시/숨김
    function handleOrientationChange() {
        // 약간의 지연을 두어 회전이 완료된 후 확인
        setTimeout(() => {
            const isMobile = window.innerWidth <= 768;
            const isPortrait = window.innerHeight > window.innerWidth;
            
            if (isMobile && isPortrait) {
                // 모바일 세로모드: 오버레이 표시
                rotateOverlay.style.display = 'flex';
                setTimeout(() => {
                    rotateOverlay.classList.add('active');
                }, 10);
            } else {
                // 가로모드 또는 데스크톱: 오버레이 숨김
                rotateOverlay.classList.remove('active');
                setTimeout(() => {
                    if (!rotateOverlay.classList.contains('active')) {
                        rotateOverlay.style.display = 'none';
                    }
                }, 300);
            }
        }, 100);
    }

    // 초기 로드 시 확인
    handleOrientationChange();

    // 화면 회전 이벤트 리스너
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);
}); 