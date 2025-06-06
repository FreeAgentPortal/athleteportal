import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import axios from '@/utils/axios';
import setAuthToken from '@/utils/setAuthToken';
import { useInterfaceStore } from './interface';
import errorHandler from '@/utils/errorHandler';

const { addAlert } = useInterfaceStore((state: any) => state);

// make a react query hook to get the user data from the server
const fetchUserData = async (token?: string) => {
  const { data } = await axios.post('/auth/me', {
    token: token,
  });
  return data;
};

const updateUser = async (data: any) => {
  const { data: userData } = await axios.put('/agent', data);
  return userData;
};

export const useUser = (token?: string, onSuccess?: () => void, onError?: () => void) => {
  if (typeof window !== 'undefined' && !token) {
    token = localStorage.getItem('token') as string;
  }

  const query = useQuery({
    queryKey: ['user'],
    queryFn: () => fetchUserData(token),
    staleTime: Infinity,
    meta: {
      errorMessage: 'An error occurred while fetching user data',
    },
    // cacheTime: Infinity,
    enabled: !!token, 
  });
  if (query.isError) {
    localStorage.removeItem('token');
    if (onError) onError();
  }
  // save user and token in local storage
  if (query.data && token) {
    localStorage.setItem('token', token);
    setAuthToken(token);
  }

  return query;
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  const mutate = useMutation({
    mutationFn: (data: any) => updateUser(data),
    onSuccess: (data: any) => {
      addAlert({});
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['userDetails'] });
    },
    onError: (error: Error) => {
      console.log(error);
      errorHandler(error);
    },
  });

  return mutate;
};

/**
 * @description - fetch user details, in full
 * @param id - user id
 * @returns
 */
export const fetchUserDetails = async (id: string) => {
  const { data } = await axios.get(`/user/me`);
  return data;
};

export const useUserDetails = (id: string) => {
  const query = useQuery({
    queryKey: ['userDetails', id],
    queryFn: () => fetchUserDetails(id),
    staleTime: Infinity,
    enabled: !!id,
    meta: {
      errorMessage: 'An error occurred while fetching user details',
    },
  });

  return query;
};

export const logout = () => {
  localStorage.removeItem('token');
  window.location.href =
    process.env.ENV !== 'development'
      ? `https://auth.shepherdcms.org?logout=true&redirect=https://portal.shepherdcms.org`
      : `http://localhost:3003?logout=true&redirect=http://${window.location.hostname}:${window.location.port}`;
};
