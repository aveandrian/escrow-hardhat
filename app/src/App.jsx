import { useEffect, useState } from 'react';
import NewContract from './components/NewContract';
import ExistingContracts from './components/ExistingContracts';
import server from './server';
import { signer } from './components/eth_provider';

function App() {
  const [escrows, setEscrows] = useState([]);

  useEffect(()=>{
    async function getEscrows(){
      let address = await signer.getAddress();
      const userPosts = await server.get(`/contracts/${address}`)
      setEscrows(userPosts.data)
    };
    getEscrows()
  }, [])


  return (
    <>
      <div className='main-container' >
      <NewContract escrows={escrows} setEscrows={setEscrows} />
      <ExistingContracts escrows={escrows} setEscrows={setEscrows}/>
      </div>
    </>
  );
}

export default App;
