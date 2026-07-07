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

  const isDrawing = useRef(false);

  const lastPosition = useRef({
    x: 0,
    y: 0,
  });

  // Always hold the latest brush settings
  const colorRef = useRef(color);
  const brushSizeRef = useRef(brushSize);

  const { room, gameState } = useGame();
  const roomRef = useRef(room);

  const gameStateRef = useRef(gameState);

  // Keep refs updated without recreating listeners
  useEffect(() => {
    colorRef.current = color;
  }, [color]);

  useEffect(() => {
    brushSizeRef.current = brushSize;
  }, [brushSize]);

  useEffect(() => {
    roomRef.current = room;
  }, [room]);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    // Initial white canvas
    ctx.fillStyle = "white";
    ctx.fillRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    ctx.lineCap = "round";

    const getMousePosition = (
      event: MouseEvent
    ) => {
      const rect =
        canvas.getBoundingClientRect();

      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    };

    const clearCanvas = () => {
      ctx.fillStyle = "white";
      ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
      );
    };

    const onRemoteLine = (data: {
      from: {
        x: number;
        y: number;
      };
      to: {
        x: number;
        y: number;
      };
    }) => {
      ctx.strokeStyle = colorRef.current;
      ctx.lineWidth = brushSizeRef.current;

      drawLine(
        ctx,
        data.from,
        data.to
      );
    };

    const startDrawing = (event: MouseEvent) => {
      if (!isDrawer()) return;

      isDrawing.current = true;

      lastPosition.current =
        getMousePosition(event);
    };

    const isDrawer = () =>
      gameStateRef.current?.drawerId === socket.id;

    const draw = (
      event: MouseEvent
    ) => {
      if (!isDrawing.current) return;

      if (!isDrawer()) return;

      const currentRoom = roomRef.current;

      if (!currentRoom) return;

      const current =
        getMousePosition(event);

      ctx.strokeStyle =
        colorRef.current;

      ctx.lineWidth =
        brushSizeRef.current;

      drawLine(
        ctx,
        lastPosition.current,
        current
      );

      socket.emit("draw-line", {
        roomCode: currentRoom.code,
        from: lastPosition.current,
        to: current,
      });

      lastPosition.current =
        current;
    };

    const stopDrawing = () => {
      isDrawing.current = false;
    };

    socket.on(
      "draw-line",
      onRemoteLine
    );

    socket.on(
      "clear-canvas",
      clearCanvas
    );

    window.addEventListener(
      "clear-canvas",
      clearCanvas
    );

    canvas.addEventListener(
      "mousedown",
      startDrawing
    );

    canvas.addEventListener(
      "mousemove",
      draw
    );

    canvas.addEventListener(
      "mouseup",
      stopDrawing
    );

    canvas.addEventListener(
      "mouseleave",
      stopDrawing
    );

    return () => {
      socket.off(
        "draw-line",
        onRemoteLine
      );

      socket.off(
        "clear-canvas",
        clearCanvas
      );

      window.removeEventListener(
        "clear-canvas",
        clearCanvas
      );

      canvas.removeEventListener(
        "mousedown",
        startDrawing
      );

      canvas.removeEventListener(
        "mousemove",
        draw
      );

      canvas.removeEventListener(
        "mouseup",
        stopDrawing
      );

      canvas.removeEventListener(
        "mouseleave",
        stopDrawing
      );
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={900}
      height={600}
      className={`rounded-xl border-4 shadow-xl ${
        gameState?.drawerId === socket.id
          ? "border-green-500 cursor-crosshair"
          : "border-slate-700 cursor-not-allowed opacity-95"
      }`}
    />
  );
}

export default Canvas;