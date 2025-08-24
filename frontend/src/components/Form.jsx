import Input from "./Input";
import { Container, Typography, Link, Button } from "@mui/material";
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from "@mui/material";
export default function Form({showLink, handleSubmit, isSubmitted, finalSubmit, label, inputs, onSubmit, register, linkText, toggleAuthMode, signedIn, wrongLog, passwordIndex }) {
  return (
    <Container
      component="form"
      onSubmit={isSubmitted? handleSubmit(finalSubmit): handleSubmit(onSubmit)}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "calc(100vh - 64px)",
        p: 2,
      }}
    >
      <Container
        sx={{
          width: "100%",
          maxWidth: 400,
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          display: "flex",
          flexDirection: "column",
          gap: 3,
          bgcolor: "background.paper", 
        }}
      >
        <Typography
          variant="h5"
          sx={{ color: "text.primary", fontWeight: "bold", textAlign: "center" }}
        >
          {label}
        </Typography>

        {inputs.map((variable, index) => (
          <Input key={index} index={index} register={register} variable={variable} passwordIndex={passwordIndex} />
        ))}
        {!signedIn && !isSubmitted && <FormControl component="fieldset">
          <FormLabel component="legend">Account Type</FormLabel>
          <RadioGroup row defaultValue="customer" {...register("accountType")}>
            <FormControlLabel value="customer" control={<Radio />} label="Customer" />
            <FormControlLabel value="restaurant" control={<Radio />} label="Restaurant" />
          </RadioGroup>
        </FormControl>
        }
        {wrongLog && <Typography color="error">Incorrect email or password</Typography>}
        <Button
          type="submit"
          variant="contained"
          sx={{
            backgroundColor: "#1ed760",
            color: "#000",
            borderRadius: "9999px",
            textTransform: "none",
            fontWeight: "bold",
            fontSize: "1rem",
            py: 1.5,
            '&:hover': {
              backgroundColor: "#1db954",
            },
          }}
        >
          Continue
        </Button>
        {showLink && <Link
          onClick={toggleAuthMode}
          color="inherit"
          underline="hover"
          sx={{
            cursor: 'pointer',
            textAlign: 'center',
            '&:hover': {
              color: 'primary.light',
            },
          }}
        >
          {linkText}
        </Link>}
      </Container>
    </Container>
  );
}
