import db from '../config/database.js'

export function findAllDestinations() {
  return new Promise((resolve, reject) => {
    db.find({}).sort({ order: 1 }).exec((error, documents) => {
      if (error) {
        reject(error)
        return
      }

      resolve(documents)
    })
  })
}

export function findDestinationByQuery(query) {
  return new Promise((resolve, reject) => {
    db.findOne(query, (error, document) => {
      if (error) {
        reject(error)
        return
      }

      resolve(document)
    })
  })
}

export function insertDestination(destination) {
  return new Promise((resolve, reject) => {
    db.insert(destination, (error, document) => {
      if (error) {
        reject(error)
        return
      }

      resolve(document)
    })
  })
}

export function updateDestinationByQuery(query, update) {
  return new Promise((resolve, reject) => {
    db.update(query, { $set: update }, {}, (error, count) => {
      if (error) {
        reject(error)
        return
      }

      resolve(count)
    })
  })
}

export function removeDestinationByQuery(query) {
  return new Promise((resolve, reject) => {
    db.remove(query, {}, (error, count) => {
      if (error) {
        reject(error)
        return
      }

      resolve(count)
    })
  })
}
