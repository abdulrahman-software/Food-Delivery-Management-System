import Container from '@mui/material/Container';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useState } from 'react';
import { useEffect } from 'react';
export default function SelectItem({label, items, titleKey, valueKey, onchange=null}) {
  const [value, setValue] = useState('');

  const handleChange = (event) => {
    setValue(event.target.value);
  };
  useEffect(() => {
    if (onchange) onchange(value);
  }, [value]);
  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 80 }}>
        <InputLabel id="demo-simple-select-autowidth-label">{label}</InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={value}
          onChange={handleChange}
          autoWidth
          label={label}
        >
          {items.map((item, index)=>{
            const displayValue = Array.isArray(item) ? item[titleKey] : item;
            const actualValue = Array.isArray(item) ? item[valueKey] : item;
            return <MenuItem  key={index} value={actualValue}>{displayValue}</MenuItem>
          })}
        </Select>
      </FormControl>
    </div>
  );
}
