import { Box, Button, Modal, TextField } from '@mui/material'
import { useState } from 'react'
import classes from './Modal.module.css';
import { style } from './style';

type ModalProps = {
    open: boolean,
    handleClose: () => void
    onClickBtn: (addr: number) => void
}

export function ModalNumber({ open, handleClose, onClickBtn }: ModalProps) {

    const [size, setSize] = useState(0);

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description" >
            <Box sx={style}>
                <div className={classes.box}>
                    <TextField
                        type={"number"}
                        label="Comission"
                        variant="outlined"
                        fullWidth={true}
                        value={size}
                        onChange={event => setSize(Number(event.target.value))}
                    />
                    <Button
                        variant="contained"
                        onClick={() => onClickBtn(size)}>
                        ok
                    </Button>
                </div>
            </Box>
        </Modal>

    )
}