import './App.css';
import { TonConnectButton } from '@tonconnect/ui-react';
import { useTonConnect } from './hooks/useTonConnect';
import { useState } from 'react';
import { OpenedContract } from 'ton-core';
import { MinterBox } from './components/minter/Minter';
import { JettonAction } from './components/jettonActions/JettonActions';
import Minter from './contracts/minter';
import { WalletBox } from './components/wallet/Wallet';

function App() {
  const { sender } = useTonConnect();

  const [minter, setMinter] = useState<OpenedContract<Minter>>();
  const [refresh, setRefresh] = useState(false);


  const minterChange = (contract: OpenedContract<Minter>) => {
    setMinter(contract);
  }

  return (
    <div className='App'>
      <h1 className='Header'>Jetton playground</h1>
      <TonConnectButton className='Connect' />
      <div className='Container'>
        <JettonAction
          sender={sender}
          minter={minter ? minter : null}
          refresh={() => setRefresh(!refresh)} />
        <MinterBox
          sender={sender}
          refresh={refresh}
          minterChange={minterChange} />
        <WalletBox
          sender={sender}
          minter={minter ? minter : null}
          refresh={refresh} />
      </div>
    </div >
  );
}

export default App
