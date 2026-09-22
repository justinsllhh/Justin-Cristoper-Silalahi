// ============================================================
// POHON KEBAIKAN AJAIB (Tree of Virtue Interactive Visualizer)
// Menggambar pohon dinamis berbunga, berdaun, dan berbuah emas
// ============================================================

class TreeOfVirtue {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.animationId = null;
        this.treeState = {
            points: 0,
            stageIndex: 0,
            leafCount: 0,
            flowerCount: 0,
            fruitCount: 0
        };

        this.initResize();
        this.initParticles();
    }

    initResize() {
        const resize = () => {
            if (!this.canvas) return;
            const rect = this.canvas.parentElement.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            this.canvas.width = (rect.width || 600) * dpr;
            this.canvas.height = (rect.height || 450) * dpr;
            this.ctx.scale(dpr, dpr);
            this.draw();
        };

        window.addEventListener('resize', resize);
        setTimeout(resize, 100);
    }

    initParticles() {
        this.particles = [];
        for (let i = 0; i < 35; i++) {
            this.particles.push({
                x: Math.random() * 600,
                y: Math.random() * 450,
                size: Math.random() * 3 + 1,
                speedY: -(Math.random() * 0.6 + 0.2),
                speedX: (Math.random() - 0.5) * 0.4,
                alpha: Math.random() * 0.8 + 0.2,
                color: ['#FFD700', '#6EE7B7', '#F472B6', '#60A5FA'][Math.floor(Math.random() * 4)]
            });
        }
    }

    updateState(kindnessPoints) {
        this.treeState.points = kindnessPoints;
        const stages = window.GAME_DATA ? window.GAME_DATA.treeStages : [];
        let currentStage = 0;
        for (let i = stages.length - 1; i >= 0; i--) {
            if (kindnessPoints >= stages[i].minPoints) {
                currentStage = i;
                break;
            }
        }
        this.treeState.stageIndex = currentStage;
        this.treeState.leafCount = Math.min(60, Math.floor(kindnessPoints / 5) + 6);
        this.treeState.flowerCount = Math.min(25, Math.floor(kindnessPoints / 12));
        this.treeState.fruitCount = Math.min(15, Math.floor(kindnessPoints / 25));

        this.draw();
    }

    draw() {
        if (!this.canvas || !this.ctx) return;
        const width = this.canvas.width / (window.devicePixelRatio || 1);
        const height = this.canvas.height / (window.devicePixelRatio || 1);

        this.ctx.clearRect(0, 0, width, height);

        // 1. Gambar Langit Latar / Halo Bersinar
        const bgGrad = this.ctx.createRadialGradient(
            width / 2, height * 0.55, 30,
            width / 2, height * 0.55, width * 0.65
        );
        bgGrad.addColorStop(0, 'rgba(254, 240, 138, 0.35)');
        bgGrad.addColorStop(0.5, 'rgba(167, 243, 208, 0.15)');
        bgGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        this.ctx.fillStyle = bgGrad;
        this.ctx.fillRect(0, 0, width, height);

        // 2. Gambar Bukit / Tanah Subur
        const groundGrad = this.ctx.createLinearGradient(0, height - 70, 0, height);
        groundGrad.addColorStop(0, '#34D399');
        groundGrad.addColorStop(1, '#059669');
        this.ctx.beginPath();
        this.ctx.ellipse(width / 2, height + 40, width * 0.7, 100, 0, 0, Math.PI * 2);
        this.ctx.fillStyle = groundGrad;
        this.ctx.fill();

        // 3. Gambar Pohon Berdasarkan Tahapan
        const stage = this.treeState.stageIndex;
        const centerX = width / 2;
        const baseY = height - 55;

        this.drawTreeByStage(stage, centerX, baseY, height);

        // 4. Update dan Gambar Floating Magical Sparkles
        this.updateParticles(width, height);
    }

    drawTreeByStage(stage, cx, cy, h) {
        const ctx = this.ctx;

        if (stage === 0) {
            // Tunas Mungil 🌱
            ctx.fillStyle = '#10B981';
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.quadraticCurveTo(cx - 8, cy - 35, cx - 25, cy - 40);
            ctx.quadraticCurveTo(cx - 5, cy - 20, cx, cy);
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.quadraticCurveTo(cx + 8, cy - 45, cx + 25, cy - 48);
            ctx.quadraticCurveTo(cx + 5, cy - 22, cx, cy);
            ctx.fillStyle = '#34D399';
            ctx.fill();

            // Sinar kecil
            this.drawGlow(cx, cy - 30, 20, 'rgba(250, 204, 21, 0.4)');
            return;
        }

        // Batang Pohon
        const trunkWidth = 14 + stage * 6;
        const trunkHeight = 90 + stage * 28;

        const trunkGrad = ctx.createLinearGradient(cx - trunkWidth, cy - trunkHeight, cx + trunkWidth, cy);
        trunkGrad.addColorStop(0, '#854D0E');
        trunkGrad.addColorStop(0.5, '#713F12');
        trunkGrad.addColorStop(1, '#451A03');

        ctx.fillStyle = trunkGrad;
        ctx.beginPath();
        ctx.moveTo(cx - trunkWidth * 1.3, cy);
        ctx.quadraticCurveTo(cx - trunkWidth * 0.6, cy - trunkHeight * 0.5, cx - trunkWidth * 0.5, cy - trunkHeight);
        ctx.lineTo(cx + trunkWidth * 0.5, cy - trunkHeight);
        ctx.quadraticCurveTo(cx + trunkWidth * 0.6, cy - trunkHeight * 0.5, cx + trunkWidth * 1.3, cy);
        ctx.closePath();
        ctx.fill();

        // Ranting Cabang
        ctx.lineWidth = trunkWidth * 0.35;
        ctx.strokeStyle = '#713F12';
        ctx.lineCap = 'round';

        // Cabang Kiri
        ctx.beginPath();
        ctx.moveTo(cx, cy - trunkHeight * 0.6);
        ctx.quadraticCurveTo(cx - 45, cy - trunkHeight * 0.75, cx - 75, cy - trunkHeight * 0.95);
        ctx.stroke();

        // Cabang Kanan
        ctx.beginPath();
        ctx.moveTo(cx, cy - trunkHeight * 0.7);
        ctx.quadraticCurveTo(cx + 45, cy - trunkHeight * 0.85, cx + 80, cy - trunkHeight * 1.05);
        ctx.stroke();

        // Kanopi Daun Rindang (Tumpukan Lingkaran Cantik)
        const canopyY = cy - trunkHeight;
        const canopySize = 45 + stage * 18;

        const canopyColors = [
            '#10B981', '#059669', '#34D399', '#6EE7B7', '#A7F3D0'
        ];

        // Cluster daun tengah & samping
        const leafClusters = [
            { x: cx, y: canopyY - 20, r: canopySize * 1.1, c: canopyColors[0] },
            { x: cx - canopySize * 0.65, y: canopyY + 10, r: canopySize * 0.85, c: canopyColors[1] },
            { x: cx + canopySize * 0.65, y: canopyY + 5, r: canopySize * 0.88, c: canopyColors[2] },
            { x: cx - canopySize * 0.95, y: canopyY - 25, r: canopySize * 0.75, c: canopyColors[0] },
            { x: cx + canopySize * 0.95, y: canopyY - 30, r: canopySize * 0.78, c: canopyColors[1] },
            { x: cx, y: canopyY - canopySize * 0.75, r: canopySize * 0.9, c: canopyColors[2] },
            { x: cx - 35, y: canopyY - canopySize * 0.5, r: canopySize * 0.8, c: canopyColors[3] },
            { x: cx + 35, y: canopyY - canopySize * 0.5, r: canopySize * 0.8, c: canopyColors[3] }
        ];

        leafClusters.forEach((cl, idx) => {
            if (idx <= (stage + 1) * 2) {
                ctx.beginPath();
                ctx.arc(cl.x, cl.y, cl.r, 0, Math.PI * 2);
                ctx.fillStyle = cl.c;
                ctx.fill();
            }
        });

        // Gambar Bunga Kebaikan 🌸 jika Stage >= 2
        if (stage >= 2) {
            const flowerPositions = [
                { x: cx - 40, y: canopyY - 45 },
                { x: cx + 45, y: canopyY - 35 },
                { x: cx - 75, y: canopyY - 10 },
                { x: cx + 65, y: canopyY + 5 },
                { x: cx + 10, y: canopyY - 70 },
                { x: cx - 20, y: canopyY + 15 },
                { x: cx + 85, y: canopyY - 40 }
            ];

            const count = Math.min(flowerPositions.length, this.treeState.flowerCount);
            for (let i = 0; i < count; i++) {
                this.drawFlower(flowerPositions[i].x, flowerPositions[i].y);
            }
        }

        // Gambar Buah Emas Karakter 🍎✨ jika Stage >= 3
        if (stage >= 3) {
            const fruitPositions = [
                { x: cx - 30, y: canopyY - 15 },
                { x: cx + 35, y: canopyY - 60 },
                { x: cx - 55, y: canopyY - 65 },
                { x: cx + 25, y: canopyY + 10 },
                { x: cx - 90, y: canopyY - 30 },
                { x: cx + 90, y: canopyY - 15 },
                { x: cx, y: canopyY - 40 }
            ];

            const fCount = Math.min(fruitPositions.length, this.treeState.fruitCount);
            for (let i = 0; i < fCount; i++) {
                this.drawGoldenFruit(fruitPositions[i].x, fruitPositions[i].y, stage === 4);
            }
        }

        // Aura Mahkota Emas pada Stage 4 (Master Karakter)
        if (stage === 4) {
            this.drawGlow(cx, canopyY - 50, 140, 'rgba(251, 191, 36, 0.45)');
        }
    }

    drawFlower(x, y) {
        const ctx = this.ctx;
        const petRadius = 4.5;

        // Kelopak Pink
        ctx.fillStyle = '#F472B6';
        for (let a = 0; a < 5; a++) {
            const angle = (a * 2 * Math.PI) / 5;
            const px = x + Math.cos(angle) * 5.5;
            const py = y + Math.sin(angle) * 5.5;
            ctx.beginPath();
            ctx.arc(px, py, petRadius, 0, Math.PI * 2);
            ctx.fill();
        }

        // Inti Kuning
        ctx.beginPath();
        ctx.arc(x, y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#FCD34D';
        ctx.fill();
    }

    drawGoldenFruit(x, y, isRadiant) {
        const ctx = this.ctx;
        // Tangkai
        ctx.strokeStyle = '#451A03';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x, y - 8);
        ctx.quadraticCurveTo(x + 2, y - 12, x + 4, y - 13);
        ctx.stroke();

        // Buah Emas
        const fruitGrad = ctx.createRadialGradient(x - 2, y - 2, 1, x, y, 8);
        fruitGrad.addColorStop(0, '#FEF08A');
        fruitGrad.addColorStop(0.6, '#F59E0B');
        fruitGrad.addColorStop(1, '#B45309');

        ctx.beginPath();
        ctx.arc(x, y, 7.5, 0, Math.PI * 2);
        ctx.fillStyle = fruitGrad;
        ctx.fill();

        // Kilauan Cahaya
        ctx.beginPath();
        ctx.arc(x - 2.5, y - 2.5, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();

        if (isRadiant) {
            this.drawGlow(x, y, 15, 'rgba(253, 224, 71, 0.5)');
        }
    }

    drawGlow(x, y, radius, color) {
        const ctx = this.ctx;
        const glow = ctx.createRadialGradient(x, y, 0, x, y, radius);
        glow.addColorStop(0, color);
        glow.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }

    updateParticles(width, height) {
        const ctx = this.ctx;
        this.particles.forEach(p => {
            p.y += p.speedY;
            p.x += p.speedX;

            if (p.y < 0) {
                p.y = height - 60;
                p.x = Math.random() * width;
            }

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.alpha;
            ctx.fill();
            ctx.globalAlpha = 1.0;
        });
    }

    startLoop() {
        if (this.animationId) return;
        const render = () => {
            this.draw();
            this.animationId = requestAnimationFrame(render);
        };
        this.animationId = requestAnimationFrame(render);
    }

    stopLoop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
}

window.TreeOfVirtue = TreeOfVirtue;
