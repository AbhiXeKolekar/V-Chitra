type ToolbarProps = {
  color: string;
  setColor: (color: string) => void;

  brushSize: number;
  setBrushSize: (size: number) => void;

  onClear: () => void;

  disabled?: boolean;
};

function Toolbar({
  color,
  setColor,

  brushSize,
  setBrushSize,

  onClear,

  disabled = false,
}: ToolbarProps) {
  return (
    <div
      className={`mb-6 flex items-center gap-6 rounded-xl bg-slate-900 p-4 transition ${
        disabled ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-center gap-2">
        <label>🎨</label>

        <input
          type="color"
          value={color}
          disabled={disabled}
          onChange={(e) =>
            setColor(e.target.value)
          }
          className="h-10 w-10 cursor-pointer rounded border-0 disabled:cursor-not-allowed"
        />
      </div>

      <div className="flex items-center gap-3">
        <span>Brush</span>

        <input
          type="range"
          min={2}
          max={20}
          value={brushSize}
          disabled={disabled}
          onChange={(e) =>
            setBrushSize(
              Number(e.target.value)
            )
          }
        />

        <span>{brushSize}px</span>
      </div>

      <button
        onClick={onClear}
        disabled={disabled}
        className="rounded-lg bg-red-600 px-4 py-2 transition hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-slate-700"
      >
        🗑 Clear
      </button>
    </div>
  );
}

export default Toolbar;