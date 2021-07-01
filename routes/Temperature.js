const router = require('express').Router()

const { fetchAllTempData, handleErrors } = require('../util/Temperature')

router.get('/', async (req, res) => {
  fetchAllTempData()
    .then(data => res.json(data))
    .catch(err => handleErrors(err, res))
})

// GET /temperature/:startDate/:endDate
router.get('/:startDate/:endDate', async (req, res) => {
  const { startDate, endDate } = req.params

  const temperatureData = await fetchAllTempData()

  const findClosestToZero = array => {
    const includesNegativeValues = !!array.find(elem => elem < -1)
    if (includesNegativeValues) {
      const positiveNumbers = array.filter(elem => elem > 0)
      const closestPositiveNumber =
        Math.min(...positiveNumbers) && positiveNumbers

      const negativeNumbers = array.filter(elem => elem < 0)
      const closestNegativeNumber = Math.max(...negativeNumbers)

      const closestNumber =
        closestPositiveNumber > Math.abs(closestNegativeNumber)
          ? closestPositiveNumber
          : closestNegativeNumber

      return closestNumber
    }
    return Math.min(...array)
  }

  const findClosestMatch = (dateArray, dateTarget) => {
    const dateDiffs = []

    dateArray.forEach(elem => {
      const parsedElem = new Date(elem)
      const parsedTarget = new Date(dateTarget)

      console.log(parsedElem.getDate(), parsedTarget.getDate())

      if (
        parsedElem.getFullYear() === parsedTarget.getFullYear() &&
        parsedElem.getMonth() === parsedTarget.getMonth() &&
        parsedElem.getDate() < parsedTarget.getDate()
      ) {
        const diff = Date.parse(elem) - Date.parse(dateTarget)
        dateDiffs.push(diff)
      }
    })

    const closest = findClosestToZero(dateDiffs)
    const index = dateDiffs.findIndex(elem => elem === closest)
    return dateArray[index]
  }

  const findMatch = (dateArray, dateTarget) => {
    const formatDate = date => {
      const parsedDate = new Date(date)

      return `${parsedDate.getFullYear()}-${
        parsedDate.getMonth() + 1
      }-${parsedDate.getDate()}`
    }
    const index = dateArray.findIndex(
      elem => formatDate(elem) === formatDate(dateTarget)
    )
    if (index === -1) {
      return false
    }
    return dateArray[index]
  }

  if (temperatureData !== undefined) {
    const dateArray = temperatureData.data.map(elem => elem.date)

    let msg = {}

    let startingElement = findMatch(dateArray, startDate)
    if (!startingElement) {
      startingElement = findClosestMatch(dateArray, startDate)
      msg.msg = 'Some data was missing. Using closest matching data found.'
    }
    const startIndex = dateArray.findIndex(elem => elem === startingElement)

    let endingElement = findMatch(
      dateArray.slice(startIndex).reverse(),
      endDate
    )
    if (!endingElement) {
      endingElement = findClosestMatch(
        dateArray.slice(startIndex).reverse(),
        endDate
      )
      msg.msg = 'Using closest matching data found'
    }
    const endIndex = dateArray.findIndex(elem => elem === endingElement)

    console.log({ startIndex, endIndex })
    return res.json({
      ...temperatureData,
      data: temperatureData.data.slice(startIndex, endIndex),
      ...msg,
    })
  }
  console.log('hello')
})

// Dev route
router.get('/getdate', (req, res) => {
  const date = new Date()
  res.send(date)
})

// Protected
router.post('/', (req, res) => {
  const { sensor, temperature } = req.body
  if (!sensor || !temperature) {
    return res.status(400).json({ error: 'Invalid body' })
  }

  const tempMeasurement = new TempMeasurement({
    sensor,
    temperature,
    date: new Date(),
  })

  tempMeasurement
    .save()
    .then(result => {
      res.status(201).end()
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: 'Internal server error' })
    })
})

module.exports = router
