import { TextField } from '@mui/material';

export default function Input({register, variable, index, passwordIndex=null}) {
  const getType= (index)=> (passwordIndex? index===passwordIndex? "password": "text" : "text");
  const getId = (index)=> (passwordIndex? index===passwordIndex? "outlined-password-input" : "outlined-basic" : "outlined-basic");
  return (
    <TextField
      fullWidth
      required
      id={getId(index)}
      variant="outlined"
      type={getType(index)}
      label={variable}
      placeholder={variable}
      {...register(variable, { required: `${variable} is required` })}
      sx={{
        '& .MuiOutlinedInput-root': {
          color: 'text.primary',
          '& fieldset': {
            borderColor: 'text.secondary',
          },
          '&:hover fieldset': {
            borderColor: 'primary.main',
          },
          '&.Mui-focused fieldset': {
            borderColor: 'primary.main',
          },
        },
        '& .MuiInputLabel-root': {
          color: 'text.secondary',
          '&.Mui-focused': {
            color: 'primary.main',
          },
        },
      }}
    />
  );
}
