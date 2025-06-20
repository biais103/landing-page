/**
 * rotate_3d 컴포넌트 자바스크립트 (ES 모듈 버전)
 * Three.js를 사용하여 GLB 형식의 3D 모델 회전 기능 구현
 * Importmap을 사용하여 모듈 경로를 매핑합니다.
 */

// Importmap을 통해 매핑된 모듈 이름 사용
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// 전역 변수 선언
let scene, camera, renderer, object;
let isMouseDown = false;
let rotationSpeed = 0.005;
let lastMousePosition = { x: 0, y: 0 };
let targetZoom;

// DOM 로드 완료 시 초기화
document.addEventListener('DOMContentLoaded', init);

// 초기화 함수
function init() {
    console.log('3D 모델 뷰어 초기화 중...');
    
    // 모델 경로 (로컬 테스트용)
    const modelPath = './model-files/sheen-chair/sheen-chair.glb';
    console.log('로드할 모델 경로:', modelPath);
    
    initThreeJS();
    loadGLBModel(modelPath);
    addEventListeners();
    animate();
}

// Three.js 초기화
function initThreeJS() {
    // 컨테이너 요소 가져오기
    const container = document.getElementById('rotate-3d__model');
    
    // 씬 생성
    scene = new THREE.Scene();
    
    // 카메라 설정
    camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    targetZoom = camera.position.z;    // 여기에 targetZoom 초기화
    
    // 렌더러 설정
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0); // 배경 투명하게 설정
    container.appendChild(renderer.domElement);

    // 마우스 휠로 카메라 앞뒤 이동(줌 인/아웃) - 컨테이너에만 적용
    container.addEventListener(
        'wheel',
        function(event) {
        // 3D 모델 영역에서만 기본 스크롤 막기
        event.preventDefault();
    
        // 휠 민감도 조절용 상수
        const zoomSpeed = 0.01;
    
        // 목표 줌값 변경
        targetZoom += event.deltaY * zoomSpeed;
    
        // 너무 가까워지거나 멀어지는 거 방지 (2~20 사이로 고정)
        targetZoom = THREE.MathUtils.clamp(targetZoom, 2, 20);
        },
        { passive: false }  // passive: false를 명시해야 preventDefault가 동작합니다.
    );
  
    // 조명 추가
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // 보조 조명 추가 (반대편)
    const backLight = new THREE.DirectionalLight(0xffffff, 0.3);
    backLight.position.set(-1, -1, -1);
    scene.add(backLight);
    
    // 로딩 중 표시
    showLoadingIndicator(true);
}

// GLB 모델 로드
function loadGLBModel(modelPath) {
    // GLTFLoader 인스턴스 생성
    const loader = new GLTFLoader();
    
    loader.load(
        // 모델 경로
        modelPath,
        
        // 로드 성공 콜백
        function(gltf) {
            object = gltf.scene;
            console.log('모델 로드 성공!', object);
            
            // 모델 크기 자동 조정
            const box = new THREE.Box3().setFromObject(object);
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 4 / maxDim; // 뷰포트에 맞게 모델 크기 조정
            
            object.scale.set(scale, scale, scale);
            
            // 모델 위치 중앙 정렬
            const center = box.getCenter(new THREE.Vector3());
            object.position.x = -center.x * scale;
            object.position.y = -center.y * scale;
            object.position.z = -center.z * scale;
            
            scene.add(object);
            showLoadingIndicator(false);
        },
        
        // 로드 진행 콜백
        function(xhr) {
            const progress = Math.floor((xhr.loaded / xhr.total) * 100);
            updateLoadingProgress(progress);
        },
        
        // 에러 콜백
        function(error) {
            console.error('모델 로드 중 오류 발생:', error);
            console.error('시도한 모델 경로:', modelPath);
            showErrorMessage('모델을 로드하는 중 오류가 발생했습니다. 콘솔을 확인하세요.');
            
            // 경로 문제 디버깅을 위한 팁 제공
            console.log('경로 문제 해결 팁:');
            console.log('1. 브라우저 개발자 도구에서 네트워크 탭을 확인하세요.');
            console.log('2. 404 오류가 발생하면 경로가 잘못되었을 가능성이 높습니다.');
            console.log('3. 다음 경로들을 시도해보세요:');
            console.log('   - ../models/ToyCar/glTF-Binary/ToyCar.glb');
            console.log('   - ../../models/ToyCar/glTF-Binary/ToyCar.glb');
        }
    );
}

// 로딩 인디케이터 표시/숨김
function showLoadingIndicator(show) {
    const container = document.getElementById('rotate-3d__model');
    let loadingEl = document.getElementById('rotate_3d-loading');
    
    if (show) {
        if (!loadingEl) {
            loadingEl = document.createElement('div');
            loadingEl.id = 'rotate_3d-loading';
            loadingEl.className = 'rotate_3d-loading';
            loadingEl.innerHTML = '<div class="rotate_3d-spinner"></div><div class="rotate_3d-progress">로딩 중... 0%</div>';
            
            // 스타일 추가
            const style = document.createElement('style');
            style.textContent = `
                .rotate_3d-loading {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    background-color: rgba(0, 0, 0, 0.2);
                    z-index: 10;
                }
                .rotate_3d-spinner {
                    width: 40px;
                    height: 40px;
                    border: 4px solid rgba(255, 255, 255, 0.3);
                    border-top: 4px solid #ffffff;
                    border-radius: 50%;
                    animation: rotate_3d-spin 1s linear infinite;
                }
                .rotate_3d-progress {
                    margin-top: 10px;
                    color: white;
                    font-family: Arial, sans-serif;
                }
                @keyframes rotate_3d-spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
            
            container.appendChild(loadingEl);
        }
    } else {
        if (loadingEl) {
            loadingEl.remove();
        }
    }
}

// 로딩 진행률 업데이트
function updateLoadingProgress(xhr) {
    const loadingEl = document.getElementById('rotate_3d-loading');
    if (loadingEl) {
        const progressEl = loadingEl.querySelector('.rotate_3d-progress');
        
        let percent = 0;
        if (xhr.lengthComputable) {
            percent = Math.floor((xhr.loaded / xhr.total) * 100);
        } else if (typeof xhr === 'number') {
            percent = xhr;
        }
        
        if (progressEl) {
            progressEl.textContent = `로딩 중... ${percent}%`;
        }
    }
}

// 에러 메시지 표시
function showErrorMessage(message) {
    const container = document.getElementById('rotate-3d__model');
    showLoadingIndicator(false);
    
    const errorEl = document.createElement('div');
    errorEl.className = 'rotate_3d-error';
    errorEl.textContent = message;
    
    // 스타일 추가
    const style = document.createElement('style');
    style.textContent = `
        .rotate_3d-error {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 15px;
            background-color: rgba(255, 0, 0, 0.7);
            color: white;
            border-radius: 5px;
            font-family: Arial, sans-serif;
            text-align: center;
        }
    `;
    document.head.appendChild(style);
    
    container.appendChild(errorEl);
}

// 이벤트 리스너 추가
function addEventListeners() {
    const container = document.getElementById('rotate-3d__model');
    
    // 마우스 이벤트
    container.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mousemove', onMouseMove);
    
    // 터치 이벤트
    container.addEventListener('touchstart', onTouchStart);
    document.addEventListener('touchend', onTouchEnd);
    document.addEventListener('touchmove', onTouchMove);
    
    // 창 크기 변경 이벤트
    window.addEventListener('resize', onWindowResize);
}

// 마우스 이벤트 핸들러
function onMouseDown(event) {
    isMouseDown = true;
    lastMousePosition = {
        x: event.clientX,
        y: event.clientY
    };
}

function onMouseUp() {
    isMouseDown = false;
}

function onMouseMove(event) {
    if (isMouseDown && object) {
        const deltaX = event.clientX - lastMousePosition.x;
        const deltaY = event.clientY - lastMousePosition.y;
        
        object.rotation.y += deltaX * 0.01;
        object.rotation.x += deltaY * 0.01;
        
        lastMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
    }
}

// 터치 이벤트 핸들러
function onTouchStart(event) {
    if (event.touches.length === 1) {
        isMouseDown = true;
        lastMousePosition = {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY
        };
    }
}

function onTouchEnd() {
    isMouseDown = false;
}

function onTouchMove(event) {
    if (isMouseDown && object && event.touches.length === 1) {
        const deltaX = event.touches[0].clientX - lastMousePosition.x;
        const deltaY = event.touches[0].clientY - lastMousePosition.y;
        
        object.rotation.y += deltaX * 0.01;
        object.rotation.x += deltaY * 0.01;
        
        lastMousePosition = {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY
        };
        
        event.preventDefault();
    }
}

// 창 크기 변경 이벤트 핸들러
function onWindowResize() {
    const container = document.getElementById('rotate-3d__model');
    
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

// 애니메이션 루프
function animate() {
    requestAnimationFrame(animate);
    
    camera.position.z += (targetZoom - camera.position.z) * 0.1;

    // 자동 회전 (마우스 조작 없을 때)
    if (!isMouseDown && object) {
        object.rotation.y += rotationSpeed;
    }
    
    renderer.render(scene, camera);
}
