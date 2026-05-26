'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function AnimatedScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let particles: THREE.Points;
    let blob: THREE.Mesh;
    let blob2: THREE.Mesh;
    let point: THREE.PointLight;
    let frameId: number;
    let initialized = false;

    const init = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      if (width === 0 || height === 0) return;

      initialized = true;

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 1000);
      camera.position.z = 45;

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height);
      mount.appendChild(renderer.domElement);

      const ambient = new THREE.AmbientLight(0x0e1017, 1.2);
      point = new THREE.PointLight(0xe5c158, 4.0, 300);
      point.position.set(0, 0, 40);
      scene.add(ambient, point);

      const particleCount = 2200;
      const positions = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * 150;
        positions[i3 + 1] = (Math.random() - 0.5) * 100;
        positions[i3 + 2] = (Math.random() - 0.5) * 100;
      }

      const particlesGeometry = new THREE.BufferGeometry();
      particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const particlesMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.08, transparent: true, opacity: 0.6 });
      particles = new THREE.Points(particlesGeometry, particlesMaterial);
      scene.add(particles);

      const blobGeometry = new THREE.IcosahedronGeometry(7, 15);
      const blobMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x111112,
        emissive: 0x1b1407,
        emissiveIntensity: 0.4,
        roughness: 0.08,
        metalness: 0.95,
        transparent: true,
        opacity: 0.9,
        transmission: 0.9,
        thickness: 1.5,
      });
      blob = new THREE.Mesh(blobGeometry, blobMaterial);
      blob.position.set(-12, 4, -12);
      scene.add(blob);

      blob2 = blob.clone();
      blob2.position.set(18, -8, -25);
      blob2.scale.set(0.65, 0.65, 0.65);
      scene.add(blob2);

      animate();
    };

    const mouse = { x: 0, y: 0 };
    const onMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove);

    const onResize = () => {
      if (!initialized) {
        init();
        return;
      }
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      if (width === 0 || height === 0) return;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const resizeObserver = new ResizeObserver(() => {
      onResize();
    });
    resizeObserver.observe(mount);

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      if (!initialized) return;

      particles.rotation.y += 0.0007;
      particles.rotation.x += 0.0002;

      blob.rotation.x += 0.002;
      blob.rotation.y += 0.003;
      blob.position.y = Math.sin(Date.now() * 0.001) * 1.8;

      blob2.rotation.x -= 0.0018;
      blob2.rotation.y += 0.0024;
      blob2.position.y = Math.cos(Date.now() * 0.0012) * 2.2;

      camera.position.x += (mouse.x * 8 - camera.position.x) * 0.02;
      camera.position.y += (mouse.y * 5 - camera.position.y) * 0.02;

      point.position.x = camera.position.x * 2.4;
      point.position.y = camera.position.y * 2.4;

      renderer.render(scene, camera);
    };

    init();

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      window.removeEventListener('mousemove', onMouseMove);
      if (initialized && renderer) {
        mount.removeChild(renderer.domElement);
        scene.clear();
        renderer.dispose();
      }
    };
  }, []);

  return <div ref={mountRef} className="scene" />;
}
