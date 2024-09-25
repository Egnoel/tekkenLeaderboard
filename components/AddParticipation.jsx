import { useState, useEffect } from 'react';
import { addPlayerParticipation, getTournaments } from '@/lib/requests'; // Assuming you have this request in your API

const AddParticipation = ({ playerId, onParticipationAdded }) => {
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState('');
  const [position, setPosition] = useState(0);
  const [matches, setMatches] = useState(0);
  const [wins, setWins] = useState(0);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const data = await getTournaments();
        setTournaments(data);
      } catch (error) {
        console.error('Erro ao buscar torneios:', error);
      }
    };

    fetchTournaments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addPlayerParticipation({
        playerId,
        tournamentId: selectedTournament,
        position,
        matches,
        wins,
      });

      // Trigger callback to update the parent component
      onParticipationAdded();
    } catch (error) {
      console.error('Erro ao adicionar participação no torneio:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Torneio:</label>
        <select
          value={selectedTournament}
          onChange={(e) => setSelectedTournament(e.target.value)}
        >
          <option value="">Selecione um torneio</option>
          {tournaments.map((tournament) => (
            <option key={tournament._id} value={tournament._id}>
              {tournament.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Posição:</label>
        <input
          type="number"
          value={position}
          onChange={(e) => setPosition(Number(e.target.value))}
        />
      </div>

      <div>
        <label>Partidas:</label>
        <input
          type="number"
          value={matches}
          onChange={(e) => setMatches(Number(e.target.value))}
        />
      </div>

      <div>
        <label>Vitórias:</label>
        <input
          type="number"
          value={wins}
          onChange={(e) => setWins(Number(e.target.value))}
        />
      </div>

      <button type="submit">Adicionar Participação</button>
    </form>
  );
};

export default AddParticipation;
