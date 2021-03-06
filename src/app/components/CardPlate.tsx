import * as classNames from 'classnames';
import { css } from 'emotion';
import * as React from 'react'

import { colors } from 'app/constants/colors';;
import { Card } from 'app/services/user/userTypes';

export interface CardPlateProps {
  card?: Card;
  className?: string;
  handleDeletePopupOpend: () => void;
}

const wrapper = css({
  position: 'relative',
  borderRadius: '6px',
  width: '240px',
  height: '140px',
  boxSizing: 'border-box',
  margin: '0 auto',
  padding: '10px',
});

const cardNumberText = css({
  position: 'absolute',
  left: '18px',
  bottom: '14px',
  margin: 0,
  color: '#fff',
  fontSize: '16px'
});

const cardLogoImageWrapper = css({
  display: 'inline-block',
});

const cardLogoImage = css({
  position: 'absolute',
  top: '10px',
  left: '10px',
  width: '220px',
})

const emptyCardPlaceholderText = css({
  position: 'absolute',
  color: colors.bluegray_20,
  fontSize: '13px',
  top: '50%',
  left: '0',
  width: '100%',
  transform: 'translateY(-50%)',
  textAlign: 'center',
})

const emptyCardPlate = css({
  border: `2px solid ${colors.bluegray_5}`,
  borderRadius: '6px',
})

const cardIssuerNameText = css({
  position: 'absolute',
  top: '10px',
  left: '10px',
  width: '220px',
  fontSize: '16px',
  color: '#fff',
  fontWeight: 'bold',
});

const cardDeleteButton = css({
  position: 'absolute',
  right: '10px',
  top: '10px',
  fontSize: '12px',
  letterSpacing: '-0.3px',
  textDecoration: 'none',
  color: '#ffffff',
  cursor: 'pointer',
});

export const CardPlate: React.SFC<CardPlateProps> = ({ card, className, handleDeletePopupOpend }) => {
  if (!card) {
    return (
      <div className={classNames([wrapper, className, emptyCardPlate])} style={{ backgroundColor: '#fff' }}>
        <span className={emptyCardPlaceholderText}>등록된 카드가 없습니다.</span>
      </div>
    )
  }
  const { iin, color, logo_image_url } = card;
  return (
    <div
      className={classNames(wrapper, className)}
      style={{ backgroundColor: color }}
    >
      <img
        className={cardLogoImage}
        src={logo_image_url}
        alt="카드 이미지"
      />
      <a className={cardDeleteButton} onClick={handleDeletePopupOpend}>삭제</a>
      <p className={cardNumberText}>{iin.replace(/(.{4})(.{2})/g, "$1 $2** **** ****")}</p>
    </div>
  );
};
