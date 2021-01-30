var express = require('express')
var router = express.Router()
const knex = require('../database/client') // Import our knex client

const getLunchWeekList = () => {
  return knex.select().from('lunch_week').orderBy('week_of')
}

const getLunchWeekById = (id) => {
  return knex.select().from('lunch_week').where('lunch_week_id', id).first()
}

router.get('/', async function (req, res) {
  try {
    const lunchWeekList = await getLunchWeekList()
    res.send(lunchWeekList)
  } catch (e) {
    const message = `Error getting Lunch Week List`
    res.status(500).send({ message: message, error: e.toString() })
  }
})

router.get('/:lunchWeekId', async function (req, res) {
  try {
    const id = parseInt(req.params.lunchWeekId)
    const lunchWeek = await getLunchWeekById(id)
    if (lunchWeek) {
      res.send(lunchWeek)
    } else {
      const message = `Lunch Week Id ${req.params.lunchWeekId} not found`
      res.status(404).send({
        message: message,
      })
    }
  } catch (e) {
    const message = `Error getting Lunch Week Id ${req.params.lunchWeekId}`
    res.status(500).send({
      message: message,
      error: e.toString(),
    })
  }
})

module.exports = router
