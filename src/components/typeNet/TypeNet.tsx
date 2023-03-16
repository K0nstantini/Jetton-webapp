import { FormControl, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { useState } from 'react';
import classes from './TypeNet.module.css';

export enum TypesNet {
    Testnet = "Testnet",
    Mainnet = "Mainnet"
}

type TypeNetProps = {
    handleChange: (type: TypesNet) => void
}

export function TypeNet({ handleChange }: TypeNetProps) {
    const [type, setType] = useState(TypesNet.Testnet);

    const change = (event: SelectChangeEvent) => {
        const selectedType = event.target.value as TypesNet
        setType(selectedType);
        handleChange(selectedType);
    };

    return (
        <FormControl
            // className={classes.select}
            sx={{ m: 1, minWidth: 120 }}>
            <Select
                value={type}
                onChange={change}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }} >
                <MenuItem value={TypesNet.Testnet}>{TypesNet.Testnet}</MenuItem>
                <MenuItem value={TypesNet.Mainnet}>{TypesNet.Mainnet}</MenuItem>
            </Select>
        </FormControl>
    )
}