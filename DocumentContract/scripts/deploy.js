const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  const Document = await ethers.getContractFactory("DocumentManagement");
  const document = await Document.deploy();
  

  console.log("Contract address:", document.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
