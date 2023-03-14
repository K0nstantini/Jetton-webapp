import './App.css';
import { TonConnectButton } from '@tonconnect/ui-react';
import { useTonConnect } from './hooks/useTonConnect';
import { useState } from 'react';
import { OpenedContract } from 'ton-core';
import { MinterBox } from './components/minter/Minter';
import { JettonAction } from './components/jettonActions/JettonActions';
import Minter from './contracts/minter';

function App() {
  const { sender } = useTonConnect();

  const [minter, setMinter] = useState<OpenedContract<Minter>>();
  const [refreshMinter, setRefreshMinter] = useState(false);


  const minterChange = (contract: OpenedContract<Minter>) => {
    setMinter(contract);
  }

  return (
    <div className='App'>
      <div className='Container'>
        <div className='Connect'>
          <TonConnectButton />
        </div>
        <JettonAction
          sender={sender}
          minter={minter ? minter : null}
          refresh={() => setRefreshMinter(!refreshMinter)} />
        <MinterBox
          sender={sender}
          refresh={refreshMinter}
          minterChange={minterChange} />
      </div>
    </div >
  );
}

export default App
