'use client';
import { getPlayerById, deletePlayer, updatePlayer } from '@/lib/requests';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function PlayerDetails({ params }) {
  const { id } = params;

  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function singlePlayer(id) {
      try {
        const data = await getPlayerById(id);
        setPlayer(data);
        setLoading(false); // Carregamento finalizado
      } catch (error) {
        console.error('Erro ao buscar jogador:', error);
        setLoading(false); // Mesmo com erro, o carregamento finaliza
      }
    }
    singlePlayer(id);
  }, [id]);

  if (loading) {
    return <p>Carregando...</p>; // Mensagem enquanto os dados são carregados
  }

  if (!player) {
    return <p>Jogador não encontrado.</p>; // Mensagem caso não haja jogador
  }

  console.log(player);

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold">{player.nome}</h1>
      <Image
        src={player.foto}
        alt="player"
        className="w-32 h-32"
        width={200}
        height={200}
      />
      <p>Level: {player.level}</p>
      <p>Ranking: {player.ranking}</p>
      <p>Personagem Principal: {player.personagemPrincipal}</p>
      <p>Personagem Secundário: {player.personagemSecundario}</p>
      <p>Jogos: {player.totalMatches}</p>
      <p>Vitórias: {player.totalWins}</p>
      <p>Coeficiente de Força: {player.coeficienteForca}%</p>
      <p>Coeficiente de Consistência: {player.coeficienteConsistencia}%</p>
      <p>Vezes como primeiro Lugar :{player.numberFirstPlace}</p>
      <p>Vezes como segundo Lugar: {player.numberSecondPlace}</p>
      <p>Vezes como terceiro Lugar: {player.numberThirdPlace}</p>
      <p>Vezes em Top 8: {player.numberTop8}</p>
      <p>Torneios: {player.numberTotalTournaments}</p>
    </div>
  );
}
