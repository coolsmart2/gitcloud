import { MySqlError } from '../constants/errors';
import cp from '../database/mysql';
import * as QUERY from '../database/mysql/query';
import { User } from '../types/entity.type';

export const findOneById = async (id: number) => {
  let conn = null;
  try {
    conn = await cp.getConnection();
    const result = await conn.query(QUERY.SELECT_USER_BY_ID, [id]);
    return (result?.[0] as unknown as User[])[0];
  } catch (error) {
    throw new MySqlError();
  } finally {
    if (conn) conn.release();
  }
};

export const findOneByProviderId = async (providerId: string) => {
  let conn = null;
  try {
    conn = await cp.getConnection();
    const result = await conn.query(QUERY.SELECT_USER_BY_PROVIDER_ID, [
      providerId,
    ]);
    return result?.[0] as unknown as User[];
  } catch (error) {
    throw new MySqlError();
  } finally {
    if (conn) conn.release();
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
  let conn = null;
  try {
    conn = await cp.getConnection();
    const result = await conn.query(QUERY.INSERT_USER, [
      providerId,
      username,
      avatarUrl,
    ]);
    return result?.[0];
  } catch (error) {
    throw new MySqlError();
  } finally {
    if (conn) conn.release();
  }
};

export const updateToken = async ({
  id,
  personalAccessToken,
}: {
  id: number;
  personalAccessToken: string;
}) => {
  let conn = null;
  try {
    conn = await cp.getConnection();
    const result = await conn.query(QUERY.UPDATE_USER_PERSONAL_ACCESS_TOKEN, [
      personalAccessToken,
      id,
    ]);
    return result?.[0];
  } catch (error) {
    throw new MySqlError();
  } finally {
    if (conn) conn.release();
  }
};
