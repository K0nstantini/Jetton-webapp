import { useEffect, useState } from 'react';
import { Address, OpenedContract, Sender } from 'ton-core';
import Minter from '../../contracts/minter';
import Wallet from '../../contracts/wallet';
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

    const [ownerAddr, setOwnerAddr] = useState<Address | null>();
    const [jettonAddr, setJettonAddr] = useState<Address | null>();
    const [jettons, setJettons] = useState<null | bigint>();

    const [jettonWallet, setJettonWallet] = useState<OpenedContract<Wallet>>();

    const [openOwnerAddr, setOpenOwnerAddr] = useState(false);
    const [openJettonAddr, setOpenJettonAddr] = useState(false);

    const ownerAddrChange = (addr: string) => {
        setOpenOwnerAddr(false);
        try {
            setOwnerAddr(Address.parse(addr));
        } catch { }
    }

    const ownerJettonChange = (addr: string) => {
        setOpenJettonAddr(false);
        try {
            setJettonAddr(Address.parse(addr));
        } catch { }
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
            try {
                const { jettonAmount, address } = await jettonWallet.getData();
                setJettons(jettonAmount);
                if (ownerAddr?.toString() != address.toString()) setOwnerAddr(address);
            } catch {
                setOwnerAddr(null);
            }
        }
        getData();
    }, [jettonWallet, refresh]);

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
                value={jettons ? jettons : null} />

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

