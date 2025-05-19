import css from './ImageCard.module.css';
import { ImageType } from '../apiService/getImages';
import React from 'react';

export type ImageTypeProps = {
  image: ImageType;
  openModal: (url: string, alt: string) => void;
};

const ImageCard: React.FC<ImageTypeProps> = ({ image, openModal }) => {
  const handleClick = () => {
    openModal(image.urls.regular, image.alt_description);
  };

  return (
    <div onClick={handleClick} className={css.card}>
      <img src={image.urls.small} alt={image.alt_description} className={css.img} />
    </div>
  );
};

export default ImageCard;
