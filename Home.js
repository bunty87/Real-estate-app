import { ethers } from 'ethers'

const Home = ({ home, provider, account, escrow, togglePop }) => {

  const buyHandler = async () => {
    try {
      const signer = provider.getSigner()

      const buyer = await signer.getAddress()

      console.log("Buyer:", buyer)

      // 🔥 deposit earnest money (example 10 ETH)
      const transaction = await escrow.connect(signer).depositEarnest(home.id, {
        value: ethers.utils.parseEther(home.attributes[0].value.toString())
      })

      await transaction.wait()

      console.log("✅ Deposit successful")

    } catch (error) {
      console.error("❌ Buy Error:", error)
    }
  }

  const approveHandler = async () => {
    try {
      const signer = provider.getSigner()

      const transaction = await escrow.connect(signer).approveSale(home.id)

      await transaction.wait()

      console.log("✅ Approved")

    } catch (error) {
      console.error("❌ Approve Error:", error)
    }
  }

  return (
    <div className="home">

      <div className="home__details">
        <img src={home.image} alt="Home" />

        <div className="home__info">
          <h2>{home.name}</h2>

          <p>
            {home.attributes[2].value} bds |
            {home.attributes[3].value} ba |
            {home.attributes[4].value} sqft
          </p>

          <p>{home.address}</p>

          <h3>{home.attributes[0].value} ETH</h3>

          <button onClick={buyHandler} className="home__buy">
            Buy
          </button>

          <button onClick={approveHandler} className="home__contact">
            Approve & Sell
          </button>

          <button onClick={togglePop} className="home__close">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default Home