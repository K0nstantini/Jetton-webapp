import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { useState } from 'react';

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
            sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="label"><b>Network</b></InputLabel>
            <Select
                labelId='label'
                label='Network'
                value={type}
                onChange={change}
                displayEmpty >
                <MenuItem value={TypesNet.Testnet}>{TypesNet.Testnet}</MenuItem>
                <MenuItem value={TypesNet.Mainnet}>{TypesNet.Mainnet}</MenuItem>
            </Select>
        </FormControl>
    )
}