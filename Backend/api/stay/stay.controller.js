const stayService = require('./stay.service.js')
const logger = require('../../services/logger.service')
const { log } = require('../../middlewares/logger.middleware.js')
const socketService = require('../../services/socket.service')

async function getStays(req, res) {
  try {
    logger.debug('Getting stays')
    var queryParams = req.query
    let filterBy
    if (req.query.params) {
      filterBy = JSON.parse(req.query.params)
    } else
      filterBy = {}

    const stays = await stayService.query(filterBy)

    res.json(stays)
    console.log(stays)
  } catch (err) {
    logger.error('Failed to get stays', err)
    res.status(500).send({ err: 'Failed to get stays' })
  }
}

async function getPlaceList(req, res) {
  try {
    let text = req.query.params
  const placelist =  await stayService.getPlaceList(text)
} catch (err) {
  logger.error('Failed to get placelist', err)
  res.status(500).send({ err: 'Failed to get placelist' })
}
}


async function addStay(req, res) {
  try {
    const stay = req.body
    const addedStay = await stayService.add(stay)
    res.json(addedStay)
    socketService.broadcast({ type: 'stay-added', data: addedStay })
  } catch (err) {
    logger.error('Failed to add stay', err)
    res.status(500).send({ err: 'Failed to add stay' })
  }
}

async function updateStay(req, res) {
  try {
    const stay = req.body;
    const updatedStay = await stayService.update(stay)
    res.json(updatedStay)
  } catch (err) {
    logger.error('Failed to update stay', err)
    res.status(500).send({ err: 'Failed to update stay' })

  }
}

async function removeStay(req, res) {
  try {
    const stayId = req.params.id;
    const removedId = await stayService.remove(stayId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove stay', err)
    res.status(500).send({ err: 'Failed to remove stay' })
  }
}

async function getStayById(req, res) {
  try {
    const stayId = req.params.id
    const stay = await stayService.getById(stayId)
    res.json(stay)
  } catch (err) {
    logger.error('Failed to get stay', err)
    res.status(500).send({ err: 'Failed to get stay' })
  }
}

module.exports = {
  getStays,
  addStay,
  removeStay,
  updateStay,
  getPlaceList,
  getStayById
}
