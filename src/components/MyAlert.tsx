import { Alert, Snackbar } from '@mui/material'

type AlertProps = {
    open: boolean,
    message: string,
    handleClose: () => void
}

export function MyAlert({ open, message, handleClose }: AlertProps) {

    return (
        <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}>
            <Alert
                onClose={handleClose}
                severity="error"
                sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>

    )
}