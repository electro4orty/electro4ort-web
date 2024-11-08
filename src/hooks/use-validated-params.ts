import { useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Schema } from 'zod';

export function useValidatedParams<Params = unknown>(schema: Schema<Params>) {
  const schemaRef = useRef(schema);
  const params = useParams();

  return useMemo(() => schemaRef.current.parse(params), [params]);
}
