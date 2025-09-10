import { vi } from 'vitest';

import {
  draftUserMock,
  draftVersionMock,
  publishedUserDraftVersionMock,
  publishedUserMock,
} from '../../__mocks__/mockData';
import { FetchUsersQuery } from './fetch-users.query';
import {
  usersRepositoryMock,
  draftsRepositoryMock,
} from '../../__mocks__/mockServices';

describe('FetchUsersQuery Test', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.clearAllMocks();
  });

  it('should fetch users and merge with drafts', async () => {
    const command = new FetchUsersQuery(
      usersRepositoryMock,
      draftsRepositoryMock
    );

    const result = await command.execute();

    expect(usersRepositoryMock.getAll).toHaveBeenCalled();
    expect(draftsRepositoryMock.getAll).toHaveBeenCalled();
    expect(result).toEqual(
      expect.arrayContaining([publishedUserMock, draftUserMock])
    );
  });

  it('should group users list by id', async () => {
    const command = new FetchUsersQuery(
      usersRepositoryMock,
      draftsRepositoryMock
    );

    // append the draft for the published user, this should be handled by the query
    vi.mocked(draftsRepositoryMock.getAll).mockResolvedValueOnce([
      draftVersionMock,
      publishedUserDraftVersionMock,
    ]);

    const result = await command.execute();

    expect(usersRepositoryMock.getAll).toHaveBeenCalled();
    expect(draftsRepositoryMock.getAll).toHaveBeenCalled();
    expect(result).toEqual(
      expect.arrayContaining([publishedUserMock, draftUserMock])
    );
  });

  
});
