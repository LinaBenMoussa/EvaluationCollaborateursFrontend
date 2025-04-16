/* eslint-disable react/prop-types */
import { Height } from "@mui/icons-material";
import { Autocomplete, Box, TextField } from "@mui/material";

export default function AutocompleteField({
  useFetchHook,
  fullwidth,
  setSelectedItem,
  setIdItem,
  selectedItem,
  label,
}) {
  const { data: options = [], isLoading, isFetching } = useFetchHook();

  return (
    <Autocomplete
      id={label.toLowerCase().replace(/\s+/g, "-")}
      options={options}
      fullWidth={fullwidth}
      autoHighlight
      loading={isFetching}
      value={selectedItem}
      getOptionLabel={(option) => option.nom + " " + option.prenom}
      renderOption={(props, option) => (
        <Box component="li" {...props} key={option.id}>
          {option.nom + " " + option.prenom}
        </Box>
      )}
      onChange={(_, newValue) => {
        setIdItem(newValue?.id || null);
        setSelectedItem(newValue || null);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          sx={{ "& .MuiInputBase-root": { height: 40 } }}
          disabled={isLoading}
        />
      )}
    />
  );
}
