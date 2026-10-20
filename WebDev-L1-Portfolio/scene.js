import * as THREE from 'three';
const canvas = document.getElementById('bg');
try {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
  camera.position.z = 7;

  // particle field
  const N = innerWidth < 700 ? 500 : 1100;
  const pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 22;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 22;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 14;
  }
  const pg = new THREE.BufferGeometry();
  pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const points = new THREE.Points(pg, new THREE.PointsMaterial({ size: 0.035, color: 0x9d8bff, transparent: true, opacity: 0.75 }));
  scene.add(points);

  // wireframe knot
  const knot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1.5, 0.42, 160, 18),
    new THREE.MeshBasicMaterial({ color: 0x22d3ee, wireframe: true, transparent: true, opacity: 0.22 })
  );
  scene.add(knot);

  const group = new THREE.Group();
  group.add(knot, points);
  scene.add(group);

  let mx = 0, my = 0, sy = 0;
  addEventListener('pointermove', e => { mx = (e.clientX / innerWidth - 0.5); my = (e.clientY / innerHeight - 0.5); });
  addEventListener('scroll', () => { sy = scrollY; }, { passive: true });

  function resize() {
    const w = innerWidth, h = innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    knot.position.x = w < 900 ? 0 : 2.6;
    knot.position.y = w < 900 ? 1.4 : 0;
    knot.scale.setScalar(w < 900 ? 0.7 : 1);
  }
  addEventListener('resize', resize); resize();

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clock = new THREE.Clock();
  (function tick() {
    const t = clock.getElapsedTime();
    if (!reduce) {
      knot.rotation.x = t * 0.15 + my * 0.8;
      knot.rotation.y = t * 0.2 + mx * 0.8;
      points.rotation.y = t * 0.02 + mx * 0.15;
      points.rotation.x = my * 0.1;
    }
    group.position.y = sy * 0.0016;
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  })();
} catch (e) {
  canvas.remove();
}
