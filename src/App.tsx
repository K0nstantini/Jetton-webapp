import './App.css';
import { TonConnectButton } from '@tonconnect/ui-react';
import { useTonConnect } from './hooks/useTonConnect';
import { useEffect, useState } from 'react';
import { Button, Alert, Collapse, Snackbar } from '@mui/material';
import { useTonClient } from './hooks/useTonClient';
import { useAsyncInitialize } from './hooks/useAsyncInitialize';
import { Address, OpenedContract } from 'ton-core';
import Minter from './contracts/minter';
import { ModalText } from './components/ModalText';
import { ModalNumber } from './components/ModalNumber';
import { ChangeAddress } from './components/changeAddress/ChangeAddress';
import { MyAlert } from './components/MyAlert';
import { Royalty } from './components/royalty/Royalty';
import { Supply } from './components/supply/Supply';
import { MinterBox } from './components/minter/Minter';

function App() {
  const { sender, connected } = useTonConnect();

  const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));
  const client = useTonClient();
  const [royalty, setRoyalty] = useState<null | number>();
  const [supply, setSupply] = useState<null | bigint>();

  const [refreshMinter, setRefreshMinter] = useState(false);
  const [enabledMinter, setEnabledMinter] = useState(false);

  const [minterAddr, setMinterAddr] = useState('');
  const [adminAddr, setAdminAddr] = useState<null | string>();
  const [newAdminAddr, setNewAdminAddr] = useState<null | string>();
  const [newRoyalty, setNewRoyalty] = useState<null | number>();


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
    const contract = new Minter(
      Address.parse(minterAddr)
    );
    return client.open(contract) as OpenedContract<Minter>;
  }, [minterAddr])

  useEffect(() => {
    setEnabledMinter(connected && minterContract ? true : false);
  }, [connected && minterContract]);


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
  }, [minterContract, refreshMinter]);

  useEffect(() => {
    async function changeAdminAddr() {
      if (!minterContract || !newAdminAddr || adminAddr == newAdminAddr) return;
      const addr = Address.parse(newAdminAddr);
      await minterContract.sendChangeAdmin(sender, addr);
      await sleep(20000);
      setRefreshMinter(!refreshMinter);
    }
    changeAdminAddr();
  }, [newAdminAddr]);

  useEffect(() => {
    async function changeRoyalty() {
      if (!minterContract || !newRoyalty || royalty == newRoyalty) return;
      await minterContract.sendSetRoyalty(sender, newRoyalty);
      await sleep(20000);
      setRefreshMinter(!refreshMinter);
    }
    changeRoyalty();
  }, [newRoyalty]);


  const [openMintAddr, setOpenMintAddr] = useState(false);
  const [openAdminAddr, setOpenAdminAddr] = useState(false);
  const [openRoyalty, setOpenRoyalty] = useState(false);


  const minterChange = (addr: Address) => {
    console.log(addr);
  }


  return (
    <div className='App'>
      <div className='Container'>
        <TonConnectButton />

        <MinterBox sender={sender} minterChange={minterChange} />

        {/* <div className='Minter'>
          <b>Minter</b>
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

          <Supply value={supply ? supply : null} />

        </div>

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
        /> */}

        {/* <MyAlert
          open={openWarning.open}
          message={openWarning.message}
          handleClose={() => setOpenWarning({ open: false, message: '' })}
        />

        <MyAlert
          open={openWarning}
          message={'Minter contract not selected'}
          handleClose={() => setOpenWarning(false)}
        /> */}


      </div>
    </div >
  );
}

export default App
