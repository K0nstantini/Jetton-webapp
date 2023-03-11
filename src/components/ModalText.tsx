import { Box, Button, Modal, TextField, Typography } from '@mui/material'
import { SetStateAction, useState } from 'react'

type ModalProps = {
    open: boolean,
    handleClose: () => void
    onClickBtn: (addr: string) => void
}


export function ModalText({ open, handleClose, onClickBtn }: ModalProps) {


    const [value, setValue] = useState('');

    const onClick = () => {
        onClickBtn(value)
        setValue('')
    }

    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 700,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <div className='MinterAddress'>
                    <TextField
                        id="outlined-basic"
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

    )
}