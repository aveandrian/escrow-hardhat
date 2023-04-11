import { ethers } from 'ethers';
import AddressInput from './AddressInput';
import deploy from '../deploy';
import server from '../server';
import provider from './eth_provider';

const signer = provider.getSigner();

export default function NewContract({escrows, setEscrows}){
  
    async function newContract() {
      const account = await signer.getAddress();
      const beneficiary = document.getElementById('beneficiary').value;
      if(!ethers.utils.isAddress(beneficiary)){
        console.log("Beneficiary is not a valid address")
        return;
      }
  
      const arbiter = document.getElementById('arbiter').value;
      if(!ethers.utils.isAddress(arbiter)) {
        console.log("Arbiter is not a valid address")
        return;
      }
      const value = document.getElementById('ethers').value;
      const escrowContract = await deploy(signer, arbiter, beneficiary, ethers.utils.parseEther(value));
      await escrowContract.deployed();

      await server.post('/new-contract', {
        contract: escrowContract.address, 
        arbiter: arbiter, 
        beneficiary: beneficiary, 
        depositor: account, 
        value: value 
      })

      const newEscrow = {
        contract: escrowContract.address, 
        arbiter: arbiter, 
        beneficiary: beneficiary, 
        depositor: account, 
        value: value 
      }
      
      setEscrows([...escrows, newEscrow])
    }

    return (
    <>
      
            <div className="new-contract">
                <h1> New Contract </h1>
                    <AddressInput id='arbiter' name='Arbiter Address' />
                    <AddressInput id='beneficiary' name='Beneficiary Address' />
                <label>
                    Deposit Amount (in ETH)
                    <input type="text" id="ethers" placeholder='0.01' />
                </label>

                <div
                  className="button"
                  id="deploy"
                  onClick={async(e) => {
                    e.preventDefault();
                    await newContract();
                  }}
                >
                  Deploy
                </div>
            </div>
    </>
    )
}