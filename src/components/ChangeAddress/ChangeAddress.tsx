import { Button, TextField, Typography } from '@mui/material'
import classes from './ChangeAddress.module.css';

type ChangeAddressProps = {
    value: string,
    label: string,
    btnEnabled: boolean,
    onClick: () => void
}


export function ChangeAddress({ value, label, btnEnabled, onClick }: ChangeAddressProps) {

    return (
        <div className={classes.changeAddr} >
            <TextField
                id="outlined-basic"
                variant="outlined"
                label={label}
                fullWidth={true}
                inputProps={{ readOnly: true }}
                value={value}
            />
            <Button
                className={classes.btn}
                disabled={!btnEnabled}
                variant="contained"
                onClick={onClick}>
                change
            </Button>
        </div>

    )
}