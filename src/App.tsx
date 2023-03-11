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
import { ChangeAddress } from './components/ChangeAddress/ChangeAddress';
import { MyAlert } from './components/MyAlert';
import { Royalty } from './components/Royalty/Royalty';

function App() {
  const { sender, connected } = useTonConnect();

  const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));
  const client = useTonClient();
  const [jettonAmount, setJettonAmount] = useState<null | bigint>();
  const [royalty, setRoyalty] = useState<null | number>();


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
      setJettonAmount(null);
      const { jettonAmount, adminAddr } = await minterContract.getData();
      setJettonAmount(jettonAmount);
      setAdminAddr(adminAddr.toString());
      setRoyalty(null);
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
      await sleep(10000);
      setRefreshMinter(!refreshMinter);
    }
    changeAdminAddr();
  }, [newAdminAddr]);

  useEffect(() => {
    async function changeRoyalty() {
      if (!minterContract || !newRoyalty || royalty == newRoyalty) return;
      // console.log(`${new Date().toLocaleTimeString()}: Start set royalty`);
      await minterContract.sendSetRoyalty(sender, newRoyalty);
      await sleep(10000);
      setRefreshMinter(!refreshMinter);
    }
    changeRoyalty();
  }, [newRoyalty]);


  const [openMintAddr, setOpenMintAddr] = useState(false);
  const [openAdminAddr, setOpenAdminAddr] = useState(false);
  const [openRoyalty, setOpenRoyalty] = useState(false);

  // const [openWarning, setOpenWarning] = useState({ open: false, message: '' });

  // const onClickAdminAddrChange = () => {
  //   if (!minterAddr) {
  //     setOpenWarning({ open: true, message: "Minter contract not selected" })
  //     return;
  //   } else if (!connected) {
  //     setOpenWarning({ open: true, message: "Wallet not connected" })
  //     return;
  //   } else {
  //     setOpenAdminAddr(true);
  //   }
  // }

  return (
    <div className='App'>
      <div className='Container'>
        <TonConnectButton />

        <div className='Minter'>
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


          {/* <div className='Royalty'>
            <h3>{`Comission: ${royalty}%`}</h3>
            <Button
              variant="contained"
              disabled={!enabledMinter}
              onClick={() => setOpenRoyalty(true)}>
              change
            </Button>
          </div> */}

          <div className='JettonAmount'>
            <h3>{`Jetton amount: ${jettonAmount}`}</h3>
          </div>
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
        />

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


        {/* <Snackbar
          open={openWarning}
          autoHideDuration={6000}
          onClose={() => setOpenWarning(false)}>
          <Alert
            onClose={() => setOpenWarning(false)}
            severity="warning"
            sx={{ width: '100%' }}>
            Not connected
          </Alert>
        </Snackbar> */}

        {/* <Snackbar
          open={openWarning}
          autoHideDuration={6000}
          onClose={() => setOpenWarning(false)}
          message="Not connected"
          action={action}
        /> */}

        {/* <Collapse in={openWarning}>
          <Alert severity="warning">
            This is a warning alert — check it out!
          </Alert>
        </Collapse> */}

      </div>
    </div >
  );
}

export default App
