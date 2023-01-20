const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");
const { abi } = require("../../artifacts/contracts/DBXenERC20.sol/DBXenERC20.json")
const { abiLib } = require("../../artifacts/contracts/MathX.sol/MathX.json")
const { NumUtils } = require("../utils/NumUtils.ts");

describe.only("Test claimFee", async function() {
    let DBXenContract, DBXENViewContract, DBXenERC20, XENContract, aliceInstance, bobInstance, deanInstance, frontend;
    let alice, bob, carol, dean;
    beforeEach("Set enviroment", async() => {
        [alice, bob, carol, dean, messageReceiver, feeReceiver] = await ethers.getSigners();

        const lib = await ethers.getContractFactory("MathX");
        const library = await lib.deploy();

        const xenContract = await ethers.getContractFactory("XENCrypto", {
            libraries: {
                MathX: library.address
            }
        });

        XENContract = await xenContract.deploy();
        await XENContract.deployed();

        const DBXen = await ethers.getContractFactory("DBXen");
        DBXenContract = await DBXen.deploy(ethers.constants.AddressZero, XENContract.address);
        await DBXenContract.deployed();

        const DBXenViews = await ethers.getContractFactory("DBXenViews");
        DBXENViewContract = await DBXenViews.deploy(DBXenContract.address);
        await DBXENViewContract.deployed();

        const dbxAddress = await DBXenContract.dxn()
        DBXenERC20 = new ethers.Contract(dbxAddress, abi, hre.ethers.provider)

        aliceInstance = XENContract.connect(alice);
        bobInstance = XENContract.connect(bob);
        deanInstance = XENContract.connect(dean);
        carolInstance = XENContract.connect(carol);
        frontend = DBXenContract.connect(feeReceiver)
    });

    it(`Single user claim fees without frontend fees`, async() => {
        await aliceInstance.claimRank(100);
        await hre.ethers.provider.send("evm_increaseTime", [60 * 60 * 101 * 24])
        await hre.ethers.provider.send("evm_mine")
        await aliceInstance.claimMintReward();
        await aliceInstance.claimRank(100);
        await hre.ethers.provider.send("evm_increaseTime", [60 * 60 * 101 * 24])
        await hre.ethers.provider.send("evm_mine")
        await aliceInstance.claimMintReward();

        let actualBalance = await XENContract.balanceOf(alice.address);
        await XENContract.connect(alice).approve(DBXenContract.address, ethers.utils.parseEther("500000"))
        await DBXenContract.connect(alice).burnBatch(2, feeReceiver.address, 0, 0, { value: ethers.utils.parseEther("1") });

        let balanceAfterBurn = await XENContract.balanceOf(alice.address);
        let tokensForOneBatch = ethers.utils.parseEther("500000");
        let expectedBalanceAfterBurn = BigNumber.from(actualBalance.toString()).sub(BigNumber.from(tokensForOneBatch));
        expect(expectedBalanceAfterBurn).to.equal(balanceAfterBurn);

        await hre.ethers.provider.send("evm_increaseTime", [60 * 60 * 24])
        await hre.ethers.provider.send("evm_mine")

        let aliceUnclaimedFee = await DBXENViewContract.getUnclaimedFees(alice.address);
        await DBXenContract.connect(alice).claimFees();

        const feesClaimed = await DBXenContract.queryFilter("FeesClaimed")
        let totalFeesClaimed = BigNumber.from("0")
        for (let entry of feesClaimed) {
            totalFeesClaimed = totalFeesClaimed.add(entry.args.fees)
        }
        expect(aliceUnclaimedFee).to.equal(totalFeesClaimed)
    });

    it(`Multiple users claim fees without frontend fees`, async() => {
        await aliceInstance.claimRank(100);
        await bobInstance.claimRank(100);
        await carolInstance.claimRank(100);
        await hre.ethers.provider.send("evm_increaseTime", [60 * 60 * 101 * 24])
        await hre.ethers.provider.send("evm_mine")

        await aliceInstance.claimMintReward();
        await bobInstance.claimMintReward();
        await carolInstance.claimMintReward();
        await aliceInstance.claimRank(100);
        await bobInstance.claimRank(100);
        await carolInstance.claimRank(100);

        await hre.ethers.provider.send("evm_increaseTime", [60 * 60 * 101 * 24])
        await hre.ethers.provider.send("evm_mine")

        await aliceInstance.claimMintReward();
        await bobInstance.claimMintReward();
        await carolInstance.claimMintReward();

        await XENContract.connect(alice).approve(DBXenContract.address, ethers.utils.parseEther("500000"))
        await DBXenContract.connect(alice).burnBatch(2, feeReceiver.address, 0, 0, { value: ethers.utils.parseEther("1") });

        await XENContract.connect(bob).approve(DBXenContract.address, ethers.utils.parseEther("500000"))
        await DBXenContract.connect(bob).burnBatch(2, feeReceiver.address, 0, 0, { value: ethers.utils.parseEther("1") });

        await XENContract.connect(carol).approve(DBXenContract.address, ethers.utils.parseEther("500000"))
        await DBXenContract.connect(carol).burnBatch(2, feeReceiver.address, 0, 0, { value: ethers.utils.parseEther("1") });

        await hre.ethers.provider.send("evm_increaseTime", [60 * 60 * 24])
        await hre.ethers.provider.send("evm_mine")

        let aliceUnclaimedFee = await DBXENViewContract.getUnclaimedFees(alice.address);
        let bobUnclaimedFee = await DBXENViewContract.getUnclaimedFees(bob.address);
        let carolUnclaimedFee = await DBXENViewContract.getUnclaimedFees(carol.address);
        let totalUnclaimedFees = BigNumber.from(aliceUnclaimedFee).add(BigNumber.from(bobUnclaimedFee).add(BigNumber.from(carolUnclaimedFee)));

        await DBXenContract.connect(alice).claimFees();
        await DBXenContract.connect(bob).claimFees();
        await DBXenContract.connect(carol).claimFees();

        const feesClaimed = await DBXenContract.queryFilter("FeesClaimed")
        let totalFeesClaimed = BigNumber.from("0")
        for (let entry of feesClaimed) {
            totalFeesClaimed = totalFeesClaimed.add(entry.args.fees)
        }

        expect(totalUnclaimedFees).to.equal(totalFeesClaimed)
    });

});