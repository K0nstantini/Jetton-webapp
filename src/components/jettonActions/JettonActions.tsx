import { Button, TextField } from '@mui/material'
import { useEffect, useState } from 'react';
import { Address, OpenedContract, Sender } from 'ton-core';
import Minter from '../../contracts/minter';
import Wallet from '../../contracts/wallet';
import { useAsyncInitialize } from '../../hooks/useAsyncInitialize';
import { useTonClient } from '../../hooks/useTonClient';
import classes from './JettonActions.module.css';

type JettonActionsProps = {
    sender: Sender,
    minter: OpenedContract<Minter> | null,
    refresh: () => void,
}

export function JettonAction({ sender, minter, refresh }: JettonActionsProps) {

    const client = useTonClient();
    const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

    const disabled = minter && sender ? false : true;
    const [addr, setAddr] = useState('');
    const [size, setSize] = useState(0);
    const [walletAddr, setWalletAddr] = useState<Address>();

    useEffect(() => {
        try {
            setWalletAddr(Address.parse(addr))
        } catch { }
    }, [addr]);

    const changeSize = (event: { target: { value: any; }; }) => {
        const positiveSize = Math.abs(Number(event.target.value));
        setSize(positiveSize);
    }

    async function action(fn: (sender: Sender, addr: Address, size: number) => void) {
        if (!sender || !walletAddr || size <= 0) return;
        fn(sender, walletAddr, size);
        await sleep(30000);
        refresh();
    }

    async function mint() {
        if (!minter) return;
        await action(minter.sendMint);
    }

    async function burn() {
        if (!jettonWallet) return;
        await action(jettonWallet.sendBurn);
    }

    async function send() {
        if (!jettonWallet) return;
        await action(jettonWallet.sendJettons);
    }

    const jettonWallet = useAsyncInitialize(async () => {
        if (!(client && minter && walletAddr)) return;
        const jettonAddr = await minter.getWalletAddress(walletAddr);
        const contract = new Wallet(jettonAddr);
        return client.open(contract) as OpenedContract<Wallet>;
    }, [walletAddr])

    return (
        <div className={classes.actions}>
            <div className={classes.fields}>
                <TextField
                    className={classes.addr}
                    label="Address"
                    variant="outlined"
                    value={addr}
                    onChange={event => setAddr(event?.target.value)}
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
                    onClick={() => burn()}>
                    burn
                </Button>
                <Button
                    sx={{ backgroundColor: 'green' }}
                    disabled={disabled}
                    variant="contained"
                    onClick={() => mint()}>
                    mint
                </Button>
                <Button
                    sx={{ backgroundColor: '#B88251' }}
                    disabled={disabled}
                    variant="contained"
                    onClick={() => send()}>
                    send
                </Button>
            </div>
        </div >

    )
}

