import { useEffect, useRef } from "react";

function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    // White background
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={900}
      height={600}
      className="rounded-xl border-4 border-slate-700 bg-white shadow-xl"
    />
  );
}

export default Canvas;
