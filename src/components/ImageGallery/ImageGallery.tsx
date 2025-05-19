import css from './ImageGallery.module.css';
import ImageCard from '../ImageCard/ImageCard';
import React from 'react';
import { ImageType } from '../apiService/getImages';

type ImageGalleryType = {
  images: ImageType[];
  openModal: (url: string, alt: string) => void;
};

const ImageGallery: React.FC<ImageGalleryType> = ({ images, openModal }) => {
  return (
    <ul className={css.galleryList}>
      {images.map((image: ImageType) => (
        <li key={image.id}>
          <ImageCard image={image} openModal={openModal} />
        </li>
      ))}
    </ul>
  );
};

export default ImageGallery;
