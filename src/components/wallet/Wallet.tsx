import { TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { Address, OpenedContract, Sender } from 'ton-core';
import Minter from '../../contracts/minter';
import Wallet from '../../contracts/wallet';
import { useAsyncInitialize } from '../../hooks/useAsyncInitialize';
import { useTonClient } from '../../hooks/useTonClient';
import { ChangeAddress } from '../changeAddress/ChangeAddress';
import { ModalText } from '../ModalText';
import { Supply } from '../supply/Supply';
import classes from './Wallet.module.css';

type WalletProps = {
    sender: Sender,
    minter: OpenedContract<Minter> | null,
    refresh: boolean
}

export function WalletBox({ sender, minter, refresh }: WalletProps) {

    const client = useTonClient();

    const [ownerAddr, setOwnerAddr] = useState<Address>();
    const [jettonAddr, setJettonAddr] = useState<null | Address>();
    const [jettons, setJettons] = useState<null | bigint>();

    const [openOwnerAddr, setOpenOwnerAddr] = useState(false);

    const ownerAddrChange = (addr: string) => {
        setOpenOwnerAddr(false);
        try {
            setOwnerAddr(Address.parse(addr));
        } catch { }
    }

    const jettonWallet = useAsyncInitialize(async () => {
        if (!(client && minter && ownerAddr)) return;
        setJettonAddr(null);
        const jettonAddr = await minter.getWalletAddress(ownerAddr);
        setJettonAddr(jettonAddr);
        const contract = new Wallet(jettonAddr);
        return client.open(contract) as OpenedContract<Wallet>;
    }, [ownerAddr])

    useEffect(() => {
        async function getData() {
            if (!jettonWallet) return;
            setJettons(null);
            const { jettonAmount, address } = await jettonWallet.getData();
            setJettons(jettonAmount);
        }
        getData();
    }, [jettonWallet, refresh]);

    return (
        <div className={classes.wallet}>
            <h2 className={classes.label}> Wallet</h2>
            <ChangeAddress
                value={ownerAddr ? ownerAddr.toString() : ''}
                label="Owner address"
                btnEnabled={minter ? true : false}
                onClick={() => setOpenOwnerAddr(true)} />

            <TextField
                className={classes.jettonAddr}
                variant="outlined"
                label='Jetton address'
                inputProps={{ readOnly: true }}
                value={jettonAddr ? jettonAddr.toString() : ''} />

            <Supply
                label='Jettons:'
                value={jettons ? jettons : null} />

            <ModalText
                open={openOwnerAddr}
                handleClose={() => setOpenOwnerAddr(false)}
                onClickBtn={ownerAddrChange}
            />
        </div>

    )
}

