import { Contract, ContractProvider, Sender, Address, Cell, beginCell, parseTuple } from "ton-core";
import { TupleItemSlice } from "ton-core/dist/tuple/tuple";

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
      value: "0.22",
      body: messageBody
    });
  }

  async sendSetRoyalty(provider: ContractProvider, via: Sender, percent: number) {
    const sign = percent >= 0 ? 0 : 1;
    const splitted = splitNumber(percent);
    if (!splitted) return;
    const { num_part, denom_part } = splitted;

    const messageBody = beginCell()
      .storeUint(6, 32)
      .storeUint(0, 64)
      .storeUint(sign, 1)
      .storeUint(num_part, 32)
      .storeUint(denom_part, 32)
      .endCell();

    await provider.internal(via, {
      value: "0.01",
      body: messageBody
    })
  }

  async sendChangeAdmin(provider: ContractProvider, via: Sender, address: Address) {
    const messageBody = beginCell()
      .storeUint(3, 32)
      .storeUint(0, 64)
      .storeAddress(address)
      .endCell();

    await provider.internal(via, {
      value: "0.01",
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

  async getWalletAddress(provider: ContractProvider, address: Address) {
    const param = {
      type: 'slice',
      cell: beginCell().storeAddress(address).endCell()
    } as TupleItemSlice;
    const { stack } = await provider.get("get_wallet_address", [param]);
    return stack.readAddress();
  }

}

function splitNumber(num: number) {
  const positive = Math.abs(num);
  const integerPart = Math.trunc(positive);
  if (positive == integerPart) {
    return {
      num_part: integerPart,
      denom_part: 100
    }
  }

  const str = String(positive);
  var splitted = str.split(`.`, 2);
  if (splitted.length != 2) return;
  const fracPart = splitted[1];
  const num_part = Number(`${integerPart}${fracPart}`)
  const denom_part = 100 * Math.pow(10, (fracPart.length));

  return {
    num_part,
    denom_part
  }
};

