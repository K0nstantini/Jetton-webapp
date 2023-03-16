import { Box, Button, Modal, TextField } from '@mui/material'
import { useState } from 'react'
import { Address } from 'ton-core';
import { MyAlert } from '../MyAlert';
import classes from './Modal.module.css';
import { style } from './style';

type ModalProps = {
    open: boolean,
    handleClose: () => void
    onClickBtn: (addr: Address) => void
}


export function ModalText({ open, handleClose, onClickBtn }: ModalProps) {

    const [value, setValue] = useState('');
    const [openAlert, setOpenAlert] = useState(false);

    const onClick = () => {
        try {
            onClickBtn(Address.parse(value));
            setValue('');
        } catch {
            setOpenAlert(true);
        }
    }

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description" >

                <Box sx={style}>
                    <div className={classes.box}>
                        <TextField
                            label="Address"
                            variant="outlined"
                            fullWidth={true}
                            value={value}
                            onChange={event => setValue(event.target.value)}
                        />
                        <Button
                            variant="contained"
                            onClick={onClick}>
                            ok
                        </Button>
                    </div>
                </Box>
            </Modal>

            <MyAlert
                open={openAlert}
                message='Address is not valid'
                handleClose={() => setOpenAlert(false)} />
        </div>
    )
}