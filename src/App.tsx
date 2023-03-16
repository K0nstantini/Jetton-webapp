import './App.css';
import { TonConnectButton } from '@tonconnect/ui-react';
import { useTonConnect } from './hooks/useTonConnect';
import { useState } from 'react';
import { OpenedContract } from 'ton-core';
import { MinterBox } from './components/minter/Minter';
import { JettonAction } from './components/jettonActions/JettonActions';
import Minter from './contracts/minter';
import { WalletBox } from './components/wallet/Wallet';
import { JETTON_CONTRACTS_REF, SOURCE_REF } from './Constants';
import { useTonClient } from './hooks/useTonClient';
import { TypeNet, TypesNet } from './components/typeNet/TypeNet';

function App() {
  const { sender } = useTonConnect();

  const clientTest = useTonClient(TypesNet.Testnet);
  const clientMain = useTonClient(TypesNet.Mainnet);

  const [typeNet, setTypeNet] = useState(TypesNet.Testnet);

  const [minter, setMinter] = useState<OpenedContract<Minter>>();
  const [refresh, setRefresh] = useState(false);

  function getClient() {
    if (!clientMain || !clientTest) return null;
    return typeNet == TypesNet.Mainnet ? clientMain : clientTest;
  }

  return (
    <div className='App'>
      <h1 className='Header'>Jetton playground</h1>
      <div className="ConnectBox">
        <TypeNet handleChange={type => setTypeNet(type)} />
        <TonConnectButton />
      </div>
      <div className='Container'>
        <JettonAction
          sender={sender}
          client={getClient()}
          minter={minter ? minter : null}
          refresh={() => setRefresh(!refresh)} />
        <MinterBox
          sender={sender}
          client={getClient()}
          refresh={refresh}
          minterChange={contract => setMinter(contract)} />
        <WalletBox
          client={getClient()}
          minter={minter ? minter : null}
          refresh={refresh} />
        <div className="Refs">
          <a href={SOURCE_REF} target="_blank">Source</a>
          <a href={JETTON_CONTRACTS_REF} target="_blank">Jetton contracts</a>
        </div>
      </div>
    </div >
  );
}

export default App
