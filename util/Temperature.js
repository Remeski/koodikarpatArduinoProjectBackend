const TempMeasurement = require('../Models/TempMeasurement')

const handleErrors = (data, res) => {
  if (data !== [] || data !== undefined) {
    console.log(Object.keys(data))
    if (Object.keys(data).includes('err')) {
      res.status(data.err.status).json({ error: data.err.msg })
      return true
    }
    return false
  }
}

const getAllSensors = data => {
  return data.reduce((acc, cur) => {
    const { sensor } = cur

    if (!acc.includes(sensor)) {
      return [...acc].concat(sensor)
    }
    return acc
  }, [])
}

const reformatData = (data, accuracy) => {
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
      if (subtraction <= accuracy) {
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

const fetchAllTempData = async (
  formatted = true,
  accuracyInMilliseconds = 60000
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const dbRes = await TempMeasurement.find({})
      if (dbRes === []) {
        reject({ err: { status: 404, msg: 'No data found' } })
      }
      if (!formatted) {
        return dbRes
      }
      const formattedData = reformatData(dbRes, accuracyInMilliseconds)
      const allSensors = getAllSensors(dbRes)

      const data = { allsensors: allSensors, data: [...formattedData] }
      resolve(data)
    } catch (error) {
      console.log(error)
      reject({ err: { status: 500, msg: 'Interval server error' } })
    }
  })

  /* TempMeasurement.find({})
    .then(dbRes => {
      if (!formatted) {
        return dbRes
      }
      const formattedData = reformatData(dbRes, accuracyInMilliseconds)
      const allSensors = getAllSensors(dbRes)

      const data = { allsensors: allSensors, data: [...formattedData] }
      console.log('1', data)
      return data
    })
    .catch(err => {
      console.log(err)
      return { err: { status: 500, msg: 'Interval server error' } }
    }) */
}

module.exports = { fetchAllTempData, handleErrors }
