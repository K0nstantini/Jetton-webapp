import { Contract, ContractProvider, Sender, Address, Cell, beginCell } from "ton-core";

export default class Minter implements Contract {

  constructor(readonly address: Address, readonly init?: { code: Cell, data: Cell }) { }

  async sendMint(provider: ContractProvider, via: Sender, destination: Address, amount: number) {
    const messageBody = beginCell()
      .storeUint(21, 32)
      .storeUint(0, 64)
      .storeAddress(destination)
      .storeCoins(200000000)
      .storeRef(
        beginCell()
          .storeUint(395134233, 32)
          .storeUint(0, 64)
          .storeCoins(amount)
          .storeAddress(this.address)
          .storeAddress(destination)
          .storeCoins(0)
          .storeBit(false)
          .endCell()
      )
      .endCell();

    await provider.internal(via, {
      value: "0.2",
      body: messageBody
    });
  }

  async sendSetRoyalty(provider: ContractProvider, via: Sender, percent: number) {
    const sign = percent > 0 ? 0 : 1;
    const num_part = Math.abs(percent);
    const denom_part = 100;
    const messageBody = beginCell()
      .storeUint(6, 32)
      .storeUint(0, 64)
      .storeUint(sign, 1)
      .storeUint(num_part, 32)
      .storeUint(denom_part, 32)
      .endCell();

    await provider.internal(via, {
      value: "0.05",
      body: messageBody
    });
  }

  async sendChangeAdmin(provider: ContractProvider, via: Sender, address: Address) {
    const messageBody = beginCell()
      .storeUint(3, 32)
      .storeUint(0, 64)
      .storeAddress(address)
      .endCell();

    await provider.internal(via, {
      value: "0.05",
      body: messageBody
    });
  }

  async getRoyalty(provider: ContractProvider) {
    const { stack } = await provider.get("get_royalty", []);
    const sign = stack.readNumber();
    const num = stack.readNumber();
    const denom = stack.readNumber();
    return (num / denom) * (sign ? - 1 : 1) * 100
  }

  async getData(provider: ContractProvider) {
    const { stack } = await provider.get("get_jetton_data", []);
    const jettonAmount = stack.readBigNumber();
    stack.readNumber();
    const adminAddr = stack.readAddress();
    return {
      jettonAmount,
      adminAddr
    };
  }

}

