import useFetch from './fetch';

export default function useGetUser() {
  return useFetch('/user/me');
}
