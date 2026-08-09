import type { JSX } from 'react';

import { classNames } from '@domain/services/class-names.service';

import styles from './ScheduleLegend.module.scss';

const LEGEND_ITEMS = [
  { label: 'Free', swatch: styles.freeSwatch },
  { label: 'Yours', swatch: styles.mineSwatch },
  { label: 'Taken', swatch: styles.takenSwatch },
  { label: 'Past', swatch: styles.pastSwatch },
  { label: 'Now', swatch: styles.nowSwatch },
];

export const ScheduleLegend = (): JSX.Element => (
  <div className={styles.legend}>
    {LEGEND_ITEMS.map(({ label, swatch }) => (
      <span key={label} className={styles.item}>
        <span className={classNames(styles.swatch, swatch)} />
        {label}
      </span>
    ))}
  </div>
);
