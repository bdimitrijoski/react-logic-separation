
import { vi } from 'vitest';
import { CreateDraftUserCommand } from './create-draft-user.command';

import { draftUserMock, draftVersionMock, publishedUserMock } from '../../__mocks__/mockData';
import { mockUserFactoryServiceMock, draftsRepositoryMock } from '../../__mocks__/mockServices';
import { UserVersion } from '../types';

describe('CreateDraftUserCommand Test', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

   afterAll(() => {
    vi.clearAllMocks();
  });

  it('should create a draft user when no user is provided', async () => {
    const command = new CreateDraftUserCommand(
      mockUserFactoryServiceMock,
      draftsRepositoryMock
    );

    const result = await command.execute();

    expect(mockUserFactoryServiceMock.createUser).toHaveBeenCalled();
    expect(mockUserFactoryServiceMock.createDraftVersion).toHaveBeenCalledWith(
      expect.objectContaining(draftUserMock)
    );
    expect(draftsRepositoryMock.insert).toHaveBeenCalledWith(
      expect.objectContaining(draftVersionMock)
    );
    expect(result).toEqual(expect.objectContaining(draftVersionMock));
  });

  it('should create a draft from existing user', async () => {
    const command = new CreateDraftUserCommand(
      mockUserFactoryServiceMock,
      draftsRepositoryMock
    );

    const publishedUsedDraftVersion: UserVersion = {
      id: '1',
      isDraft: true,
      data: publishedUserMock,
      timestamp: Date.now(),
    };

    vi.mocked(mockUserFactoryServiceMock.createDraftVersion).mockReturnValueOnce(
      publishedUsedDraftVersion
    );

    const result = await command.execute({ user: publishedUserMock });

    expect(mockUserFactoryServiceMock.createDraftVersion).toHaveBeenCalledWith(
      expect.objectContaining(publishedUserMock)
    );
    expect(draftsRepositoryMock.insert).toHaveBeenCalledWith(
      expect.objectContaining(publishedUsedDraftVersion)
    );
    expect(result).toEqual(expect.objectContaining(publishedUsedDraftVersion));
  });
});
