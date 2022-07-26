import useAxios from './useAxios';
import {useEffect, useState} from 'react';

function useFetchData(URL = '', params = {}) {
  const repairerAPI = useAxios();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);
  console.log(URL, params);
  useEffect(() => {
    let isSubscribe = true;
    (async function fetchData() {
      try {
        const response = await repairerAPI.get(URL, params);
        if (isSubscribe && response.status === 200) {
          setData(response.data || null);
        }
      } catch (err) {
        setIsError(true);
        setError(err);
      } finally {
        isSubscribe && setLoading(false);
      }
    })();
    return () => (isSubscribe = false);
  }, []);
  return {loading, data, isError, error};
}
export default useFetchData;
