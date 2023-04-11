import { signer, abi } from "./eth_provider";
import { ethers } from "ethers";
import server from "../server";

export async function approve(escrowContract, signer) {
  const approveTxn = await escrowContract.connect(signer).approve();
  await approveTxn.wait();
}

export async function destroy(escrowContract, signer) {
  const destroyTxn = await escrowContract.connect(signer).destroy();
  await destroyTxn.wait();
}

export default function Escrow({
  contract,
  arbiter,
  beneficiary,
  value,
}) {
    const escrowContract = new ethers.Contract( contract , abi , signer )
    const handleApprove = async () => {
      escrowContract.on('Approved', () => {
        document.getElementById(contract).className =
          'complete';
        document.getElementById(contract).innerText =
          "✓ It's been approved!";
        document.getElementById(contract).style.pointerEvents = "none";
        let el = document.getElementById("destroy_"+contract);
        el.parentNode.removeChild(el);
      });
      await approve(escrowContract, signer);
    }

  const handleDestroy = async () => {
    await destroy(escrowContract, signer);
    await server.delete('/delete-contract/'+escrowContract.address)
    escrowContract.on('Destroyed', () => {
      document.getElementById(contract).className =
          'destroyed';
      document.getElementById(contract).innerText =
          "✓ It's been destroyed!";
      document.getElementById(contract).style.pointerEvents = "none";
      let el = document.getElementById("destroy_"+contract);
      el.parentNode.removeChild(el);
      console.log("Contract destroyed!: ", escrowContract.address)
    });
  }

  return (
    <div className="existing-contract">
      <ul className="fields">
        <li>
          <div> Arbiter </div>
          <div> {arbiter} </div>
        </li>
        <li>
          <div> Beneficiary </div>
          <div> {beneficiary} </div>
        </li>
        <li>
          <div> Value </div>
          <div> {value} ETH </div> 
        </li>
        <div
          className="button"
          id={contract}
          onClick={async(e) => {
            e.preventDefault();
            let address = await signer.getAddress()
            if(address === arbiter) 
              handleApprove();
          }}
        >
          Approve
        </div>

        <div
          className="button"
          id={"destroy_" + contract}
          onClick={async(e) => {
            e.preventDefault();
            handleDestroy();
          }}
        >
          Cancel contract
        </div>
      </ul>
    </div>
  );
}
