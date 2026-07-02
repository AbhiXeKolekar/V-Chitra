type Props = {
  code: string;
};

function RoomCode({ code }: Props) {
  return (
    <div className="rounded-lg bg-slate-800 px-5 py-3">
      <span className="text-slate-400">
        Room Code
      </span>

      <h2 className="mt-1 font-mono text-3xl tracking-widest text-blue-400">
        {code}
      </h2>
    </div>
  );
}

export default RoomCode;