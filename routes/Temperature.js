const router = require('express').Router()

const TempMeasurement = require('../Models/TempMeasurement')

router.get('/', (req, res) => {
  const accuracyInMilliseconds = 60000 // 1 minute

  const getAllSensors = data => {
    return data.reduce((acc, cur) => {
      const { sensor } = cur

      if (!acc.includes(sensor)) {
        return [...acc].concat(sensor)
      }
      return acc
    }, [])
  }

  const reformatData = data => {
    const allSensorValues = data.map(elem => {
      const { sensor, temperature, date } = elem

      return { [sensor]: temperature, date }
    })
    const returnArray = allSensorValues.reduce((acc, cur) => {
      if (acc.length < 1) {
        return [...acc].concat(cur)
      }

      const index = acc.length - 1
      const lastItem = { ...acc[index] }

      if (!Object.keys(lastItem).includes(Object.keys(cur)[0])) {
        const subtraction = cur.date.getTime() - lastItem.date.getTime()
        if (subtraction <= accuracyInMilliseconds) {
          const obj = {
            [Object.keys(cur)[0]]: cur[Object.keys(cur)[0]],
            ...lastItem,
          }
          return [...acc].slice(0, acc.length - 1).concat(obj)
        }
      }

      return [...acc].concat(cur)
    }, [])

    return returnArray
  }

  TempMeasurement.find({})
    .then(dbRes => {
      const formattedData = reformatData(dbRes)
      const allSensors = getAllSensors(dbRes)

      const data = { allsensors: allSensors, data: [...formattedData] }
      res.json(data)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: 'Internal server error' })
    })
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
