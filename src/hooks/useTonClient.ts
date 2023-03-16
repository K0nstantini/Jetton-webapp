import { getHttpEndpoint } from '@orbs-network/ton-access';
import { TonClient } from 'ton';
import { TypesNet } from '../components/typeNet/TypeNet';
import { useAsyncInitialize } from './useAsyncInitialize';

export function useTonClient(typeNet: TypesNet) {
  const network = typeNet == TypesNet.Mainnet ? 'mainnet' : 'testnet';
  return useAsyncInitialize(
    async () =>
      new TonClient({
        endpoint: await getHttpEndpoint({ network }),
      })
  );
}
