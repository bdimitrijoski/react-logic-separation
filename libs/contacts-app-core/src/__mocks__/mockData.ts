import { User, UserVersion } from '../lib/types';

export const draftUserMock: User = {
  name: 'New User 123',
  email: '',
  phone: '',
  id: 123,
  username: '',
  website: '',
};
export const draftVersionMock: UserVersion = {
  id: '1',
  isDraft: true,
  data: draftUserMock,
  timestamp: Date.now(),
};

export const publishedUserMock: User = {
  name: 'John Doe',
  email: 'john.doe@email',
  phone: '0012345678',
  id: 1,
  username: 'johndoe',
  website: 'johndoe.com',
};

export const publishedUserDraftVersionMock: UserVersion = {
  id: '2',
  isDraft: true,
  data: publishedUserMock,
  timestamp: Date.now(),
};
