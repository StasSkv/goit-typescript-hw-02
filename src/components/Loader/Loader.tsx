import PulseLoader from 'react-spinners/PulseLoader';
import css from './Loader.module.css';
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className={css.loader}>
      <PulseLoader
        color="#36d7b7"
        loading={true}
        size={50}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default Loader;
