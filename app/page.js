'use client';
import {
  addPlayer,
  addTournament, // Add this
  getPlayers,
  updatePlayer,
  deletePlayer,
  getTournaments,
} from '@/lib/requests';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import EditProfile from '@/components/EditProfile';
import AddProfile from '@/components/AddProfile';
import AddTournament from '@/components/AddTournament'; // Add Tournament component

export default function Leaderboard() {
  const [players, setPlayers] = useState([]);
  const [updatedData, setUpdatedData] = useState();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [addPlayerOpen, setAddPlayerOpen] = useState(false); // For Player Dialog
  const [addTournamentOpen, setAddTournamentOpen] = useState(false); // For Tournament Dialog
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [tournaments, setTournaments] = useState([]);

  const fetchPlayers = async () => {
    setPlayers([]);
    try {
      const data = await getPlayers();
      setPlayers(data);
    } catch (error) {
      console.error('Erro ao buscar jogadores:', error);
      setPlayers([]);
    }
  };
  const fetchTournaments = async (id) => {
    try {
      const data = await getTournaments();
      setTournaments(data || []);
    } catch (error) {
      console.error('Error fetching tournaments:', error);
    }
  };
  useEffect(() => {
    fetchPlayers();
    fetchTournaments();
  }, []);

  const handleUpdate = async (id, updatedData) => {
    try {
      await updatePlayer(id, updatedData);
      fetchPlayers();
      setDialogOpen(false);
    } catch (error) {
      console.error('Erro ao atualizar jogador:', error);
    }
  };

  const handleAddPlayer = async (newPlayer) => {
    try {
      const player = await addPlayer(newPlayer);
      return player;
    } catch (error) {
      console.error('Erro ao adicionar jogador:', error);
    }
  };

  const handleAddTournament = async (newTournament) => {
    try {
      await addTournament(newTournament);
      // Handle tournament list refresh here if needed
    } catch (error) {
      console.error('Erro ao adicionar torneio:', error);
    }
  };

  const handleDeletePlayer = async (id) => {
    try {
      await deletePlayer(id);
      setPlayers((prevPlayers) => prevPlayers.filter((p) => p._id !== id));
    } catch (error) {
      console.error('Erro ao excluir jogador:', error);
    }
  };

  console.log(players);

  return (
    <div className="flex flex-col items-center justify-center w-full gap-4 py-2">
      <h1 className="text-2xl font-bold">Tekken 8 Leaderboard</h1>
      <div className="w-[80%] ">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Ranking</TableHead>
              <TableHead>Partidas</TableHead>
              <TableHead>Vitórias</TableHead>
              <TableHead>Opções</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {players.map((player, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Link href={`/player/${player._id}`}>{player.nome}</Link>
                </TableCell>
                <TableCell>{player.ranking}</TableCell>
                <TableCell>{player.totalMatches}</TableCell>
                <TableCell>{player.totalWins}</TableCell>
                <TableCell>
                  <div className="flex flex-row gap-2">
                    <Dialog
                      open={!!currentPlayer}
                      onOpenChange={(open) => {
                        if (!open) setCurrentPlayer(null);
                      }}
                    >
                      <DialogTrigger
                        asChild
                        onClick={() => setCurrentPlayer(player)}
                      >
                        <Button variant="outline">Edit Profile</Button>
                      </DialogTrigger>
                      <DialogContent className="overflow-y-auto max-h-[80vh]">
                        <DialogHeader>
                          <DialogTitle>Edit profile</DialogTitle>
                          <DialogDescription>
                            Make changes to your profile here. Click save when
                            you`re done.
                          </DialogDescription>
                        </DialogHeader>
                        {currentPlayer && (
                          <EditProfile
                            player={currentPlayer}
                            onSave={handleUpdate}
                            onClose={() => setCurrentPlayer(null)}
                            fetchPlayers={fetchPlayers}
                            tournaments={tournaments}
                            setTournaments={setTournaments}
                          />
                        )}
                      </DialogContent>
                    </Dialog>

                    <Link href={`/player/${player._id}`}>
                      <Button variant="outline">View Profile</Button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger>
                        <Button variant="outline">Delete Profile</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the player.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-500"
                            onClick={() => handleDeletePlayer(player._id)}
                          >
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-row gap-11">
        {/* Add Player Dialog */}
        <Dialog open={addPlayerOpen} onOpenChange={setAddPlayerOpen}>
          <DialogTrigger asChild>
            <Button>Adicionar Jogador</Button>
          </DialogTrigger>
          <DialogContent className="overflow-y-auto max-h-[80vh] w-full">
            <DialogHeader>
              <DialogTitle>Add Player</DialogTitle>
            </DialogHeader>
            <AddProfile
              onSave={handleAddPlayer}
              onClose={() => setAddPlayerOpen(false)}
              fetchPlayers={fetchPlayers}
            />
          </DialogContent>
        </Dialog>

        {/* Add Tournament Dialog */}
        <Dialog open={addTournamentOpen} onOpenChange={setAddTournamentOpen}>
          <DialogTrigger asChild>
            <Button>Adicionar Torneio</Button>
          </DialogTrigger>
          <DialogContent className="overflow-y-auto max-h-[80vh] w-full">
            <DialogHeader>
              <DialogTitle>Add Tournament</DialogTitle>
            </DialogHeader>
            <AddTournament
              onSave={handleAddTournament}
              onClose={() => setAddTournamentOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
