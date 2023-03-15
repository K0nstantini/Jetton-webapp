import { useEffect, useState } from 'react';
import { Address, OpenedContract, Sender } from 'ton-core';
import Minter from '../../contracts/minter';
import { useAsyncInitialize } from '../../hooks/useAsyncInitialize';
import { useTonClient } from '../../hooks/useTonClient';
import { ChangeAddress } from '../changeAddress/ChangeAddress';
import { ModalNumber } from '../ModalNumber';
import { ModalText } from '../ModalText';
import { Royalty } from '../royalty/Royalty';
import { Supply } from '../supply/Supply';
import classes from './Minter.module.css';

type MinterProps = {
    sender: Sender,
    refresh: boolean,
    minterChange: (minter: OpenedContract<Minter>) => void,
}

export function MinterBox({ sender, refresh: outerRefresh, minterChange }: MinterProps) {

    const client = useTonClient();
    const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

    const [openMintAddr, setOpenMintAddr] = useState(false);
    const [openAdminAddr, setOpenAdminAddr] = useState(false);
    const [openRoyalty, setOpenRoyalty] = useState(false);


    const [royalty, setRoyalty] = useState<null | number>();
    const [supply, setSupply] = useState<null | bigint>();

    const [minterAddr, setMinterAddr] = useState('');
    const [adminAddr, setAdminAddr] = useState<null | string>();
    const [newAdminAddr, setNewAdminAddr] = useState<null | string>();
    const [newRoyalty, setNewRoyalty] = useState<null | number>();

    const [innerRefresh, setInnerRefresh] = useState(false);

    const minterAddrChange = (addr: string) => {
        setOpenMintAddr(false);
        setMinterAddr(addr);
    }

    const adminAddrChange = (addr: string) => {
        setOpenAdminAddr(false);
        setNewAdminAddr(addr);
    }


    const royaltyChange = (royalty: number) => {
        setOpenRoyalty(false);
        setNewRoyalty(royalty);
    }

    const minterContract = useAsyncInitialize(async () => {
        if (!client) return;
        const contract = new Minter(Address.parse(minterAddr));
        const openedContract = client.open(contract) as OpenedContract<Minter>;
        minterChange(openedContract);
        return openedContract;
    }, [minterAddr])

    useEffect(() => {
        async function getData() {
            if (!minterContract) return;
            setSupply(null);
            setRoyalty(null);
            const { jettonAmount, adminAddr } = await minterContract.getData();
            setSupply(jettonAmount);
            setAdminAddr(adminAddr.toString());
            const royalty = await minterContract.getRoyalty();
            setRoyalty(royalty);
        }
        getData();
    }, [minterContract, innerRefresh, outerRefresh]);

    useEffect(() => {
        async function changeAdminAddr() {
            if (!minterContract || !newAdminAddr || adminAddr == newAdminAddr) return;
            const addr = Address.parse(newAdminAddr);
            await minterContract.sendChangeAdmin(sender, addr);
            await sleep(30000);
            setInnerRefresh(!innerRefresh);
        }
        changeAdminAddr();
    }, [newAdminAddr]);

    useEffect(() => {
        async function changeRoyalty() {
            if (!minterContract || !newRoyalty || royalty == newRoyalty) return;
            await minterContract.sendSetRoyalty(sender, newRoyalty);
            await sleep(30000);
            setInnerRefresh(!innerRefresh);
        }
        changeRoyalty();
    }, [newRoyalty]);

    return (
        <div className={classes.minter}>
            <h2 className={classes.label}> Minter</h2>
            <ChangeAddress
                value={minterContract ? minterContract?.address.toString() : ""}
                label="Minter address"
                btnEnabled={true}
                onClick={() => setOpenMintAddr(true)} />

            <ChangeAddress
                value={adminAddr ? adminAddr : ""}
                label="Admin address"
                btnEnabled={minterContract ? true : false}
                onClick={() => setOpenAdminAddr(true)} />

            <Royalty
                value={royalty ? royalty : null}
                btnEnabled={minterContract ? true : false}
                onClick={() => setOpenRoyalty(true)} />

            <Supply
                label='Supply:'
                value={supply ? supply : null} />

            <ModalText
                open={openMintAddr}
                handleClose={() => setOpenMintAddr(false)}
                onClickBtn={minterAddrChange}
            />

            <ModalText
                open={openAdminAddr}
                handleClose={() => setOpenAdminAddr(false)}
                onClickBtn={adminAddrChange}
            />

            <ModalNumber
                open={openRoyalty}
                handleClose={() => setOpenRoyalty(false)}
                onClickBtn={royaltyChange}
            />
        </div>
    )
}