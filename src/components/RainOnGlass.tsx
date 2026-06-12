import { useEffect, useRef } from 'react';

type Drop = {
    x: number;
    y: number;
    r: number;
    speed: number;
    drift: number;
    alpha: number;
};

export default function RainOnGlass() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        let animationFrame = 0;
        let destroyed = false;
        let width = 0;
        let height = 0;
        const drops: Drop[] = [];

        const createDrop = (): Drop => ({
            x: Math.random() * width,
            y: Math.random() * height,
            r: 1.5 + Math.random() * 5,
            speed: 0.45 + Math.random() * 1.4,
            drift: -0.2 + Math.random() * 0.4,
            alpha: 0.18 + Math.random() * 0.45,
        });

        const fillDrops = () => {
            const targetCount = Math.max(80, Math.floor((width * height) / 9500));
            while (drops.length < targetCount) {
                drops.push(createDrop());
            }
            drops.length = targetCount;
        };

        const resize = () => {
            const parent = canvas.parentElement;
            if (!parent) return;

            const nextWidth = parent.clientWidth;
            const nextHeight = parent.clientHeight;
            if (nextWidth === 0 || nextHeight === 0) return;

            width = nextWidth;
            height = nextHeight;
            canvas.width = Math.round(width * dpr);
            canvas.height = Math.round(height * dpr);
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            fillDrops();
        };

        const drawBackground = () => {
            const gradient = ctx.createLinearGradient(0, 0, width, height);
            gradient.addColorStop(0, '#022C28');
            gradient.addColorStop(0.45, '#03483F');
            gradient.addColorStop(1, '#010F0D');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            const glow = ctx.createRadialGradient(width * 0.5, height * 0.35, 0, width * 0.5, height * 0.35, width * 0.65);
            glow.addColorStop(0, 'rgba(47, 166, 154, 0.22)');
            glow.addColorStop(0.55, 'rgba(15, 118, 110, 0.10)');
            glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = glow;
            ctx.fillRect(0, 0, width, height);
        };

        const drawDrop = (drop: Drop) => {
            const dropGradient = ctx.createRadialGradient(drop.x, drop.y, 0, drop.x, drop.y, drop.r * 2.2);
            dropGradient.addColorStop(0, `rgba(255, 255, 255, ${drop.alpha})`);
            dropGradient.addColorStop(0.42, `rgba(255, 255, 255, ${drop.alpha * 0.55})`);
            dropGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

            ctx.fillStyle = dropGradient;
            ctx.beginPath();
            ctx.ellipse(drop.x, drop.y, drop.r * 0.65, drop.r * 1.55, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = `rgba(255, 255, 255, ${drop.alpha * 0.35})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(drop.x, drop.y + drop.r * 0.8);
            ctx.lineTo(drop.x + drop.drift * 6, drop.y + drop.r * 4.5);
            ctx.stroke();
        };

        const render = () => {
            if (destroyed) return;

            drawBackground();
            ctx.fillStyle = 'rgba(255, 255, 255, 0.025)';
            ctx.fillRect(0, 0, width, height);

            for (const drop of drops) {
                drop.y += drop.speed;
                drop.x += drop.drift;

                if (drop.y - drop.r > height || drop.x < -20 || drop.x > width + 20) {
                    Object.assign(drop, createDrop(), { y: -10 });
                }

                drawDrop(drop);
            }

            animationFrame = requestAnimationFrame(render);
        };

        const resizeObserver = new ResizeObserver(resize);
        if (canvas.parentElement) {
            resizeObserver.observe(canvas.parentElement);
        }

        resize();
        animationFrame = requestAnimationFrame(render);

        return () => {
            destroyed = true;
            cancelAnimationFrame(animationFrame);
            resizeObserver.disconnect();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0"
            style={{ zIndex: 0, width: '100%', height: '100%', filter: 'saturate(0.8) brightness(0.62)' }}
        />
    );
}