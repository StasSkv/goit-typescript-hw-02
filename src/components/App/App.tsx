import { useState, useEffect } from 'react';
import SearchBar from '../SearchBar/SearchBar';
import { Toaster } from 'react-hot-toast';
import { getImages } from '../apiService/getImages';
import ImageGallery from '../ImageGallery/ImageGallery';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import LoadMoreBtn from '../LoadMoreBtn/LoadMoreBtn';
import ImageModal from '../ImageModal/ImageModal';
import type { ImageType } from '../apiService/getImages';

const App: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [images, setImages] = useState<ImageType[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEmpty, setIsEmpty] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [modalSrc, setModalSrc] = useState<string>('');
  const [modalAlt, setModalAlt] = useState<string>('');

  useEffect(() => {
    const savedQuery = localStorage.getItem('query');
    const savedPage = JSON.parse(localStorage.getItem('page') || '1') as number;
    const savedImages = JSON.parse(localStorage.getItem('images') || '[]') as ImageType[];

    if (savedQuery) {
      setQuery(savedQuery);
      setPage(savedPage);
      setImages(savedImages);
      getImages(savedQuery, savedPage).then(({ total_pages }) => {
        setIsVisible(savedPage < total_pages);
      });
    }
  }, []);

  const handleSearchSubmit = async (newQuery: string): Promise<void> => {
    setImages([]);
    setQuery(newQuery);
    setError(null);
    setPage(1);
    setIsEmpty(false);
    setIsVisible(false);
    setIsLoading(true);

    try {
      const { images: newImages, total_pages } = await getImages(newQuery, 1);
      if (!newImages.length) {
        setIsEmpty(true);
        return;
      }
      setImages(newImages);
      setIsVisible(1 < total_pages);
      localStorage.setItem('query', newQuery);
      localStorage.setItem('page', JSON.stringify(1));
      localStorage.setItem('images', JSON.stringify(newImages));
    } catch (error) {
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const onLoadingMore = async (): Promise<void> => {
    const nextPage = page + 1;
    setIsLoading(true);
    try {
      const { images: newImages, total_pages } = await getImages(query, nextPage);
      if (!newImages.length) {
        setIsEmpty(true);
        return;
      }
      const updatedImages = [...images, ...newImages];
      setImages(updatedImages);
      setPage(nextPage);
      setIsVisible(nextPage < total_pages);
      localStorage.setItem('page', JSON.stringify(nextPage));
      localStorage.setItem('images', JSON.stringify(updatedImages));
    } catch (error) {
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const isModalOpen = (src: string, alt: string): void => {
    setModalIsOpen(true);
    setModalAlt(alt);
    setModalSrc(src);
  };

  const isModalClose = (): void => {
    setModalIsOpen(false);
    setModalAlt('');
    setModalSrc('');
  };

  return (
    <>
      <SearchBar onSubmit={handleSearchSubmit} />
      <Toaster />
      {!error && !isEmpty && !images.length && (
        <ErrorMessage message="Everything is ready to start image search" />
      )}
      {isLoading && <Loader />}
      {error && (
        <ErrorMessage message="Oops, it looks like we have a problem! But we're already solving it..." />
      )}
      {images.length > 0 && <ImageGallery images={images} openModal={isModalOpen} />}
      {isEmpty && <ErrorMessage message="Sorry, no images were found for your request" />}
      {isVisible && images.length > 0 && !isLoading && (
        <LoadMoreBtn onClick={onLoadingMore} disabled={isLoading} />
      )}
      <ImageModal
        modalIsOpen={modalIsOpen}
        modalSrc={modalSrc}
        modalAlt={modalAlt}
        closeModal={isModalClose}
      />
    </>
  );
};

export default App;
