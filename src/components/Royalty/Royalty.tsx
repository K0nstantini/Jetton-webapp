import { Button } from '@mui/material'
import classes from './Royalty.module.css';

type RoyaltyProps = {
    value: null | number,
    btnEnabled: boolean,
    onClick: () => void
}

export function Royalty({ value, btnEnabled, onClick }: RoyaltyProps) {

    const valueStr = value ? `${value}%` : 'not available...';

    return (
        <div className={classes.royalty} >
            <div className={classes.txt}>
                <h3 className={classes.txt}>
                    {`Comission: ${valueStr}`}
                </h3>
            </div>
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