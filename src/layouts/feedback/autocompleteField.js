/* eslint-disable react/prop-types */
import { Autocomplete, Box, TextField } from "@mui/material";
import { useGetCollaborateursByManagerQuery } from "../../store/api/userApi";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/slices/authSlice";
import { useState } from "react";

// eslint-disable-next-line react/prop-types
export default function AutocompleteField({
  fullwidth,
  setSelectedCollaborateur,
  setIdCollaborateur,
  selectedCollaborateur,
}) {
  const managerId = useSelector(selectCurrentUser);
  const {
    data: collaborateurs = [],
    isLoading,
    isFetching,
  } = useGetCollaborateursByManagerQuery(managerId);
  console.log(collaborateurs);
  return (
    <Autocomplete
      id="collaborateur"
      options={collaborateurs}
      fullWidth={fullwidth}
      autoHighlight
      loading={isFetching}
      value={selectedCollaborateur || null}
      getOptionLabel={(option) => option.nom + " " + option.prenom}
      renderOption={(props, option) => (
        <Box component="li" {...props}>
          {option.nom + " " + option.prenom}
        </Box>
      )}
      onChange={(_, newValue) => {
        setIdCollaborateur(newValue?.id || null);
        setSelectedCollaborateur(newValue || null);
      }}
      renderInput={(params) => (
        <TextField {...params} label="Choisir un collaborateur" disabled={isLoading} />
      )}
    />
  );
}
