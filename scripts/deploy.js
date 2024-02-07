const { ethers } = require("ethers");
const Assessment = require("../artifacts/contracts/Assessment.sol/Assessment.json");

async function main() {
    const initBalance = 1000; // Example initial balance
    const name = "Chethan"; // Updated name to Chethan
    const email = "chethan@example.com"; // Updated email to a sample email
    const phone = "1234567890"; // Updated phone to a sample phone number

    const provider = new ethers.providers.JsonRpcProvider(); // Replace with your provider
    const signer = provider.getSigner(); // Replace with your signer

    const contractFactory = new ethers.ContractFactory(Assessment.abi, Assessment.bytecode, signer);

    // Deploy the contract with the provided arguments
    const deployedContract = await contractFactory.deploy(initBalance, name, email, phone);

    console.log("Contract deployed at address:", deployedContract.address);
}

main().catch(error => {
    console.error("Error deploying contract:", error);
    process.exit(1);
});
