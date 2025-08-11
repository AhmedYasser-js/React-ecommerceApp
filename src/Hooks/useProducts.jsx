import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';

export default function useProducts() {
    function fetchProducts() {
        return axios.get('https://ecommerce.routemisr.com/api/v1/products');
    }

    let responseObject = useQuery({
        queryKey: ['recentProducts'],
        queryFn: fetchProducts,
        // refetchInterval: 1000,
        // refetchIntervalInBackground: true,
        staleTime: 80000,
        // refetchOnWindowFocus: 'always',
        // retry: 6,
        // retryDelay: 5000,
        // gcTime: 5000,
        // select: (data) => data?.data.data
    });
    return responseObject;
}
