import { Contract, ContractProvider, Address, Cell, Sender, beginCell } from "ton-core";

export default class Wallet implements Contract {

  constructor(readonly address: Address, readonly init?: { code: Cell, data: Cell }) { }


  async sendJettons(provider: ContractProvider, via: Sender, destination: Address, amount: number) {
    const messageBody = beginCell()
      .storeUint(0xf8a7ea5, 32)
      .storeUint(0, 64)
      .storeCoins(amount)
      .storeAddress(destination)
      .storeAddress(null)
      .storeDict(null)
      .storeCoins(0)
      .storeMaybeRef(null)
      .endCell();
    await provider.internal(via, {
      value: "0.1",
      body: messageBody
    });
  }

  async sendBurn(provider: ContractProvider, via: Sender, response: Address, amount: number) {
    const messageBody = beginCell()
      .storeUint(0x595f07bc, 32)
      .storeUint(0, 64)
      .storeCoins(amount)
      .storeAddress(response)
      .endCell();
    await provider.internal(via, {
      value: "0.03",
      body: messageBody
    });
  }


  async getData(provider: ContractProvider) {
    const { stack } = await provider.get("get_wallet_data", []);
    return {
      jettonAmount: stack.readBigNumber(),
      address: stack.readAddress()
    };
  }
}