'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from './ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import Image from 'next/image';
import SearchableSelect from './SearchableSelect ';
import {
  getCharacters,
  getTournaments,
  addPlayerParticipation,
  getPlayerParticipations,
  getTournamentsByPlayer,
  removePlayerParticipation,
} from '@/lib/requests';

const EditProfile = ({
  player,
  onSave,
  onClose,
  tournaments,
  setTournaments,
}) => {
  const [formData, setFormData] = useState({
    nome: player.nome, //
    personagemPrincipal: player.personagemPrincipal, //
    foto: player.foto, //
    personagemSecundario: player.personagemSecundario, //
  });

  const [characters, setCharacters] = useState([]);

  const [playerParticipations, setPlayerParticipations] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState('');
  const [position, setPosition] = useState();
  const [matches, setMatches] = useState();
  const [wins, setWins] = useState();
  const [foto, setFoto] = useState(player.foto);
  const [personagemPrincipal, setPersonagemPrincipal] = useState(
    player.personagemPrincipal
  );
  const [personagemSecundario, setPersonagemSecundario] = useState(
    player.personagemSecundario
  );
  const [tournamentId, setTournamentId] = useState('');
  const [addTournament, setAddTournament] = useState(false);
  const [availableTournaments, setAvailableTournaments] = useState([]);

  const fetchCharacters = async () => {
    try {
      const data = await getCharacters();
      setCharacters(data || []); // Ensure data is an array
    } catch (error) {
      console.error('Error fetching characters:', error);
      setCharacters([]); // Fall back to empty array on error
    }
  };

  function intersect(a, b) {
    var setB = new Set(b);
    return [...new Set(a)].filter((x) => setB.has(x));
  }
  // Fetch tournaments for tournament selection

  const fetchTournamentsByPlayer = useCallback(
    async (id) => {
      // function body
      try {
        const data = await getTournamentsByPlayer(id);
        setPlayerParticipations(data || []);
        const available = tournaments.filter((obj1) =>
          data.some((obj2) => obj1._id !== obj2._id)
        );
        setAvailableTournaments(available);
      } catch (error) {
        console.error('Error fetching player tournaments:', error);
      }
    },
    [tournaments]
  );

  const handleRemovePlayerParticipation = async (tournamentId) => {
    try {
      await removePlayerParticipation(player._id, tournamentId);
      setPlayerParticipations(
        playerParticipations.filter((t) => t._id !== tournamentId)
      );
      fetchTournamentsByPlayer(player._id);
    } catch (error) {
      console.error('Error removing player participation:', error);
    }
  };

  const handleAddPlayerParticipation = async (playerId, tournamentId) => {
    try {
      await addPlayerParticipation(playerId, tournamentId, {
        position,
        matches,
        wins,
      });
      fetchTournamentsByPlayer(player._id);
    } catch (error) {
      console.error('Error adding player participation:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedData = {
      ...formData,
      personagemPrincipal,
      personagemSecundario,
    };
    onSave(player._id, updatedData); // Pass the updated data
    onClose(); // Close the dialog after saving
  };

  useEffect(() => {
    fetchCharacters();
    fetchTournamentsByPlayer(player._id);
  }, [fetchTournamentsByPlayer, player._id]);
  useEffect(() => {
    // Ensure personagemPrincipal is updated if player data changes
    setPersonagemPrincipal(player.personagemPrincipal);
    setPersonagemSecundario(player.personagemSecundario);
  }, [player]);

  return (
    <form onSubmit={handleSubmit} className="grid h-full gap-4 py-4">
      {/* Foto */}
      <div className="flex justify-center mb-4">
        <Image
          src={formData.foto}
          alt="foto"
          width={60}
          height={60}
          className="rounded-full"
        />
      </div>

      {/* Nome */}
      <div className="grid items-center grid-cols-4 gap-4">
        <Label htmlFor="nome" className="text-right">
          Nome
        </Label>
        <Input
          id="nome"
          name="nome"
          placeholder="Nome"
          value={formData.nome}
          className="col-span-3"
          onChange={handleChange}
        />
      </div>

      {/* Personagem Principal */}
      <div className="grid items-center grid-cols-4 gap-4">
        <Label htmlFor="personagemPrincipal" className="text-right">
          Personagem Principal
        </Label>
        <SearchableSelect
          options={characters}
          label="Personagem Principal"
          setSelectedValue={setPersonagemPrincipal}
          selectedValue={personagemPrincipal || ''}
        />
      </div>

      {/* Personagem Secundario */}
      <div className="grid items-center grid-cols-4 gap-4">
        <Label htmlFor="personagemSecundario" className="text-right">
          Personagem Secundário
        </Label>
        <SearchableSelect
          options={characters}
          label="Personagem Secundário"
          setSelectedValue={setPersonagemSecundario}
          selectedValue={personagemSecundario || ''}
        />
      </div>

      {/* Lista de torneios participantes */}
      <div className="flex flex-col items-center gap-4">
        <Label htmlFor="pontosTorneios">Torneios</Label>
        <div className="flex flex-col gap-2 w-[80%]">
          {playerParticipations.map((participation, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-3"
            >
              <span>{participation.name}</span>
              <Button
                type="button"
                onClick={() => {
                  handleRemovePlayerParticipation(
                    player._id,
                    participation._id
                  );
                }}
              >
                Remover
              </Button>
            </div>
          ))}
        </div>
      </div>
      <Button type="button" onClick={() => setAddTournament(true)}>
        Adicionar Torneio
      </Button>
      {/* Adicionar participação em um torneio */}
      {addTournament && (
        <>
          {/* Tournament Selection */}
          <div className="grid items-center grid-cols-4 gap-4">
            <Label htmlFor="tournament" className="text-right">
              Torneio
            </Label>
            <SearchableSelect
              options={availableTournaments}
              label="Torneio"
              setSelectedValue={setSelectedTournament}
              selectedValue={selectedTournament || ''}
              setTournamentId={setTournamentId}
            />
          </div>
          {/* Position, Matches, Wins */}
          {selectedTournament && (
            <>
              <div className="grid items-center grid-cols-4 gap-4">
                <Label htmlFor="position" className="text-right">
                  Posição
                </Label>
                <Input
                  id="position"
                  type="number"
                  value={position}
                  onChange={(e) => setPosition(Number(e.target.value))}
                />
              </div>
              <div className="grid items-center grid-cols-4 gap-4">
                <Label htmlFor="matches" className="text-right">
                  Partidas
                </Label>
                <Input
                  id="matches"
                  type="number"
                  value={matches}
                  onChange={(e) => setMatches(Number(e.target.value))}
                />
              </div>
              <div className="grid items-center grid-cols-4 gap-4">
                <Label htmlFor="wins" className="text-right">
                  Vitórias
                </Label>
                <Input
                  id="wins"
                  type="number"
                  value={wins}
                  onChange={(e) => setWins(Number(e.target.value))}
                />
              </div>
            </>
          )}
          <div className="flex flex-row gap-4">
            <Button type="button" onClick={() => setAddTournament(false)}>
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={() =>
                handleAddPlayerParticipation(player._id, tournamentId)
              }
            >
              Adicionar
            </Button>
          </div>
        </>
      )}

      <DialogFooter>
        <Button type="submit">Salvar alterações</Button>
        <Button type="button" onClick={onClose}>
          Cancelar
        </Button>
      </DialogFooter>
    </form>
  );
};

export default EditProfile;
