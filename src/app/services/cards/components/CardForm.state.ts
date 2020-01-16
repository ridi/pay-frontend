import { flow, keyBy, mapValues } from 'lodash-es';
import * as React from 'react';

import { DEFAULT_CARD_NUMBER_PATTERN } from 'app/utils/prettifyCardNumber';

export interface CardNumberInput {
  value: string;
  maxLength: number;
  isValid: boolean;
}

export interface CardCheckboxInput {
  checked: boolean;
  isValid: boolean;
}

export const cardNumberInputKey = {
  cardnumber: 'cardnumber',
  ccmonth: 'ccmonth',
  ccyear: 'ccyear',
  password: 'password',
  birthdate: 'birthdate'
};

export const cardNumberInputName: {
  [key: string]: string;
} = {
  // Use recommended names to use browsers' autofill
  // https://goo.gl/yvVr8z
  cardnumber: 'cardnumber',
  ccmonth: 'ccmonth',
  ccyear: 'ccyear',
  // We need both [name="new-password"] and [role="presentation"]
  // to prefectly prevent wrong autofill on this input T^T
  password: 'new-password',
  birthdate: 'birthdate'
};

export const cardNumberInputAutoCompleteProps: {
  [key: string]: string;
} = {
  cardnumber: 'cc-number',
  ccmonth: 'cc-exp-month',
  ccyear: 'cc-exp-year',
  password: 'off',
  birthdate: 'off'
};

const cardInputLength: {
  [inputId: string]: number;
} = {
  cardnumber: 19, // This includes 3 spaces between number blocks
  ccmonth: 2,
  ccyear: 2,
  password: 2,
  birthdate: 10
};

export const numberInputRegexes: Record<string, RegExp> = Object.keys(cardNumberInputKey)
  .filter((key) => key !== cardNumberInputKey.cardnumber)
  .reduce((acc, key) => {
    return {
      ...acc,
      // 생년월일의 경우 사업자번호가 포함되면서 6자리부터 10자리까지 허용가능하도록 수정
      [key]: new RegExp(`[0-9]{${key !== cardNumberInputKey.birthdate ? cardInputLength[key] : 6}}`)
    };
  }, {});

export type CardNumberInputKey = (typeof cardNumberInputKey)[keyof typeof cardNumberInputKey];

export const cardCheckboxInputKey = {
  agreeToTerms: 'agreeToTerms'
};

export type CardCheckboxInputKey = (typeof cardCheckboxInputKey)[keyof typeof cardCheckboxInputKey];

export const cardInputKey = {
  ...cardNumberInputKey,
  ...cardCheckboxInputKey
};

export type CardInputKey = (typeof cardInputKey)[keyof typeof cardInputKey];

export interface CardFormState {
  numberInputs: {
    [inputId: string]: CardNumberInput;
  };
  checkboxInputs: {
    [inputId: string]: CardCheckboxInput;
  };
}

export interface CardInputRefs {
  [inputId: string]: React.RefObject<any>;
}

export const getInitialCardFormState = (): CardFormState => ({
  numberInputs: flow(
    (inputKeyMap: typeof cardNumberInputKey) => Object.keys(inputKeyMap),
    (list: string[]) => list.filter((key) => key !== cardNumberInputKey.cardnumber),
    (list: string[]) => keyBy(list),
    (dic) =>
      mapValues(dic, (inputState, key) => ({
        value: '',
        maxLength: cardInputLength[key],
        isValid: false
      }))
  )(cardNumberInputKey),
  checkboxInputs: {
    [cardCheckboxInputKey.agreeToTerms]: {
      checked: false,
      isValid: false
    }
  }
});

export const initialCardInputRefs: CardInputRefs = flow(
  (inputKeyEnum: typeof cardInputKey) => Object.keys(inputKeyEnum),
  (list: [string]) => keyBy(list),
  (dic) => mapValues(dic, () => React.createRef())
)(cardInputKey);
