const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");
const { abi } = require("../../artifacts/contracts/Deb0xERC20.sol/Deb0xERC20.json")
const { abiLib } = require("../../artifacts/contracts/MathX.sol/MathX.json")
const { NumUtils } = require("../utils/NumUtils.ts");

describe("Test burn functionality", async function() {
    let DBXenContract, DBXENViewContract, DBXenERC20, XENContract, aliceInstance, bobInstance, deanInstance;
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

        const Deb0x = await ethers.getContractFactory("Deb0x");
        DBXenContract = await Deb0x.deploy(ethers.constants.AddressZero, XENContract.address);
        await DBXenContract.deployed();

        const Deb0xViews = await ethers.getContractFactory("Deb0xViews");
        DBXENViewContract = await Deb0xViews.deploy(DBXenContract.address);
        await DBXENViewContract.deployed();

        const dbxAddress = await DBXenContract.dbx()
        DBXenERC20 = new ethers.Contract(dbxAddress, abi, hre.ethers.provider)

        aliceInstance = XENContract.connect(alice);
        bobInstance = XENContract.connect(bob);
        deanInstance = XENContract.connect(dean);
        carolInstance = XENContract.connect(carol);
    });


    it("Simple burn check", async() => {
        await aliceInstance.claimRank(100);
        await hre.ethers.provider.send("evm_increaseTime", [60 * 60 * 100 * 24])
        await hre.ethers.provider.send("evm_mine")
        await aliceInstance.claimMintReward();
        let actualBalance = await XENContract.balanceOf(alice.address);

        await XENContract.connect(alice).approve(DBXenContract.address, ethers.utils.parseEther("250000"))
        await DBXenContract.connect(alice).burnBatch(1, ethers.constants.AddressZero, 0, 0, { value: ethers.utils.parseEther("1") });

        let balanceAfterBurn = await XENContract.balanceOf(alice.address);
        let tokensForOneBatch = ethers.utils.parseEther("250000");
        let expectedBalanceAfterBurn = BigNumber.from(actualBalance.toString()).sub(BigNumber.from(tokensForOneBatch));
        expect(expectedBalanceAfterBurn).to.equal(balanceAfterBurn);
    });

    it("Multiple batches burn", async() => {
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
        await DBXenContract.connect(alice).burnBatch(2, ethers.constants.AddressZero, 0, 0, { value: ethers.utils.parseEther("1") });

        let balanceAfterBurn = await XENContract.balanceOf(alice.address);
        let tokensForOneBatch = ethers.utils.parseEther("500000");
        let expectedBalanceAfterBurn = BigNumber.from(actualBalance.toString()).sub(BigNumber.from(tokensForOneBatch));
        expect(expectedBalanceAfterBurn).to.equal(balanceAfterBurn);

        await aliceInstance.claimRank(100);
        await hre.ethers.provider.send("evm_increaseTime", [60 * 60 * 101 * 24])
        await hre.ethers.provider.send("evm_mine")
        await aliceInstance.claimMintReward();
        await aliceInstance.claimRank(100);
        await hre.ethers.provider.send("evm_increaseTime", [60 * 60 * 101 * 24])
        await hre.ethers.provider.send("evm_mine")
        await aliceInstance.claimMintReward();
        await aliceInstance.claimRank(100);
        await hre.ethers.provider.send("evm_increaseTime", [60 * 60 * 101 * 24])
        await hre.ethers.provider.send("evm_mine")
        await aliceInstance.claimMintReward();
        await aliceInstance.claimRank(100);
        await hre.ethers.provider.send("evm_increaseTime", [60 * 60 * 101 * 24])
        await hre.ethers.provider.send("evm_mine")
        await aliceInstance.claimMintReward();

        let actualBalanceAfterFirstBurn = await XENContract.balanceOf(alice.address);
        await XENContract.connect(alice).approve(DBXenContract.address, ethers.utils.parseEther("1250000"))
        await DBXenContract.connect(alice).burnBatch(5, ethers.constants.AddressZero, 0, 0, { value: ethers.utils.parseEther("1") });

        let balanceAfterFirstBurn = await XENContract.balanceOf(alice.address);
        let tokensForFiveBatch = ethers.utils.parseEther("1250000");
        let expectedBalanceAfterFirstBurn = BigNumber.from(actualBalanceAfterFirstBurn.toString()).sub(BigNumber.from(tokensForFiveBatch));
        expect(expectedBalanceAfterFirstBurn).to.equal(balanceAfterFirstBurn);
    });

    it("Multiple batches, multiple users", async() => {
        await aliceInstance.claimRank(100);
        await bobInstance.claimRank(100);
        await deanInstance.claimRank(100);
        await hre.ethers.provider.send("evm_increaseTime", [60 * 60 * 102 * 24])
        await hre.ethers.provider.send("evm_mine")

        await aliceInstance.claimMintReward();
        await aliceInstance.claimRank(100);
        await bobInstance.claimMintReward();
        await bobInstance.claimRank(100);
        await deanInstance.claimMintReward();
        await deanInstance.claimRank(100);

        await hre.ethers.provider.send("evm_increaseTime", [60 * 60 * 102 * 24])
        await hre.ethers.provider.send("evm_mine")
        await aliceInstance.claimMintReward();
        await bobInstance.claimMintReward();
        await deanInstance.claimMintReward();

        let actualBalanceAlice = await XENContract.balanceOf(alice.address);
        await XENContract.connect(alice).approve(DBXenContract.address, ethers.utils.parseEther("750000"))
        await DBXenContract.connect(alice).burnBatch(3, ethers.constants.AddressZero, 0, 0, { value: ethers.utils.parseEther("1") });

        let balanceAfterBurnAlice = await XENContract.balanceOf(alice.address);
        let tokensForThreeBatches = ethers.utils.parseEther("750000");
        let expectedBalanceAfterBurnAlice = BigNumber.from(actualBalanceAlice.toString()).sub(BigNumber.from(tokensForThreeBatches));
        expect(expectedBalanceAfterBurnAlice).to.equal(balanceAfterBurnAlice);
        expect(await XENContract.userBurns(alice.address)).to.equal(BigNumber.from(tokensForThreeBatches))

        let actualBalanceBob = await XENContract.balanceOf(bob.address);
        await XENContract.connect(bob).approve(DBXenContract.address, ethers.utils.parseEther("750000"))
        await DBXenContract.connect(bob).burnBatch(3, ethers.constants.AddressZero, 0, 0, { value: ethers.utils.parseEther("1") });
        let balanceAfterBurnBob = await XENContract.balanceOf(bob.address);
        let expectedBalanceAfterBurnBob = BigNumber.from(actualBalanceBob.toString()).sub(BigNumber.from(tokensForThreeBatches));
        expect(expectedBalanceAfterBurnBob).to.equal(balanceAfterBurnBob);
        expect(await XENContract.userBurns(bob.address)).to.equal(BigNumber.from(tokensForThreeBatches))

        await aliceInstance.claimRank(100);
        await bobInstance.claimRank(100);
        await deanInstance.claimRank(100);
        await carolInstance.claimRank(100);

        await hre.ethers.provider.send("evm_increaseTime", [60 * 60 * 102 * 24])
        await hre.ethers.provider.send("evm_mine")
        await aliceInstance.claimMintReward();
        await bobInstance.claimMintReward();
        await deanInstance.claimMintReward();
        await carolInstance.claimMintReward();

        let actualBalanceCarol = await XENContract.balanceOf(carol.address);
        await XENContract.connect(carol).approve(DBXenContract.address, ethers.utils.parseEther("250000"))
        await DBXenContract.connect(carol).burnBatch(1, ethers.constants.AddressZero, 0, 0, { value: ethers.utils.parseEther("1") });
        let balanceAfterBurnCarol = await XENContract.balanceOf(carol.address);
        let tokensForOneBatches = ethers.utils.parseEther("250000");
        let expectedBalanceCarol = BigNumber.from(actualBalanceCarol.toString()).sub(BigNumber.from(tokensForOneBatches));
        expect(expectedBalanceCarol).to.equal(balanceAfterBurnCarol);
        expect(await XENContract.userBurns(carol.address)).to.equal(BigNumber.from(tokensForOneBatches))

        let actualBalanceAfterFirstBurnAlice = await XENContract.balanceOf(alice.address);
        await XENContract.connect(alice).approve(DBXenContract.address, ethers.utils.parseEther("750000"))
        await DBXenContract.connect(alice).burnBatch(3, ethers.constants.AddressZero, 0, 0, { value: ethers.utils.parseEther("1") });
        let balanceAfterSecondBurnAlice = await XENContract.balanceOf(alice.address);
        let expectedBalanceAfterFirstBurnAlice = BigNumber.from(actualBalanceAfterFirstBurnAlice.toString()).sub(BigNumber.from(tokensForThreeBatches));
        expect(expectedBalanceAfterFirstBurnAlice).to.equal(balanceAfterSecondBurnAlice);
        expect(await XENContract.userBurns(alice.address)).to.equal(BigNumber.from(tokensForThreeBatches).mul(BigNumber.from("2")))
    });

    it.only("Claim fees after bunr action", async() => {
        console.log("REWARD PE CICLUL CURENT 1   " + await DBXenContract.currentCycleReward());
        await aliceInstance.claimRank(100);
        await bobInstance.claimRank(100);
        await hre.ethers.provider.send("evm_increaseTime", [60 * 60 * 100 * 24])
        await hre.ethers.provider.send("evm_mine")
        console.log("REWARD PE CICLUL CURENT 2   " + await DBXenContract.currentCycleReward());
        await aliceInstance.claimMintReward();
        await aliceInstance.claimRank(100);
        await bobInstance.claimMintReward();
        await bobInstance.claimRank(100);

        await hre.ethers.provider.send("evm_increaseTime", [60 * 60 * 122 * 24])
        await hre.ethers.provider.send("evm_mine")
        await aliceInstance.claimMintReward();
        await bobInstance.claimMintReward();
        console.log("REWARD PE CICLUL CURENT 3  " + await DBXenContract.currentCycleReward());
        let actualBalanceAlice = await XENContract.balanceOf(alice.address);
        await XENContract.connect(alice).approve(DBXenContract.address, ethers.utils.parseEther("750000"))
        await DBXenContract.connect(alice).burnBatch(1, ethers.constants.AddressZero, 0, 0, { value: ethers.utils.parseEther("1") });
        console.log("REWARD PE CICLUL CURENT 4    " + await DBXenContract.currentCycleReward());
        // let balanceAfterBurnAlice = await XENContract.balanceOf(alice.address);
        // let tokensForThreeBatches = ethers.utils.parseEther("750000");
        // let expectedBalanceAfterBurnAlice = BigNumber.from(actualBalanceAlice.toString()).sub(BigNumber.from(tokensForThreeBatches));
        // expect(expectedBalanceAfterBurnAlice).to.equal(balanceAfterBurnAlice);
        // expect(await XENContract.userBurns(alice.address)).to.equal(BigNumber.from(tokensForThreeBatches))

        let actualBalanceBob = await XENContract.balanceOf(bob.address);
        await XENContract.connect(bob).approve(DBXenContract.address, ethers.utils.parseEther("750000"))
        await DBXenContract.connect(bob).burnBatch(1, ethers.constants.AddressZero, 0, 0, { value: ethers.utils.parseEther("1") });

        // let balanceAfterBurnBob = await XENContract.balanceOf(bob.address);
        // let expectedBalanceAfterBurnBob = BigNumber.from(actualBalanceBob.toString()).sub(BigNumber.from(tokensForThreeBatches));
        // expect(expectedBalanceAfterBurnBob).to.equal(balanceAfterBurnBob);
        // expect(await XENContract.userBurns(bob.address)).to.equal(BigNumber.from(tokensForThreeBatches))
        console.log("CICLUL CURENT " + await DBXenContract.getCurrentCycle());
        console.log("REWARD PE CICLUL CURENT " + await DBXenContract.currentCycleReward());
        await hre.ethers.provider.send("evm_increaseTime", [60 * 60 * 24])
        await hre.ethers.provider.send("evm_mine")

        console.log("CICLUL CURENT " + await DBXenContract.getCurrentCycle());
        console.log(await DBXenERC20.balanceOf(alice.address));
        console.log("after CLAIM " + await DBXenContract.accRewards(alice.address))
        await DBXenContract.connect(alice).claimRewards()
        console.log(await DBXenERC20.balanceOf(alice.address));
        console.log("*************************")
        console.log(await DBXenERC20.balanceOf(bob.address));
        console.log("after CLAIM " + await DBXenContract.accRewards(bob.address))
        await DBXenContract.connect(bob).claimRewards()
        console.log(await DBXenERC20.balanceOf(bob.address));
        console.log("CICLUL CURENT " + await DBXenContract.getCurrentCycle());
        console.log("REWARD PE CICLUL CURENT " + await DBXenContract.currentCycleReward());
        console.log(NumUtils.day(2))
    });

})