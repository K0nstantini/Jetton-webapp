import { Button } from '@mui/material'
import classes from './Royalty.module.css';

type RoyaltyProps = {
    value: null | number,
    btnEnabled: boolean,
    onClick: () => void
}

export function Royalty({ value, btnEnabled, onClick }: RoyaltyProps) {

    const valueStr = value == null ? 'not available' : `${value}%`;
    const color = value == null ? 'grey'
        : (value > 0 ? 'green' : (value < 0 ? 'red' : 'black'));

    return (
        <div className={classes.royalty} >
            <div className={classes.txtBox}>
                <h3 className={classes.staticTxt}>Comission:</h3>
                <h3 style={{ color }}> {valueStr}</h3>
            </div>

            <Button
                className={classes.btn}
                disabled={!btnEnabled}
                variant="outlined"
                onClick={onClick}>
                change
            </Button>
        </div >

    )
}