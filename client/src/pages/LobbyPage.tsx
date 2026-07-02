import { useGame } from "../context/GameContext";

function LobbyPage() {
  const { room } = useGame();

  if (!room) {
    return <h2>No room found.</h2>;
  }

  return (
    <div>
      <h1>Lobby</h1>

      <h2>Room Code: {room.code}</h2>

      <h3>Players</h3>

      <ul>
        {room.players.map((player) => (
          <li key={player.id}>
            {player.username}
            {player.isHost ? " 👑" : ""}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LobbyPage;