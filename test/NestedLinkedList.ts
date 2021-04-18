import { ethers } from "hardhat";
import { assert, expect } from "chai"
import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("Linked List Contract", () => {
    let res: any;
    let res2: any;
    let res3: any;
    let instance: Contract;
    let alice: SignerWithAddress;
    let bob: SignerWithAddress;
    let carol: SignerWithAddress;
    let dave: SignerWithAddress;
    let eve: SignerWithAddress
  
    before(async () => {
        const NestedLinkedList = await ethers.getContractFactory("NestedLinkedList");
        [alice, bob, carol, dave, eve] = await ethers.getSigners();
        instance = await NestedLinkedList.deploy();
    })

    describe("Check init", async() => {
        it("Should return the name", async() => {
        
          res = await instance.name()
          assert.equal(res, 'Nested Linked List')
        })
      })

    describe('Linked-list functionality', async() => {
    it('sets linked-list head and checks number of operators equals zero', async() => {
        await instance.setHead(1)
        res = await instance.getNumOperators(1)
        assert.equal(res, 0)
    })

    it('adds operator to linked-list', async() => {
        // Should be false
        res = await instance.isOperator(1, alice.address)
        assert.equal(res, false, 'Something is very wrong if this fails')
 
        // Add Alice as operator
         await instance.addOperator(1, alice.address)
 
         // Check that Alice was properly added
         res = await instance.isOperator(1, alice.address)
         assert.equal(res, true, 'Alice was not properly added to the list')
 
         // Check the numbered list was updated
         res = await instance.getNumOperators(1)
         assert.equal(res, 1, 'List was not properly updated')
     })

     it('adds more operators to list', async() => {
        // Add more petters
        await instance.addOperator(1, bob.address)
        await instance.addOperator(1, carol.address)
        await instance.addOperator(1, dave.address)

        // Check numOperator list
        res = await instance.getNumOperators(1)
        assert.equal(res, 4, 'List not updated')

        // Check that each user is recognized
        res = await instance.isOperator(1, bob.address)
        res2 = await instance.isOperator(1, carol.address)
        res3 = await instance.isOperator(1, dave.address)

        assert.equal(res, true, 'Bob')
        assert.equal(res2, true, 'Carol')
        assert.equal(res3, true, 'Dave')
    })

    it('returns an array with all addresses', async() => {
        res = await instance.getOperators(1)

        expect(res).to.be.a('array')
        assert.equal(res[3], alice.address)
        assert.equal(res[2], bob.address)
        assert.equal(res[1], carol.address)
        assert.equal(res[0], dave.address)
    })

    it('checks for false positives', async() => {
        expect(res[1]).to.not.equal(alice.address)
        expect(res).to.not.be.a('string')
        
        res = await instance.isOperator(1, eve.address)
        assert.equal(res, false)
    })

    it('removes operator', async() => {
        // Recheck address
        res = await instance.isOperator(1, carol.address)
        assert.equal(res, true)

        // Check number of operators is 4
        let numOp = await instance.getNumOperators(1)
        assert.equal(numOp, 4)

        // Remove carol.address as operator
        await instance.removeOperator(1, carol.address)

        // Check that carol.address is removed
        res = await instance.isOperator(1, carol.address)
        assert.equal(res, false)

        // Check the number of operators is reduced to 3
        numOp = await instance.getNumOperators(1)
        assert.equal(numOp, 3)
    })

    it('checks that everyone else is still in list', async() => {
        res = await instance.isOperator(1, alice.address)
        res2 = await instance.isOperator(1, bob.address)
        res3 = await instance.isOperator(1, dave.address)
        
        assert.equal(res, true)
        assert.equal(res2, true)
        assert.equal(res3, true)
    })

    it('should return an array with all operators sans carol', async() => {
        res = await instance.getOperators(1)

        assert.equal(res[2], alice.address, 'Alice')
        assert.equal(res[1], bob.address, 'Bob')
        assert.equal(res[0], dave.address, 'Dave')
    })

    })
})