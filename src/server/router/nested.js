const express = require('express')
const pluralize = require('pluralize')
const delay = require('./delay')

module.exports = (opts, db) => {
  const router = express.Router()
  router.use(delay)

  const fn = (req, res, next) => {
    const keys = Object.keys(db.getState()).map(key => pluralize.singular(key))
    const resource = pluralize.singular(req.params.resource)
    const id = `${resource}${opts.foreignKeySuffix}`
    const nested = pluralize.singular(req.params.nested)
    const isTable = !opts._preciseNeste || (keys.includes(resource) && keys.includes(nested))
    if(isTable) {
      req.method === `GET` && (req.query[id] = req.params.id);
      req.method === `POST` && (req.body[id] = req.params.id);
      req.url = `/${req.params.nested}`
    }
    next()
  }

  return router
    .get('/:resource/:id/:nested', fn)
    .post('/:resource/:id/:nested', fn)
}
