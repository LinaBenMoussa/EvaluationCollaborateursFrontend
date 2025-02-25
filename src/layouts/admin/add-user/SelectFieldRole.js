/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function SelectFieldRole({role,setRole}) {
  const handleChange = (event) => {
    setRole(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120}}>
      <FormControl fullWidth sx={{ height: "50px" }}>
  <InputLabel id="demo-simple-select-label">Role</InputLabel>
  <Select
    labelId="demo-simple-select-label"
    id="demo-simple-select"
    value={role}
    label="Role"
    onChange={handleChange}
    sx={{ height: "45px", display: "flex", alignItems: "center" }}
  >
    <MenuItem value="Collaborateur" sx={{ fontSize: "16px", height: "40px" }}>Collaborateur</MenuItem>
    <MenuItem value="Manager" sx={{ fontSize: "16px", height: "40px" }}>Manager</MenuItem>
    <MenuItem value="Admin" sx={{ fontSize: "16px", height: "40px" }}>Admin</MenuItem>
  </Select>
</FormControl>

    </Box>
  );
}
