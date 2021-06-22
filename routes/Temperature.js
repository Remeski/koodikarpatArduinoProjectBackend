const router = require('express').Router()

const TempMeasurement = require('../Models/TempMeasurement')

router.get('/', (req, res) => {
  TempMeasurement.find({}).then((dbRes) => {
    res.json(dbRes)
  }).catch(() => res.status(500).json({ error: 'Internal server error' }))
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

  tempMeasurement.save().then(result => {
    res.status(201).end()
  }).catch(err => {
    console.log(err)
    res.status(500).json({ error: 'Internal server error' })
  })


})

module.exports = router
