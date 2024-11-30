import { create } from 'zustand';

// Định nghĩa kiểu dữ liệu của file
interface File {
  id: string; // ID duy nhất
  name: string; // Tên file
  content: string; // Nội dung file
}

interface WorkspaceState {
  files: File[]; // Danh sách file
  activeFileId: string | null; // File đang mở
  setActiveFile: (id: string) => void; // Chọn file để mở
  addFile: (name: string, content: string) => void; // Thêm file mới
  updateFileContent: (id: string, content: string) => void; // Cập nhật nội dung file
}

// Khởi tạo các file có sẵn với nội dung
const initialFiles: File[] = [
  // Thư mục contracts
  { id: '1', name: 'contracts/1_Storage.sol', content: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Storage {
    uint256 private data;

    function setData(uint256 _data) public {
        data = _data;
    }

    function getData() public view returns (uint256) {
        return data;
    }
}
` },
  { id: '2', name: 'contracts/2_Owner.sol', content: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Owner {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }
}
` },
  { id: '3', name: 'contracts/3_Ballot.sol', content: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Ballot {
    struct Candidate {
        string name;
        uint256 voteCount;
    }

    mapping(uint256 => Candidate) public candidates;

    function addCandidate(uint256 _id, string memory _name) public {
        candidates[_id] = Candidate(_name, 0);
    }
}
` },

  // Thư mục scripts
  { id: '4', name: 'scripts/deploy_with_ethers.ts', content: `// Deployment script using Ethers.js
import { ethers } from "ethers";

async function main() {
    const Storage = await ethers.getContractFactory("Storage");
    const storage = await Storage.deploy();
    console.log("Storage deployed to:", storage.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
` },
  { id: '5', name: 'scripts/deploy_with_web3.ts', content: `// Deployment script using Web3.js
const Web3 = require('web3');
const web3 = new Web3('http://localhost:8545');

async function deploy() {
    const accounts = await web3.eth.getAccounts();
    const result = await new web3.eth.Contract(/* ABI */)
        .deploy({ data: '/* Bytecode */' })
        .send({ from: accounts[0], gas: '1000000' });
    console.log('Contract deployed to:', result.options.address);
}

deploy();
` },
  { id: '6', name: 'scripts/ethers-lib.ts', content: `// Ethers.js library functions
import { ethers } from "ethers";

export function getProvider() {
    return new ethers.providers.JsonRpcProvider("http://localhost:8545");
}
` },
  { id: '7', name: 'scripts/web3-lib.ts', content: `// Web3.js library functions
const Web3 = require('web3');

export function getWeb3() {
    return new Web3('http://localhost:8545');
}
` },

  // Thư mục tests
  { id: '8', name: 'tests/Ballot_test.sol', content: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "truffle/Assert.sol";
import "../contracts/Ballot.sol";

contract TestBallot {
    function testAddCandidate() public {
        Ballot ballot = new Ballot();
        ballot.addCandidate(1, "Alice");
        Assert.equal(ballot.candidates(1).name, "Alice", "Candidate name should be Alice");
    }
}
` },
  { id: '9', name: 'tests/storage.tests.js', content: `const Storage = artifacts.require("Storage");

contract("Storage", (accounts) => {
    it("should store and retrieve data", async () => {
        const storage = await Storage.new();
        await storage.setData(42);
        const data = await storage.getData();
        assert.equal(data.toString(), "42", "Data should be 42");
    });
});
` },
];

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  files: initialFiles, // Sử dụng các file có sẵn với nội dung
  activeFileId: null,
  setActiveFile: (id) => set({ activeFileId: id }),
  addFile: (name, content) =>
    set((state) => ({
      files: [...state.files, { id: Math.random().toString(), name, content }],
    })),
  updateFileContent: (id, content) =>
    set((state) => ({
      files: state.files.map((file) =>
        file.id === id ? { ...file, content } : file
      ),
    })),
}));
