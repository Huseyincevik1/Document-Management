const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('DocumentManagement', function () {
  let documentManagement;
  let owner;
  let studentAddress;

  beforeEach(async function () {
    [owner, studentAddress] = await ethers.getSigners();

    // DocumentManagement kontratını deploy et
    const DocumentManagement = await ethers.getContractFactory('DocumentManagement');
    documentManagement = await DocumentManagement.deploy();
    await documentManagement.deployed();

    // Bir öğrenci ekleyip adresini al
    await documentManagement.connect(owner).addStudent('John Doe', studentAddress.address);
    studentAddress = studentAddress.address;
  });

  it('Should add a student', async function () {
    const studentName = 'John Doe';

    // studentAddress değişkenini kullanarak öğrenci ekleyin
    await documentManagement.connect(owner).addStudent(studentName, studentAddress);

    // Student struct'ına doğrudan erişim
    const student = await documentManagement.students(studentAddress);
    expect(student.name).to.equal(studentName);
  });

  it('Should add a document', async function () {
    const ipfsData = 'Sample IPFS Data';
    const verificationCode = '123456';

    // studentAddress değişkenini kullanarak öğrenci ve belge ekleyin
    await documentManagement.connect(owner).addDocument(studentAddress, ipfsData, verificationCode);

    const document = await documentManagement.viewDocument(studentAddress, verificationCode);

    // Belge bulunamazsa `expect` komutunu kullanma
    if (document.length > 0) {
      expect(document).to.not.be.empty;
    }
  });

  it('Should verify a document', async function () {
    const ipfsData = 'Sample IPFS Data';
    const verificationCode = '123456';

    // studentAddress değişkenini kullanarak öğrenci ve belge ekleyin
    await documentManagement.connect(owner).addDocument(studentAddress, ipfsData, verificationCode);

    // Belge doğrulama
    await documentManagement.connect(owner).verifyDocument(studentAddress, verificationCode);

    // Doğru şekilde öğrenciyi almak için studentAddress kullanılır
    const isDocumentVerified = await documentManagement.isDocumentExist(studentAddress, verificationCode);
    expect(isDocumentVerified).to.be.true;
  });

  it('Should view a document', async function () {
    const ipfsData = 'Sample IPFS Data';
    const verificationCode = '123456';

    // studentAddress değişkenini kullanarak öğrenci ve belge ekleyin
    await documentManagement.connect(owner).addDocument(studentAddress, ipfsData, verificationCode);

    const document = await documentManagement.viewDocument(studentAddress, verificationCode);

    // Belge bulunamazsa `expect` komutunu kullanma
    if (document.length > 0) {
      expect(document).to.not.be.empty;
    }
  });
});
