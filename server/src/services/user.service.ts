import { ServerError } from '../constants/errors';
import * as userRepository from '../repositories/user.repository';

export const findOneById = async (id: number) => {
  try {
    return userRepository.findOneById(id);
  } catch (error) {
    throw new ServerError();
  }
};

export const findOneByProviderId = async (providerId: string) => {
  try {
    return userRepository.findOneByProviderId(providerId);
  } catch (error) {
    throw new ServerError();
  }
};

export const add = async ({
  providerId,
  username,
  avatarUrl,
}: {
  providerId: string;
  username: string;
  avatarUrl: string;
}) => {
  try {
    return userRepository.add({
      providerId,
      username,
      avatarUrl,
    });
  } catch (error) {
    throw new ServerError();
  }
};

export const updatePersonalAccessToken = async ({
  id,
  personalAccessToken,
}: {
  id: number;
  personalAccessToken: string;
}) => {
  try {
    return userRepository.updateToken({
      id,
      personalAccessToken,
    });
  } catch (error) {
    throw new ServerError();
  }
};
