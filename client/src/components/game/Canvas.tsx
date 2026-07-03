import { useEffect, useRef } from "react";
import { socket } from "../../socket/socket";
import { useGame } from "../../context/GameContext";
import { drawLine } from "../../lib/drawing";

type CanvasProps = {
  color: string;
  brushSize: number;
};

function Canvas({
  color,
  brushSize,
}: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Is the mouse currently drawing?
  const isDrawing = useRef(false);

  // Previous mouse position
  const lastPosition = useRef({ x: 0, y: 0 });

  const { room } = useGame();

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    // White background
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Brush settings
    ctx.lineCap = "round";
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = color;

    const getMousePosition = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();

      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    };

    const onRemoteLine = (data: {
      from: { x: number; y: number };
      to: { x: number; y: number };
    }) => {
      // Temporary:
      // Remote strokes use the local player's brush settings.
      // We'll synchronize color and brush size in the next sprint.
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;

      drawLine(ctx, data.from, data.to);
    };

    const startDrawing = (event: MouseEvent) => {
      isDrawing.current = true;
      lastPosition.current = getMousePosition(event);
    };

    const draw = (event: MouseEvent) => {
      if (!isDrawing.current) return;
      if (!room) return;

      const current = getMousePosition(event);

      // Apply current brush settings
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;

      drawLine(ctx, lastPosition.current, current);

      socket.emit("draw-line", {
        roomCode: room.code,
        from: lastPosition.current,
        to: current,
      });

      lastPosition.current = current;
    };

    const stopDrawing = () => {
      isDrawing.current = false;
    };

    const clearCanvas = () => {
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    socket.on("draw-line", onRemoteLine);

    window.addEventListener("clear-canvas", clearCanvas);

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseleave", stopDrawing);

    return () => {
      socket.off("draw-line", onRemoteLine);

      window.removeEventListener("clear-canvas", clearCanvas);

      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", stopDrawing);
      canvas.removeEventListener("mouseleave", stopDrawing);
    };
  }, [color, brushSize, room]);

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