import fetchServer from './fetch';

export default function getUser() {
  return fetchServer('/user/me');
}
