import { ListItem, IconButton, ListItemText } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
export default function ListItems({ data, handleClick, titleKey, detailKey }) {
    return (
        <ListItem
            sx={{ width: "100%" }}
            secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={handleClick}>
                    <DeleteIcon style={{ color: 'red', fontSize: 20 }} />
                </IconButton>
            }
            disablePadding
        >
            <ListItemText 
                sx={{ width: "100%" }}
                primary={`${data[titleKey]}, ${data[detailKey]}`} 
            />
        </ListItem>
    );
}