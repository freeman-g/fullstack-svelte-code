var express = require('express')
var router = express.Router()

const lunchWeekList = [
  {
    lunchWeekId: 1,
    weekOf: '2020-10-05',
    isPublished: true,
  },
  {
    lunchWeekId: 2,
    weekOf: '2020-10-12',
    isPublished: true,
  },
  {
    lunchWeekId: 3,
    weekOf: '2020-10-19',
    isPublished: false,
  },
]

router.get('/', function (req, res) {
  res.send(lunchWeekList)
})

router.get('/:lunchWeekId', function (req, res) {
  // parameters are strings, so in some cases you may need to convert them to a different type
  const id = parseInt(req.params.lunchWeekId)
  // use the JS Array.prototype.find method to get the first matching entity from the list
  const lunchWeek = lunchWeekList.find((x) => x.lunchWeekId === id)
  if (lunchWeek) {
    res.send(lunchWeek)
  } else {
    res.status(404).send()
  }
})

module.exports = router
