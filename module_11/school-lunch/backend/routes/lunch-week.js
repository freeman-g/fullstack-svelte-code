var express = require('express')
var router = express.Router()
let knex

const getLunchWeekList = () => {
  return knex.select().from('lunch_week').orderBy('week_of')
}

const getLunchWeekById = (lunchWeekId) => {
  return knex
    .select()
    .from('lunch_week')
    .where('lunch_week_id', lunchWeekId)
    .first()
}

const createLunchWeek = (lunchWeek) => {
  return knex('lunch_week').insert(lunchWeek).returning('lunch_week_id')
}

const updateLunchWeek = (lunchWeekId, lunchWeek) => {
  return knex('lunch_week')
    .where('lunch_week_id', lunchWeekId)
    .update(lunchWeek)
}

const deleteLunchWeek = (lunchWeekId) => {
  return knex('lunch_week').where('lunch_week_id', lunchWeekId).del()
}

const getLunchDayList = (lunchWeekId) => {
  return knex.select().from('lunch_day').where('lunch_week_id', lunchWeekId)
}

const createLunchDay = (lunchDay) => {
  return knex('lunch_day').insert(lunchDay).returning('lunch_day_id')
}

const updateLunchDay = async (lunchDayId, lunchDay) => {
  return knex('lunch_day').where('lunch_day_id', lunchDayId).update(lunchDay)
}

const deleteLunchDay = (lunchDayId) => {
  return knex('lunch_day').where('lunch_day_id', lunchDayId).del()
}

router.get('/', async function (req, res) {
  knex = req.knex
  try {
    const lunchWeekList = await getLunchWeekList()
    res.send(lunchWeekList)
  } catch (e) {
    const message = `Error getting Lunch Week List`
    res.status(500).send({ message: message, error: e.toString() })
  }
})

router.post('/', async function (req, res) {
  knex = req.knex
  const lunchWeek = req.body
  try {
    const insertResponse = await createLunchWeek(lunchWeek)
    const insertedLunchWeekId = insertResponse[0]
    const response = {
      lunchWeekId: insertedLunchWeekId,
    }
    res.send(response)
  } catch (e) {
    const message = `Error creating Lunch Week`
    res.status(500).send({ message: message, error: e.toString() })
  }
})

router.put('/:lunchWeekId', async function (req, res) {
  knex = req.knex
  try {
    const id = parseInt(req.params.lunchWeekId)
    const lunchWeek = req.body

    if (id !== lunchWeek.lunchWeekId) {
      const message = `Bad request, IDs do not match`
      res.status(400).send({ message: message })
      return
    }
    await updateLunchWeek(id, lunchWeek)
    res.send()
  } catch (e) {
    const message = `Error updating Lunch Week`
    res.status(500).send({ message: message, error: e.toString() })
  }
})

router.delete('/:lunchWeekId', async function (req, res) {
  knex = req.knex
  try {
    const id = parseInt(req.params.lunchWeekId)
    await deleteLunchWeek(id)
    res.send()
  } catch (e) {
    const message = `Error deleting Lunch Week`
    res.status(500).send({ message: message, error: e.toString() })
  }
})

router.get('/:lunchWeekId', async function (req, res) {
  knex = req.knex
  try {
    const id = parseInt(req.params.lunchWeekId)
    const lunchWeek = await getLunchWeekById(id)
    if (lunchWeek) {
      let lunchDays = await getLunchDayList(id) // fetch the lunch days list
      lunchWeek.lunchDays = lunchDays // set lunchDays as a property on the lunchWeek object
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

// lunch day endpoints
router.get('/:lunchWeekId/lunch-day', async function (req, res) {
  knex = req.knex
  try {
    const lunchWeekId = parseInt(req.params.lunchWeekId)
    const lunchDayList = await getLunchDayList(lunchWeekId)
    res.send(lunchDayList)
  } catch (e) {
    const message = `Error getting Lunch Day List`
    res.status(500).send({ message: message, error: e.toString() })
  }
})

router.post('/:lunchWeekId/lunch-day', async function (req, res) {
  knex = req.knex
  const lunchDay = req.body
  try {
    const insertResponse = await createLunchDay(lunchDay)
    const insertedLunchDayId = insertResponse[0]
    const response = {
      lunchDayId: insertedLunchDayId,
    }
    res.send(response)
  } catch (e) {
    const message = `Error creating Lunch Day`
    res.status(500).send({ message: message, error: e.toString() })
  }
})

router.put('/:lunchWeekId/lunch-day/:lunchDayId', async function (req, res) {
  knex = req.knex
  try {
    const lunchDayId = parseInt(req.params.lunchDayId)
    const lunchDay = req.body

    if (lunchDayId !== lunchDay.lunchDayId) {
      const message = `Bad request, IDs do not match`
      res.status(400).send({ message: message })
      return
    }
    await updateLunchDay(lunchDayId, lunchDay)
    res.send()
  } catch (e) {
    const message = `Error updating Lunch Day`
    res.status(500).send({ message: message, error: e.toString() })
  }
})

router.delete('/:lunchWeekId/lunch-day/:lunchDayId', async function (req, res) {
  knex = req.knex
  try {
    const lunchDayId = parseInt(req.params.lunchDayId)
    await deleteLunchDay(lunchDayId)
    res.send()
  } catch (e) {
    const message = `Error deleting Lunch Day`
    res.status(500).send({ message: message, error: e.toString() })
  }
})

module.exports = router
