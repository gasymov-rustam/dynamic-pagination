import axios from 'axios';
import { useEffect, useState, useCallback } from 'react';
import { useEventListener } from 'usehooks-ts';

type Photo = {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
};

export const App = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [fetching, setFetching] = useState<boolean>(true);
  const [totalCount, setTotalCount] = useState<number>(0);

  const scrollHandler = useCallback(() => {
    const { scrollHeight, scrollTop } = document.documentElement;
    const distance = scrollHeight - (scrollTop + window.innerHeight) < 400;

    if (distance && photos.length < totalCount) {
      setFetching(true);
    }
  }, [photos.length, totalCount]);

  useEffect(() => {
    if (fetching) {
      axios
        .get<Photo[]>(`https://jsonplaceholder.typicode.com/photos?_limit=10&_page=${currentPage}`)
        .then((response) => {
          setPhotos([...photos, ...response.data]);
          setCurrentPage((prev) => prev + 1);
          setTotalCount(Number(response.headers['x-total-count']));
        })
        .finally(() => setFetching(false));
    }
  }, [currentPage, fetching, photos]);

  useEventListener('scroll', scrollHandler);

  /* useEffect(() => {
    document.addEventListener('scroll', scrollHandler);

    return () => document.removeEventListener('scroll', scrollHandler);
  }, [scrollHandler]);
 */
  return (
    <div className='app'>
      {photos?.map((photo) => (
        <div className='photo'>
          <div className='title'>
            {photo.id}. {photo.title}
            <img
              src={photo.thumbnailUrl}
              alt=''
              width={150}
              height={150}
              decoding='async'
              loading='lazy'
              className='img'
            />
          </div>
        </div>
      ))}
    </div>
  );
};
