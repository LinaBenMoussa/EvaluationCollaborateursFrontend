/* eslint-disable react/prop-types */
import { Autocomplete, Box, TextField } from "@mui/material";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/slices/authSlice";
import { useState } from "react";
import { useGetByRoleQuery } from "store/api/userApi";

// eslint-disable-next-line react/prop-types
export default function AutocompleteFieldManager({
  fullwidth,
  setSelectedManager,
  setIdManager,
  selectedManager,
}) {
  const managerId = useSelector(selectCurrentUser);
  const { data: managers = [], isLoading, isFetching } = useGetByRoleQuery("manager");
  console.log(managers);
  return (
    <Autocomplete
      id="manager"
      options={managers}
      fullWidth={fullwidth}
      autoHighlight
      loading={isFetching}
      value={selectedManager || null}
      getOptionLabel={(option) => option.nom + " " + option.prenom}
      renderOption={(props, option) => (
        <Box component="li" {...props} key={option.id}>
          {option.nom + " " + option.prenom}
        </Box>
      )}
      onChange={(_, newValue) => {
        setIdManager(newValue?.id || null);
        setSelectedManager(newValue || null);
      }}
      renderInput={(params) => (
        <TextField {...params} label="Choisir un manager" disabled={isLoading} />
      )}
    />
  );
}
