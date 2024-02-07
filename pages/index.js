import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);

  // User profile state
  const [name, setName] = useState("Chethan");
  const [email, setEmail] = useState("chethan@example.com");
  const [phone, setPhone] = useState("1234567890");
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedAmount, setSelectedAmount] = useState(10);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const accounts = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(accounts);
    }
  };

  const handleAccount = (accounts) => {
    if (accounts.length > 0) {
      console.log("Account connected: ", accounts[0]);
      setAccount(accounts[0]);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({
      method: "eth_requestAccounts",
    });
    handleAccount(accounts);

    // once the wallet is set, we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(
      contractAddress,
      atmABI,
      signer
    );

    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  };

  const deposit = async () => {
    if (atm) {
      let tx = await atm.deposit(selectedAmount);
      await tx.wait();
      getBalance();
    }
  };

  const withdraw = async () => {
    if (atm) {
      let tx = await atm.withdraw(selectedAmount);
      await tx.wait();
      getBalance();
    }
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset user details to their original values
    setName("Chethan");
    setEmail("chethan@example.com");
    setPhone("1234567890");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can implement the logic to update the user profile information
    // For now, let's just log the values
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Phone:", phone);

    // Reset edit mode and update profile details
    setIsEditing(false);
    setSuccessMessage("Profile updated successfully!");
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  const handleAmountChange = (e) => {
    setSelectedAmount(parseInt(e.target.value));
  };

  const initUser = () => {
    // Check to see if the user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask to use this ATM.</p>;
    }

    // Check to see if the user is connected. If not, connect to their account
    if (!account) {
      return (
        <button onClick={connectAccount}>
          Please connect your Metamask wallet
        </button>
      );
    }

    if (balance === undefined) {
      getBalance();
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Your Balance: {balance}</p>
        <div>
          <label>
            Select Amount to Deposit/Withdraw:
            <select value={selectedAmount} onChange={handleAmountChange}>
              {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((amount) => (
                <option key={amount} value={amount}>
                  {amount} ETH
                </option>
              ))}
            </select>
          </label>
          <button onClick={deposit}>Deposit</button>
          <button onClick={withdraw}>Withdraw</button>
        </div>

        {/* User profile section */}
        <div style={{ backgroundColor: "lightgreen", padding: "10px", margin: "10px" }}>
          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <label>
                Name:
                <input
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                />
              </label>
              <label>
                Phone:
                <input
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                />
              </label>
              <button type="submit">Update Profile</button>
              <button type="button" onClick={handleCancelEdit}>
                Cancel
              </button>
            </form>
          ) : (
            <div>
              <h2>User Profile</h2>
              <p>Name: {name}</p>
              <p>Email: {email}</p>
              <p>Phone: {phone}</p>
              <button onClick={handleEdit}>Edit</button>
            </div>
          )}
          {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
        </div>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <div className="container">
      <header>
        <h1>Welcome to the Metacrafters ATM!</h1>
      </header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
          background-color: #f0f0f0; /* Light gray background */
          min-height: 100vh; /* Full height */
        }
      `}</style>
    </div>
  );
}
