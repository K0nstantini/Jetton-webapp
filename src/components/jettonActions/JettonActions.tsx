import { Button, TextField } from '@mui/material'
import { useTonAddress } from '@tonconnect/ui-react';
import { useState } from 'react';
import { TonClient } from 'ton';
import { Address, OpenedContract, Sender } from 'ton-core';
import { REFRESH_TIMEOUT } from '../../Constants';
import Minter from '../../contracts/minter';
import Wallet from '../../contracts/wallet';
import { MyAlert } from '../MyAlert';
import classes from './JettonActions.module.css';

type JettonActionsProps = {
    sender: Sender,
    client: TonClient | null;
    minter: OpenedContract<Minter> | null,
    refresh: () => void,
}

export function JettonAction({ sender, client, minter, refresh }: JettonActionsProps) {

    const ownerAddr = useTonAddress();

    const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

    const disabled = minter && sender ? false : true;
    const [openAlert, setOpenAlert] = useState({ open: false, message: '' });

    const [destinationAddr, setDestinationAddr] = useState('');
    const [size, setSize] = useState(0);

    enum Actions { Mint, Send, Burn };

    const changeSize = (event: { target: { value: any; }; }) => {
        const positiveSize = Math.abs(Number(event.target.value));
        setSize(positiveSize);
    }

    async function action(act: Actions) {

        let walletAddr: Address | null = null;
        try {
            walletAddr = Address.parse(destinationAddr);
        } catch { }

        if (!walletAddr) {
            setOpenAlert({ open: true, message: 'Address is not valid' });
            return;
        }

        if (size <= 0) {
            setOpenAlert({ open: true, message: 'The size should be greater than 0' });
            return;
        }

        if (act == Actions.Mint) {
            if (!minter) return;
            minter.sendMint(sender, walletAddr, size);
        }

        if (act == Actions.Send || act == Actions.Burn) {

            const jettonWallet = await getJettonWallet(Address.parse(ownerAddr));

            if (!jettonWallet) {
                setOpenAlert({ open: true, message: 'Error while getting the contract jetton wallet' });
                return;
            }

            if (act == Actions.Send) {
                jettonWallet.sendJettons(sender, walletAddr, size);
            }
            if (act == Actions.Burn) {
                jettonWallet.sendBurn(sender, walletAddr, size);
            }
        }

        await sleep(REFRESH_TIMEOUT);
        refresh();
    }

    async function getJettonWallet(address: Address) {
        if (!(client && minter)) return;
        const jettonAddr = await minter.getWalletAddress(address);
        const contract = new Wallet(jettonAddr);
        return client.open(contract) as OpenedContract<Wallet>;
    }

    return (
        <div className={classes.actions}>
            <div className={classes.fields}>
                <TextField
                    className={classes.addr}
                    label="Address"
                    variant="outlined"
                    value={destinationAddr}
                    onChange={event => setDestinationAddr(event?.target.value)}
                />
                <TextField
                    className={classes.size}
                    type={'number'}
                    label="Size"
                    variant="outlined"
                    value={size}
                    onChange={changeSize}
                />
            </div>

            <div className={classes.btns}>
                <Button
                    sx={{ backgroundColor: 'red' }}
                    disabled={disabled}
                    variant="contained"
                    onClick={() => action(Actions.Burn)}>
                    burn
                </Button>
                <Button
                    sx={{ backgroundColor: 'green' }}
                    disabled={disabled}
                    variant="contained"
                    onClick={() => action(Actions.Mint)}>
                    mint
                </Button>
                <Button
                    sx={{ backgroundColor: '#B88251' }}
                    disabled={disabled}
                    variant="contained"
                    onClick={() => action(Actions.Send)}>
                    send
                </Button>
            </div>

            <MyAlert
                open={openAlert.open}
                message={openAlert.message}
                handleClose={() => setOpenAlert({ open: false, message: '' })} />
        </div >

    )
}

