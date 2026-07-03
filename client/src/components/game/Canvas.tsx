import { useEffect, useRef } from "react";

function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Is the mouse currently drawing?
  const isDrawing = useRef(false);

  // Previous mouse position
  const lastPosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    // White background
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Brush settings
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";

    const getMousePosition = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();

      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    };

    const startDrawing = (event: MouseEvent) => {
      isDrawing.current = true;

      lastPosition.current = getMousePosition(event);
    };

    const draw = (event: MouseEvent) => {
      if (!isDrawing.current) return;

      const current = getMousePosition(event);

      ctx.beginPath();

      ctx.moveTo(
        lastPosition.current.x,
        lastPosition.current.y
      );

      ctx.lineTo(current.x, current.y);

      ctx.stroke();

      lastPosition.current = current;
    };

    const stopDrawing = () => {
      isDrawing.current = false;
    };

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseleave", stopDrawing);

    return () => {
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", stopDrawing);
      canvas.removeEventListener("mouseleave", stopDrawing);
    };
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