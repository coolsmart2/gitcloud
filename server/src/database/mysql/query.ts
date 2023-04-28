export const CREATE_USER_TABLE = `CREATE TABLE IF NOT EXISTS user (
                          id int primary key auto_increment,
                          provider_id varchar(255) unique,
                          username varchar(255) not null,
                          avatar_url varchar(255) not null,
                          personal_access_token varchar(255) unique
                        )`;

export const SELECT_USER_BY_PROVIDER_ID = `SELECT * FROM user WHERE provider_id=?`;

export const SELECT_USER_BY_ID = `SELECT * FROM user WHERE id=?`;

export const INSERT_USER =
  'INSERT INTO user (provider_id, username, avatar_url) VALUES (?, ?, ?)';

export const UPDATE_USER_PERSONAL_ACCESS_TOKEN =
  'UPDATE user SET personal_access_token=? WHERE id=?';

export const UPDATE_USER_CURRENT_BRANCH =
  'UPDATE user SET current_branch=? WHERE id=?';

export const UPDATE_UESR_CURRENT_FILE_PATH =
  'UPDATE user SET current_file_path=? WHERE id=?';
