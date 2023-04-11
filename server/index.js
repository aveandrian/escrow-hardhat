const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());


function Contract(contract, depositor, beneficiary, arbiter, value){
    this.contract = contract;
    this.depositor = depositor;
    this.beneficiary = beneficiary;
    this.arbiter = arbiter;
    this.value = value;
}

let contracts = [];

app.post("/new-contract", (req, res) => {
    const { depositor, beneficiary, arbiter, value, contract } = req.body;
    const newContract = new Contract(contract, depositor, beneficiary, arbiter, value)
    contracts.push(newContract)
    res.send({ depositor, beneficiary, arbiter, value, contract });
  }
);
  
app.get("/contracts/:depositor", (req, res) => {
    const { depositor } = req.params;
    let depositorsContracts = []
    for(let i=0; i<contracts.length;i++){
        if(contracts[i].depositor == depositor || contracts[i].arbiter == depositor){
            depositorsContracts.push(contracts[i])
        }    
    }
    res.send(depositorsContracts);
  }
);

app.delete("/delete-contract/:contract", (req, res) => {
    const { contract } = req.params;
    for(let i=0; i<contracts.length;i++){
        if(contracts[i].contract == contract){
            contracts.splice(i, 1);
            res.status(200).send("Contract " + contract + " deleted");
            return
        }    
    }
   
  }
);

app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
  });
  
