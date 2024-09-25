const SearchableSelect = ({
  options = [],
  label,
  setSelectedValue,
  selectedValue,
  setTournamentId,
}) => {
  const handleChange = (e) => {
    const selectedOption = options.find(
      (option) => option.name === e.target.value
    );

    // Update both the selected id and name
    if (selectedOption) {
      if (setTournamentId) setTournamentId(selectedOption._id);
      setSelectedValue(selectedOption.name);
    } else {
      setTournamentId('');
      setSelectedValue('');
    }
  };

  return (
    <div className="flex flex-col">
      <select value={selectedValue} onChange={handleChange}>
        <option value="" disabled>
          {label == 'Torneio'
            ? 'Selecione um torneio'
            : 'Selecione um personagem'}
        </option>
        {options.map((option) => (
          <option key={option._id} value={option.name}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SearchableSelect;
