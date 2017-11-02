import test from 'tape'
import supertest from 'supertest'

import server from '../src/server'

const alarm = {
      "address": "0xcca95e580bbbd04851ebfb85f77fd46c9b91f11c",
      "events": ["LockedBalance"],
      "hook": "https://decentraland.org/",
      "confirmations": 6,
      "abi": "[{\"constant\":false,\"inputs\":[{\"name\":\"target\",\"type\":\"address\"}],\"name\":\"setTargetContract\",\"outputs\":[],\"payable\":false,\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"totalLocked\",\"outputs\":[{\"name\":\"\",\"type\":\"uint256\"}],\"payable\":false,\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"_acceptingDeposits\",\"type\":\"bool\"}],\"name\":\"changeContractState\",\"outputs\":[],\"payable\":false,\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"_from\",\"type\":\"address\"},{\"name\":\"mana\",\"type\":\"uint256\"}],\"name\":\"lockMana\",\"outputs\":[],\"payable\":false,\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"manaToken\",\"outputs\":[{\"name\":\"\",\"type\":\"address\"}],\"payable\":false,\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"owner\",\"outputs\":[{\"name\":\"\",\"type\":\"address\"}],\"payable\":false,\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"landClaim\",\"outputs\":[{\"name\":\"\",\"type\":\"address\"}],\"payable\":false,\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"name\":\"\",\"type\":\"address\"}],\"name\":\"lockedBalance\",\"outputs\":[{\"name\":\"\",\"type\":\"uint256\"}],\"payable\":false,\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"acceptingDeposits\",\"outputs\":[{\"name\":\"\",\"type\":\"bool\"}],\"payable\":false,\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"transferOwnership\",\"outputs\":[],\"payable\":false,\"type\":\"function\"},{\"inputs\":[{\"name\":\"_token\",\"type\":\"address\"}],\"payable\":false,\"type\":\"constructor\"},{\"payable\":true,\"type\":\"fallback\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"name\":\"user\",\"type\":\"address\"},{\"indexed\":false,\"name\":\"mana\",\"type\":\"uint256\"}],\"name\":\"LockedBalance\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"name\":\"target\",\"type\":\"address\"}],\"name\":\"LandClaimContractSet\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"name\":\"user\",\"type\":\"address\"},{\"indexed\":false,\"name\":\"value\",\"type\":\"uint256\"},{\"indexed\":false,\"name\":\"data\",\"type\":\"bytes\"}],\"name\":\"LandClaimExecuted\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"name\":\"_acceptingDeposits\",\"type\":\"bool\"}"
}

test('POST new alarm', (t) => {
    supertest(server)
    .post('/api/alarms')
    .send(alarm)
    .expect(201)
    .end((err, res) => {
        t.error(err, 'Response is not a server error')
        t.same(typeof res.body, 'object', 'Body is an object')
        t.same(typeof res.body.result.id, 'string', 'Body contains a mongo id')
        t.end()
    });
})

test('404 alarm not found', (t) => {
    supertest(server)
        .get('/api/alarms/123')
        .expect(404)
        .end((err, res) => {
            t.error(err, 'Response is not a server error')
            t.same(typeof res.body, 'object', 'Body is an object')
            t.end()
        })
})

test.onFinish(() => process.exit(0));
