const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));
const USER_URL = process.env.USER_URL;

exports.getUserByToken = async (token) => {
  const user = await fetch(`${USER_URL}/users/me`, {
    method: 'GET',
    headers: {
      Authorization: token,
    },
  });
  return user;
};
