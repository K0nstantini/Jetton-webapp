import { IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
import { TonClient } from 'ton';
import { Address, OpenedContract } from 'ton-core';
import Minter from '../../contracts/minter';
import Wallet from '../../contracts/wallet';
import { ChangeAddress } from '../changeAddress/ChangeAddress';
import { ModalText } from '../modal/ModalAddress';
import { Supply } from '../supply/Supply';
import classes from './Wallet.module.css';
import RefreshIcon from '@mui/icons-material/Refresh';

type WalletProps = {
    client: TonClient | null;
    minter: OpenedContract<Minter> | null,
    refresh: boolean
}

export function WalletBox({ client, minter, refresh: outerRefresh }: WalletProps) {

    const [ownerAddr, setOwnerAddr] = useState<Address | null>();
    const [jettonAddr, setJettonAddr] = useState<Address | null>();
    const [jettons, setJettons] = useState<null | bigint>();

    const [jettonWallet, setJettonWallet] = useState<OpenedContract<Wallet>>();

    const [openOwnerAddr, setOpenOwnerAddr] = useState(false);
    const [openJettonAddr, setOpenJettonAddr] = useState(false);

    const [innerRefresh, setInnerRefresh] = useState(false);

    const ownerAddrChange = (addr: Address) => {
        setOpenOwnerAddr(false);
        setOwnerAddr(addr);
    }

    const ownerJettonChange = (addr: Address) => {
        setOpenJettonAddr(false);
        setJettonAddr(addr);
    }

    useEffect(() => {
        if (!(client && jettonAddr)) return;
        const contract = new Wallet(jettonAddr);
        const openedContract = client.open(contract) as OpenedContract<Wallet>;
        setJettonWallet(openedContract);
    }, [jettonAddr]);

    useEffect(() => {
        async function getData() {
            if (!jettonWallet) return;
            setJettons(null);
            const { jettonAmount, address } = await jettonWallet.getData();
            setJettons(jettonAmount);
            if (ownerAddr?.toString() != address.toString()) setOwnerAddr(address);
        }
        getData();
    }, [jettonWallet, outerRefresh, innerRefresh]);

    useEffect(() => {
        async function getJettonAddr() {
            if (!(client && minter && ownerAddr)) return;
            try {
                const address = await minter.getWalletAddress(ownerAddr);
                if (jettonAddr?.toString() != address.toString()) setJettonAddr(address);
            } catch {
                setJettonAddr(null);
            }
        }
        getJettonAddr();
    }, [ownerAddr]);

    return (
        <div className={classes.wallet}>
            <h2 className={classes.label}> Wallet</h2>
            <ChangeAddress
                value={ownerAddr ? ownerAddr.toString() : ''}
                label="Owner address"
                btnEnabled={minter ? true : false}
                onClick={() => setOpenOwnerAddr(true)} />

            <ChangeAddress
                value={jettonAddr ? jettonAddr.toString() : ''}
                label="Jetton address"
                btnEnabled={true}
                onClick={() => setOpenJettonAddr(true)} />

            <Supply
                label='Jettons:'
                value={jettons == null ? null : jettons} />

            <div className={classes.refreshBox}>
                <IconButton onClick={() => setInnerRefresh(!innerRefresh)}>
                    <RefreshIcon className={classes.refreshIcon} />
                </IconButton>
            </div>

            <ModalText
                open={openOwnerAddr}
                handleClose={() => setOpenOwnerAddr(false)}
                onClickBtn={ownerAddrChange} />
            <ModalText
                open={openJettonAddr}
                handleClose={() => setOpenJettonAddr(false)}
                onClickBtn={ownerJettonChange} />
        </div>

    )
}

