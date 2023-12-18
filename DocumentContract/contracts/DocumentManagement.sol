// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DocumentManagement {
    address public owner;

    struct Document {
        string ipfsHash;
        string verificationCode;
    }

    struct Student {
        string name;
        address studentId;
        mapping(string => Document) documents; // verificationCode'a göre belge izlemek için
        uint256 documentCount; // Yeni eklenen belge sayısını izlemek için
    }

    mapping(address => Student) public students;

    event DocumentAdded(address indexed studentAddress, string ipfsHash);
    event DocumentVerified(address indexed studentAddress, string ipfsHash);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function addStudent(string memory _name, address _studentId) public onlyOwner {
        students[_studentId].name = _name;
        students[_studentId].studentId = _studentId;
    }

    function addDocument(address studentAddress, string memory _ipfsData, string memory _verificationCode) public onlyOwner {
        string memory ipfsHash = generateIPFSHash(_ipfsData);

        students[studentAddress].documents[_verificationCode] = Document(ipfsHash, _verificationCode);
        students[studentAddress].documentCount++;
        emit DocumentAdded(studentAddress, ipfsHash);
    }

    function verifyDocument(address studentAddress, string memory _verificationCode) public {
        require(isDocumentExist(studentAddress, _verificationCode), "Document does not exist");
        emit DocumentVerified(studentAddress, students[studentAddress].documents[_verificationCode].ipfsHash);
    }

    function isDocumentExist(address studentAddress, string memory _verificationCode) public view returns (bool) {
        return bytes(students[studentAddress].documents[_verificationCode].ipfsHash).length > 0;
    }

    function viewDocument(address studentAddress, string memory _verificationCode) public view returns (string memory) {
        require(isDocumentExist(studentAddress, _verificationCode), "Document does not exist");
        return students[studentAddress].documents[_verificationCode].ipfsHash;
    }

    // Basitleştirilmiş bir IPFS hash oluşturma fonksiyonu
    function generateIPFSHash(string memory content) internal pure returns (string memory) {
        // Bu örnek sadece içeriğin keccak256 özetini alarak basitleştirilmiş bir IPFS hash'i oluşturur
        return toBase58(bytes32(keccak256(bytes(content))));
    }

    // Keccak256 özetini base58 formatına dönüştüren yardımcı fonksiyon
    function toBase58(bytes32 value) internal pure returns (string memory) {
        bytes memory alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
        uint256 base = 58;

        // Keccak256 özetini base58 formatına dönüştür
        bytes memory result = new bytes(46);
        uint256 resultIndex = 0;
        uint256 valueCopy = uint256(value);

        while (valueCopy > 0) {
            result[resultIndex++] = alphabet[valueCopy % base];
            valueCopy /= base;
        }

        // Ters çevir
        for (uint256 i = 0; i < resultIndex / 2; i++) {
            bytes1 temp = result[i];
            result[i] = result[resultIndex - i - 1];
            result[resultIndex - i - 1] = temp;
        }
        return string(result);
    }
}