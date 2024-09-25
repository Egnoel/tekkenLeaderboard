'use client';
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from './ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import {
  getCharacters,
  getTournaments,
  addPlayerParticipation,
} from '@/lib/requests';
import UploadImage from './UploadImage';
import SearchableSelect from './SearchableSelect ';

const AddProfile = ({ onClose, onSave, fetchPlayers }) => {
  const [formData, setFormData] = useState({
    nome: '',
    personagemPrincipal: '',
    foto: '',
    personagemSecundario: '',
  });

  const [characters, setCharacters] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState('');
  const [position, setPosition] = useState(0);
  const [matches, setMatches] = useState(0);
  const [wins, setWins] = useState(0);
  const [foto, setFoto] = useState('');
  const [personagemPrincipal, setPersonagemPrincipal] = useState('');
  const [personagemSecundario, setPersonagemSecundario] = useState('');
  const [tournamentId, setTournamentId] = useState('');

  // Fetch characters for character selection
  const fetchCharacters = async () => {
    try {
      const data = await getCharacters();
      setCharacters(data || []);
    } catch (error) {
      console.error('Error fetching characters:', error);
    }
  };

  // Fetch tournaments for tournament selection
  const fetchTournaments = async () => {
    try {
      const data = await getTournaments();
      setTournaments(data || []);
    } catch (error) {
      console.error('Error fetching tournaments:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the data to be sent, including both player info and tournament participation
    const newPlayer = {
      ...formData,
      foto,
      personagemPrincipal,
      personagemSecundario,
    };

    const player = await onSave(newPlayer); // Save the data
    if (!player || !player._id) {
      console.error('Error: Player not saved correctly');
      return;
    }

    console.log(player);
    if (selectedTournament) {
      const participationData = {
        position,
        matches,
        wins,
      };
      await addPlayerParticipation(player._id, tournamentId, participationData);
    }
    fetchPlayers();
    onClose(); // Close the modal after saving
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchCharacters();
    fetchTournaments();
  }, []);

  return (
    <form onSubmit={handleSubmit} className="grid h-full gap-4 py-4">
      {/* Foto */}
      <div className="flex items-center w-full">
        <UploadImage setImages={setFoto} images={foto} />
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
          value={formData.nome || ''}
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

      {/* Tournament Selection */}
      <div className="grid items-center grid-cols-4 gap-4">
        <Label htmlFor="tournament" className="text-right">
          Torneio
        </Label>
        <SearchableSelect
          options={tournaments}
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

      <DialogFooter>
        <Button type="submit">Adicionar Jogador</Button>
        <Button type="button" onClick={onClose}>
          Cancelar
        </Button>
      </DialogFooter>
    </form>
  );
};

export default AddProfile;
