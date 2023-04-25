import { expect } from 'chai';
import User from '../src/User';
import mock from '../src/data/mock';

describe('User', function() {
  let user1, user2, user3, user4;
  beforeEach(function () {
      user1 = new User(mock.travelers[0]);
      user2 = new User(mock.travelers[1]);
      user3 = new User(mock.travelers[2]);
      user4 = new User(mock.travelers[3]);
  });

  it('Should be a function', function() {
      expect(User).to.be.a('function');
  });

  it('Should hold a userID', function()  {
    expect(user1.userID).to.equal(1);
    expect(user2.userID).to.equal(2);
    expect(user3.userID).to.equal(3);
  });

  it('Should hold a name', function()  {
    expect(user1.name).to.equal("Ham Leadbeater");
    expect(user2.name).to.equal("Rachael Vaughten");
    expect(user3.name).to.equal("Sibby Dawidowitsch");
  });

  it('Should be able to find approved trips', function()  {
    const approved1 = user1.getApproved(mock.trips);
    const approved3 = user3.getApproved(mock.trips);

    expect(approved1).to.deep.equal([{
      "id": 1,
      "userID": 1,
      "destinationID": 1,
      "travelers": 1,
      "date": "2022/09/16",
      "duration": 8,
      "status": "approved",
      "suggestedActivities": []
      }]);

    expect(approved3).to.deep.equal([]);
  });

  it('Should be able to find pending trips', function()  {
    const pending1 = user1.getPending(mock.trips);
    const pending3 = user3.getPending(mock.trips);

    expect(pending1).to.deep.equal([]);

    expect(pending3).to.deep.equal([{
      "id": 3,
      "userID": 3,
      "destinationID": 3,
      "travelers": 4,
      "date": "2022/05/22",
      "duration": 17,
      "status": "pending",
      "suggestedActivities": []
      }]);
  });

  it('Should be able to calculate total money spent', function()  {
    const total1 = user1.getTotalSpent(mock.trips, mock.destinations);
    const total2 = user2.getTotalSpent(mock.trips, mock.destinations);
    const total4 = user4.getTotalSpent(mock.trips, mock.destinations);

    expect(total1).to.deep.equal("$1,056");

    expect(total2).to.deep.equal("$14,190");

    expect(total4).to.deep.equal("$0");
  });
});

