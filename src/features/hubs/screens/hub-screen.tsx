import { useQuery } from '@tanstack/react-query';
import { getHubRoomsService } from '../services/get-hub-rooms.service';
import { Navigate, useParams } from 'react-router-dom';
import { getRoomPath } from '@/constants/router-paths';
import { useEffect } from 'react';

export default function HubScreen() {
  const { hubSlug } = useParams();

  const { data, isFetching, refetch } = useQuery({
    queryKey: ['rooms'],
    queryFn: () => (hubSlug ? getHubRoomsService(hubSlug) : undefined),
    enabled: !!hubSlug,
  });

  useEffect(() => {
    if (hubSlug) {
      refetch();
    }
  }, [hubSlug, refetch]);

  if (isFetching || !data || data.length === 0 || !hubSlug) {
    return <span>Empty</span>;
  }

  return <Navigate to={getRoomPath(hubSlug, data[0].id)} replace />;
}
