import { useEffect, useState } from 'react';
import Minter from '../contracts/minter';
import { useTonClient } from './useTonClient';
import { useAsyncInitialize } from './useAsyncInitialize';
import { useTonConnect } from './useTonConnect';
import { Address, OpenedContract } from 'ton-core';

export function useMinterContract(address: string) {
  const client = useTonClient();
  const [val, setVal] = useState<null | string>();
  const { sender } = useTonConnect();

  const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

  const minterContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new Minter(
      Address.parse(address)
    );
    return client.open(contract) as OpenedContract<Minter>;
  }, [client])

  // console.log(minterContract);

  useEffect(() => {
    async function getValue() {
      if (!minterContract) return;
      setVal(null);
      const val = await minterContract.getData();
      setVal(val.toString());
      await sleep(5000); // sleep 5 seconds and poll value again
      getValue();
    }
    getValue();
  }, [minterContract]);

  return {
    value: val,
    address: minterContract?.address.toString(),
    sendSetRoyalty: () => {
      return minterContract?.sendSetRoyalty(sender, 1);
    },
  };
}
