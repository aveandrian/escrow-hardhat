import Escrow from "./Escrow";

export default function ExistingContracts({escrows, setEscrows}){
    return (
        <div className="existing-contracts">
        <h1> Existing Contracts </h1>

        <div id="container">
          {escrows.map((escrow) => {
            return <Escrow key={escrow.contract} {...escrow}  />;
          })}
        </div>
      </div> 
    )
}