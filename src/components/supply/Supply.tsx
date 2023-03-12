import { Button } from '@mui/material'
import classes from './Supply.module.css';

type SupplyProps = {
    value: null | bigint,
}

export function Supply({ value }: SupplyProps) {

    const valueStr = value ? `${value}` : 'not available...';

    const color = value ? 'black' : 'grey';

    return (
        <div className={classes.supply}>
            <h3 style={{ width: '110px' }}>Supply:&nbsp;</h3>
            <h3 style={{ color }}>{valueStr}
            </h3>
        </div>

    )
}