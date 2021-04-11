const { assert, expect } = require("chai")

describe("LinkedList contract", function () {

  let Petter
  let instance
  let res
  let alice
  let bob
  let carol
  let dave
  let eve

  before(async() => {
    Petter = await ethers.getContractFactory("Petter");
    [alice, bob, carol, dave, eve] = await ethers.getSigners();

    instance = await Petter.deploy();
  })

  describe("Check init", async() => {
    it("Should return the name", async() => {
    
      res = await instance.name()
      assert.equal(res, 'Petter')
    })
  })
  describe('Linked-list functionality', async() => {
    it('sets linked-list head and checks number of petters equals zero', async() => {
      await instance.setHead(1)
      res = await instance.getNumPetters(1)
      assert.equal(res, 0)
    })

   it('adds petter to linked-list', async() => {
       // Should be false
       res = await instance.isPetter(1, alice.address)
       assert.equal(res, false, 'Something is very wrong if this fails')

       // Add Alice as petter
        await instance.addPetter(1, alice.address)

        // Check that Alice was properly added
        res = await instance.isPetter(1, alice.address)
        assert.equal(res, true, 'Alice was not properly added to the list')

        // Check the numbered list was updated
        res = await instance.getNumPetters(1)
        assert.equal(res, 1, 'List was not properly updated')
    })

    it('adds more petters to list', async() => {
        // Add more petters
        await instance.addPetter(1, bob.address)
        await instance.addPetter(1, carol.address)
        await instance.addPetter(1, dave.address)

        // Check numPetter list
        res = await instance.getNumPetters(1)
        assert.equal(res, 4, 'List not updated')

        // Check that each user is recognized
        res = await instance.isPetter(1, bob.address)
        res2 = await instance.isPetter(1, carol.address)
        res3 = await instance.isPetter(1, dave.address)

        assert.equal(res, true, 'Bob')
        assert.equal(res2, true, 'Carol')
        assert.equal(res3, true, 'Dave')
    })

    it('returns an array with all addresses', async() => {
        res = await instance.getPetters(1)

        expect(res).to.be.a('array')
        assert.equal(res[3], alice.address)
        assert.equal(res[2], bob.address)
        assert.equal(res[1], carol.address)
        assert.equal(res[0], dave.address)
    })

    it('checks for false positives', async() => {
        expect(res[1]).to.not.equal(alice.address)
        expect(res).to.not.be.a('string')
        
        res = await instance.isPetter(1, eve.address)
        assert.equal(res, false)
    })

    it('removes petter', async() => {
        // Recheck address
        res = await instance.isPetter(1, carol.address)
        assert.equal(res, true)

        // Check number of petters is 4
        let numPet = await instance.getNumPetters(1)
        assert.equal(numPet, 4)

        // Remove carol.address as petter
        await instance.removePetter(1, carol.address)

        // Check that carol.address is removed
        res = await instance.isPetter(1, carol.address)
        assert.equal(res, false)

        // Check the number of petters is reduced to 3
        numPet = await instance.getNumPetters(1)
        assert.equal(numPet, 3)
    })

    it('checks that everyone else is still in list', async() => {
        res = await instance.isPetter(1, alice.address)
        res2 = await instance.isPetter(1, bob.address)
        res3 = await instance.isPetter(1, dave.address)
        
        assert.equal(res, true)
        assert.equal(res2, true)
        assert.equal(res3, true)
    })

    it('should return an array with all petters sans carol', async() => {
        res = await instance.getPetters(1)

        assert.equal(res[2], alice.address, 'Alice')
        assert.equal(res[1], bob.address, 'Bob')
        assert.equal(res[0], dave.address, 'Dave')
    })
  
  })
})