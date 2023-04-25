import { expect } from 'chai';
import Trip from '../src/Trip';
import User from '../src/User';
import mock from '../src/data/mock';

describe('Trip', function() {
  let trip1, trip2, trip3;
  beforeEach(function () {
      trip1 = new Trip(1, mock.trips, mock.destinations);
      trip2 = new Trip(2, mock.trips, mock.destinations);
      trip3 = new Trip(3, mock.trips, mock.destinations);
  });

  it('Should be a function', function() {
      expect(Trip).to.be.a('function');
  });

  it('Should hold a tripID', function()  {
    expect(trip1.tripID).to.equal(1);
    expect(trip2.tripID).to.equal(2);
    expect(trip3.tripID).to.equal(3);
  });

  it('Should be able to calculate trip cost', function()  {
    const total1 = trip1.getTripCost(1,mock.trips, mock.destinations);
    const total2 = trip2.getTripCost(2, mock.trips, mock.destinations);
    const total3 = trip3.getTripCost(3, mock.trips, mock.destinations);

    expect(total1).to.deep.equal("$1,056");

    expect(total2).to.deep.equal("$14,190");

    expect(total3).to.deep.equal("$13,904");
  });
});

