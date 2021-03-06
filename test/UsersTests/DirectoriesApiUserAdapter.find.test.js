jest.mock('request-promise');
jest.mock('login.dfe.jwt-strategies');
jest.mock('../../src/infrastructure/Config');

describe('When finding a user with the api', () => {
  const username = 'user.one@unit.tests';

  const client = {
    params: {
      directoryId: 'directory1',
    },
  };
  const bearerToken = 'some-token';

  let rp;
  let jwtGetBearerToken;

  let directoriesApiUserAdapter;

  beforeEach(() => {
    rp = require('request-promise');
    rp.mockReturnValue('user1');

    jwtGetBearerToken = jest.fn().mockReturnValue(bearerToken);
    const jwt = require('login.dfe.jwt-strategies');
    jwt.mockImplementation((jwtConfig) => {
      return {
        getBearerToken: jwtGetBearerToken
      }
    });

    const config = require('./../../src/infrastructure/Config');
    config.mockImplementation(() =>{
      return {
        directories: {
          service: {
            url: 'https://directories.login.dfe.test',
          },
        },
      };
    });

    directoriesApiUserAdapter = require('./../../src/infrastructure/Users/DirectoriesApiUserAdapter');
  });

  it('it calls the clients directory at the user endpoint with the user identifier', async () => {
    await directoriesApiUserAdapter.find(username, client);

    expect(rp.mock.calls[0][0].method).toBe('GET');
    expect(rp.mock.calls[0][0].uri).toBe(`https://directories.login.dfe.test/directory1/user/${username}`);
  });

});