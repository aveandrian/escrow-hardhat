const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('Escrow', function () {
  let contract;
  let depositor;
  let beneficiary;
  let arbiter;
  const deposit = ethers.utils.parseEther('1');
  beforeEach(async () => {
    depositor = ethers.provider.getSigner(0);
    beneficiary = ethers.provider.getSigner(1);
    arbiter = ethers.provider.getSigner(2);
    const Escrow = await ethers.getContractFactory('Escrow');
    contract = await Escrow.deploy(
      arbiter.getAddress(),
      beneficiary.getAddress(),
      {
        value: deposit,
      }
    );
    await contract.deployed();
  });

  it('should be funded initially', async function () {
    let balance = await ethers.provider.getBalance(contract.address);
    expect(balance).to.eq(deposit);
  });

  describe('after approval from address other than the arbiter', () => {
    it('should revert', async () => {
      await expect(contract.connect(beneficiary).approve()).to.be.reverted;
    });
  });

  describe('after approval from the arbiter', () => {
    it('should transfer balance to beneficiary', async () => {
      const before = await ethers.provider.getBalance(beneficiary.getAddress());
      const approveTxn = await contract.connect(arbiter).approve();
      await approveTxn.wait();
      const after = await ethers.provider.getBalance(beneficiary.getAddress());
      expect(after.sub(before)).to.eq(deposit);
    });
  });

  describe('after destroying from address other than the depositor', () => {
    it('should be reverted',async ()=>{
      await expect(contract.connect(beneficiary).destroy()).to.be.reverted;
    })
  })

  describe('after destroying from the depositor address', () => {
    it('funds should be transfered back to depositor',async ()=>{
      const before = await ethers.provider.getBalance(depositor.getAddress());
      const approveTxn = await contract.connect(depositor).destroy();
      const receipt = await approveTxn.wait();
      const gas = ethers.BigNumber.from(receipt.effectiveGasPrice * receipt.gasUsed);
      const after = await ethers.provider.getBalance(depositor.getAddress());
      
      expect(await ethers.provider.getBalance(contract.address)).eq(0)
      expect(before.add(deposit).sub(gas)).eq(after);
    })
  })
});
