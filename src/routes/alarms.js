import { Router } from 'express'
import { Validator, ValidationError } from 'express-json-validator-middleware'
import { AlarmSchema } from '../schemas/alarms'
import * as db from '../lib/db'

const router = Router()
const validator = new Validator({allErrors: true})
const validate = validator.validate.bind(validator)

const ALARMS_DB_KEY = 'alarms'

const getResponseSchema = (response={}) => {
    return {
        ok: response.ok || true,
        error: response.error || '',
        result: response.result|| {}
    }
}

router.post('/alarms', validate({ body: AlarmSchema }), (req, res) => {

    db.save(ALARMS_DB_KEY, req.body)
        .then(dbResult => {
            console.log(`Document Inserted OK: ${!!JSON.stringify(dbResult.result.ok)}`)
            res.status(201).json(getResponseSchema({
                result: {
                    id: dbResult.insertedIds[0]
                }
            }))
        })
        .catch(err => {
            res.status(500).json(getResponseSchema({
                ok: false,
                error: err
            }))
        })
})

router.get('/alarms/:id', (req, res) => {
    db.get(ALARMS_DB_KEY, { "_id": req.params.id })
        .then(result => {
            if (!result) return Promise.reject(result)
            res.status(200).json(getResponseSchema({result}))
        })
        .catch(err => {
            res.status(404).json(getResponseSchema({
                ok: false,
                error: err
            }))
        })
})

router.delete('/alarms/:id', (req, res) => {

    db.remove(ALARMS_DB_KEY, { "_id": req.params.id })
        .then( result => {
            console.log(`Remove from database result: ${JSON.stringify(result)}`)
            res.json(204)
        })
        .catch( err => {
            res.json(500).json(getResponseSchema({
                ok: false,
                error: err
            }))
        })
})

export default router;
