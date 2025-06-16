
const { getTrainData } = require('./index');

const trainData = [
  {
    id: "train1-id",
    label: "Train 123",
    bearing: 45.67,
    directionId: 1,
    directionName: "Northbound",
    tripStatus: "SCHEDULED",
    lat: 37.7749,
    lng: -122.4194,
    occupancyStatus: null,
    tripId: "1234",
    shapeId: "1305676",
    routeId: "1",
    serviceDate: "2025-06-20T14:30:00Z",
    headsign: "Union Station",
    timestamp: Date.now(),
    prevStop: {
      id: "stop1-id",
      name: "Previous Stop",
    },
    currentStop: null,
    nextStop: {
      id: "stop2-id",
      name: "Next Stop",
    },
  },
  {
    id: "train2-id",
    label: "Train 321",
    bearing: 45.67,
    directionId: 1,
    directionName: "Southbound",
    tripStatus: "SCHEDULED",
    lat: 37.7749,
    lng: -122.4194,
    occupancyStatus: null,
    tripId: "1235",
    shapeId: "1305677",
    routeId: "2",
    serviceDate: "2025-06-20T14:30:00Z",
    headsign: "Union Station",
    timestamp: Date.now(),
    prevStop: {
      id: "stop1-id",
      name: "Previous Stop",
    },
    currentStop: null,
    nextStop: {
      id: "stop2-id",
      name: "Next Stop",
    },
  },
];

describe('getTrainData', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should fetch and save train data for all lines (success)', async () => {
    const req = { body: {} };
    const res = { status: jest.fn().mockReturnValue({ send: jest.fn() }) };
    const response = await getTrainData(req,res);
    
    expect(res.status).toBe('Train data fetched and saved successfully!');
    
  });

  it('should fail to fetch train data for line "Z" (failure)', async () => {
    const req = { body: {} };
    const res = { status: jest.fn().mockReturnValue({ send: jest.fn() }) };

    const responseMock = {
      json: () =>
        Promise.resolve(trainData),
    };

    const fetchMock = jest.spyOn(require('node-fetch'), 'default');
    fetchMock.mockImplementationOnce(() => Promise.resolve(responseMock));

    await getTrainData(req, res);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status()).toBeCalledWith(500);
  });

  it('should handle error when fetching train data (failure)', async () => {
    const req = { body: {} };
    const res = { status: jest.fn().mockReturnValue({ send: jest.fn() }) };

    const responseMock = {
      json: () =>
        Promise.reject(new Error('Error fetching train data')),
    };

    const fetchMock = jest.spyOn(require('node-fetch'), 'default');
    fetchMock.mockImplementationOnce(() => Promise.resolve(responseMock));

    await getTrainData(req, res);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status()).toBeCalledWith(500);
  });
});