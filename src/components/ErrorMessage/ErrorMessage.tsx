import React from 'react';
import css from './ErrorMessage.module.css';

type ErrorMessageProps = {
  message: String;
};

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className={css.errorMessage}>
      <p>{message}</p>
    </div>
  );
};

export default ErrorMessage;
