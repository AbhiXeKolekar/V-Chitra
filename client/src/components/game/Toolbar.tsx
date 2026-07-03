type ToolbarProps = {
  color: string;
  setColor: (color: string) => void;
  brushSize: number;
  setBrushSize: (size: number) => void;
  onClear: () => void;
};

const colors = [
  "#000000",
  "#EF4444",
  "#22C55E",
  "#3B82F6",
  "#FACC15",
  "#A855F7",
];

function Toolbar({
  color,
  setColor,
  brushSize,
  setBrushSize,
  onClear,
}: ToolbarProps) {
  return (
    <div className="mb-6 flex items-center gap-6 rounded-xl bg-slate-900 p-4">
      <div className="flex gap-2">
        {colors.map((c) => (
          <button
            key={c}
            onClick={() => setColor(c)}
            className={`h-8 w-8 rounded-full border-2 ${
              color === c ? "border-white" : "border-transparent"
            }`}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>

      <div className="flex items-center gap-2">
        <span>Brush</span>

        <input
          type="range"
          min={2}
          max={20}
          value={brushSize}
          onChange={(e) =>
            setBrushSize(Number(e.target.value))
          }
        />
      </div>

      <button
        className="rounded bg-slate-700 px-4 py-2 hover:bg-slate-600"
        onClick={() => setColor("#FFFFFF")}
      >
        🧽 Eraser
      </button>

      <button
        className="rounded bg-red-600 px-4 py-2 hover:bg-red-500"
        onClick={onClear}
      >
        🗑 Clear
      </button>
    </div>
  );
}

export default Toolbar;