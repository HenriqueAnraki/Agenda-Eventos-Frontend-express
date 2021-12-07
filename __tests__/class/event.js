const eventsList = {
  toCreate: {
    start: '2020-11-09 18:00:00',
    end: '2020-11-09 19:00:00',
    description: 'desc create'
  },
  overlap: {
    start: '2020-11-09 18:30:00',
    end: '2020-11-09 19:30:00',
    description: 'desc'
  },
  missingEndDate: {
    start: '2020-11-010 18:00:00',
    description: 'desc'
  },
  normalEvent1: {
    start: '2020-11-08 10:00:00',
    end: '2020-11-08 11:00:00',
    description: 'desc 1'
  },
  normalEvent2: {
    start: '2020-11-08 11:00:00',
    end: '2020-11-08 12:00:00',
    description: 'desc 2'
  },
  normalEvent3: {
    start: '2020-11-08 12:00:00',
    end: '2020-11-08 13:00:00',
    description: 'desc 3'
  }
}

const eventsSeeds = [
  {
    key: 'normalEvent1',
    value: eventsList.normalEvent1
  },
  {
    key: 'normalEvent2',
    value: eventsList.normalEvent2
  },
  {
    key: 'normalEvent3',
    value: eventsList.normalEvent3
  }
]

module.exports = {
  eventsList,
  eventsSeeds
}
