import type { JSX } from 'react';

import { Button } from '@components/button/Button';
import { useResendConfirmationMutation } from '@store/api/auth.api';

import styles from './EmailConfirmationBanner.module.scss';

export const EmailConfirmationBanner = (): JSX.Element => {
  const [resend, { isLoading, isSuccess }] = useResendConfirmationMutation();

  return (
    <div className={styles.banner}>
      <p className={styles.text}>
        Confirm your email before booking a room. In development the link is printed to the API log
        instead of being sent by mail.
      </p>

      <Button variant="ghost" size="small" onClick={() => void resend()} disabled={isLoading}>
        {isSuccess ? 'Link sent again' : 'Send the link again'}
      </Button>
    </div>
  );
};
