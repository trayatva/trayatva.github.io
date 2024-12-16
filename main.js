// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Resize handling
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Balls array
const balls = [];
const ballCount = 50;
const ballRadius = 0.5;

// Random motion bounds
const bounds = 20;

// Cursor-following ball
const cursorBall = new THREE.Mesh(
    new THREE.SphereGeometry(ballRadius, 32, 32),
    new THREE.MeshStandardMaterial({ color: 0xff0000 })
);
scene.add(cursorBall);

// Generate random balls
for (let i = 0; i < ballCount; i++) {
    const ball = new THREE.Mesh(
        new THREE.SphereGeometry(ballRadius, 32, 32),
        new THREE.MeshStandardMaterial({ color: Math.random() * 0xffffff })
    );
    ball.position.set(
        (Math.random() - 0.5) * bounds * 2,
        (Math.random() - 0.5) * bounds * 2,
        (Math.random() - 0.5) * bounds * 2
    );
    balls.push({
        mesh: ball,
        velocity: new THREE.Vector3(
            (Math.random() - 0.5) * 0.1,
            (Math.random() - 0.5) * 0.1,
            (Math.random() - 0.5) * 0.1
        )
    });
    scene.add(ball);
}

// Light setup
const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1, 100);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

// Camera position
camera.position.z = 30;

// Mouse position tracking
const mouse = new THREE.Vector2();
window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Move cursor-following ball
    cursorBall.position.x = mouse.x * bounds;
    cursorBall.position.y = mouse.y * bounds;

    // Update random balls
    balls.forEach(({ mesh, velocity }) => {
        mesh.position.add(velocity);

        // Bounce off bounds
        if (mesh.position.x > bounds || mesh.position.x < -bounds) velocity.x = -velocity.x;
        if (mesh.position.y > bounds || mesh.position.y < -bounds) velocity.y = -velocity.y;
        if (mesh.position.z > bounds || mesh.position.z < -bounds) velocity.z = -velocity.z;
    });

    renderer.render(scene, camera);
}

animate();
