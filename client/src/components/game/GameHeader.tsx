function GameHeader() {
  return (
    <div className="flex items-center justify-between rounded-xl bg-slate-900 px-6 py-4">
      <h1 className="text-3xl font-bold">
        🎨 Draw Together
      </h1>

      <span className="text-slate-400">
        Round 1 / 5
      </span>
    </div>
  );
}

export default GameHeader;