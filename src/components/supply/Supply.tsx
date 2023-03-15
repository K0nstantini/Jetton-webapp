import { Button } from '@mui/material'
import classes from './Supply.module.css';

type SupplyProps = {
    label: string,
    value: null | bigint,
}

export function Supply({ label, value }: SupplyProps) {

    const valueStr = value ? `${value}` : 'not available...';
    const color = value ? 'black' : 'grey';

    return (
        <div className={classes.supply}>
            <h3 className={classes.staticTxt}>{label}</h3>
            <h3 style={{ color }}>{valueStr}</h3>
        </div>

    )
}