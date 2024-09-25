import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const AddTournament = ({ onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    participants: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div>
        <label>Name of Tournament</label>
        <Input
          name="name"
          placeholder="Tournament Name"
          value={formData.name}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Participants</label>
        <Input
          name="participants"
          type="number"
          placeholder="Number of Participants"
          value={formData.participants}
          onChange={handleChange}
        />
      </div>
      <Button type="submit">Add Tournament</Button>
    </form>
  );
};

export default AddTournament;
