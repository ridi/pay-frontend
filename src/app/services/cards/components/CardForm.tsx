import { Button } from '@ridi/rsg/components/dist/button';
import { CheckBox } from '@ridi/rsg/components/dist/check_box';
import detectIt from 'detect-it';
import { every } from 'lodash-es';
import * as React from 'react';
import { Link } from 'react-router-dom';

import { SpaceKeyCode } from 'app/components';
import {
  cardCheckboxInputKey,
  CardFormState,
  CardInput,
  CardInputKey,
  CardInputProps,
  cardNumberInputAutoCompleteProps,
  cardNumberInputKey,
  cardNumberInputName,
  initialCardFormState,
  initialCardInputRefs,
} from 'app/services/cards/components';
import { agreeToTermsCheckbox, cardInputBox, cardInputBox60, cardInputBoxAgreeToTerms, cardInputBoxBorder, cardInputBoxBorderInteractive, cardInputBoxInline, cardInputBoxInlineGroup, cardInputBoxLabel, cardInputGroup, expDateDelimiter, innerInputJust } from 'app/services/cards/components/CardForm.styles';
import { a11y } from 'app/styles';
import {
  cleanUpCardNumber,
  getCardTypeByNumber,
  prettifyCardNumber,
} from 'app/utils';
import { cx } from 'emotion';

const isTouchDevice = detectIt.hasTouch;

function preventDefaultOnSpaceKeyEvent(e: React.KeyboardEvent<HTMLInputElement>) {
  if (e.keyCode === SpaceKeyCode) {
    e.preventDefault();
  }
}

export class CardForm extends React.PureComponent<{}, CardFormState> {
  public state = initialCardFormState;
  public inputRefs = initialCardInputRefs;

  private getHandleChangeNumberInput = (inputKey: string) => {
    return (event: React.SyntheticEvent<HTMLInputElement>) => {
      const newInputs = { ...this.state.numberInputs };

      newInputs[inputKey].value = event.currentTarget.value;
      newInputs[inputKey].isValid = newInputs[inputKey].regexp.test(event.currentTarget.value);

      this.setState({
        numberInputs: newInputs,
      });
    };
  }

  private handleChangeCardNumberInput = (event: React.SyntheticEvent<HTMLInputElement>) => {
    const inputKey = cardNumberInputKey.cardnumber;
    const newInputs = { ...this.state.numberInputs };

    const cardNumber = cleanUpCardNumber(event.currentTarget.value);
    const cardType = getCardTypeByNumber(cardNumber);

    newInputs[inputKey].value = prettifyCardNumber(cardNumber, cardType);
    newInputs[inputKey].regexp = cardType.pattern;
    newInputs[inputKey].isValid = cardType.pattern.test(cardNumber);
    newInputs[inputKey].maxLength = cardType.maxLength + cardType.gap.length;

    this.setState({
      numberInputs: newInputs,
    });
  }

  private getHandleChangeCheckbox = (inputKey: string) => {
    return (event: React.SyntheticEvent<HTMLInputElement>) => {
      const newInputs = { ...this.state.checkboxInputs };

      newInputs[inputKey].checked = event.currentTarget.checked;
      newInputs[inputKey].isValid = event.currentTarget.checked;

      this.setState({
        checkboxInputs: newInputs,
      });
    };
  }

  private getInputRef = (inputKey: string) => {
    return this.inputRefs[inputKey];
  }

  private getDeleteLastChar = (inputKey: string) => {
    return () => {
      this.setState((prevState: CardFormState) => ({
        numberInputs: {
          ...prevState.numberInputs,
          [inputKey]: {
            ...prevState.numberInputs[inputKey],
            value: prevState.numberInputs[inputKey].value.slice(0, -1),
          },
        },
      }));
    };
  }

  private isFormValid = () => {
    return every(this.state.numberInputs, ((input) => input.isValid)) &&
      every(this.state.checkboxInputs, ((input) => input.isValid));
  }

  private renderCardInput = ({
    currentInputKey,
    prevInputKey,
    nextInputKey,
    onChange,
    formatValue = (value) => value,
    className,
    placeholder,
    extraProps,
  }: {
    currentInputKey: CardInputKey;
    prevInputKey?: CardInputKey;
    nextInputKey?: CardInputKey;
    onChange?: (event: React.SyntheticEvent<HTMLInputElement>) => void;
    formatValue?: (value: string) => string;
    className?: string;
    placeholder?: string;
    extraProps?: Partial<CardInputProps>;
  }) => {
    const { numberInputs } = this.state;
    return (
      <CardInput
        id={currentInputKey}
        name={cardNumberInputName[currentInputKey]}
        autoComplete={cardNumberInputAutoCompleteProps[currentInputKey]}
        className={className}
        value={formatValue(numberInputs[currentInputKey].value)}
        onChange={onChange || this.getHandleChangeNumberInput(currentInputKey)}
        refObject={this.getInputRef(currentInputKey)}
        prevInputRef={prevInputKey ? this.getInputRef(prevInputKey) : undefined}
        nextInputRef={nextInputKey ? this.getInputRef(nextInputKey) : undefined}
        deletePrevInputLastChar={prevInputKey ? this.getDeleteLastChar(prevInputKey) : undefined}
        maxLength={numberInputs[currentInputKey].maxLength}
        pattern={numberInputs[currentInputKey].regexp.toString()}
        placeholder={placeholder}
        required={true}
        {...extraProps}
      />
    );
  }

  public componentDidMount() {
    if (!isTouchDevice) {
      // autofocus 속성을 사용하거나 requestAnimationFrame 사용 시
      // 포커스 outline 스타일이 보였다 사라지므로 setTimeout으로 처리
      window.setTimeout(() => {
        this.inputRefs[cardNumberInputKey.cardnumber].current.focus();
      }, 500);
    }
  }

  public render() {
    const { checkboxInputs } = this.state;

    return (
      <form
        id="RegisterCreditCard_Form"
        className="RegisterCreditCard_Form"
      >
        <div className={cardInputGroup}>
          <div className={cardInputBox60}>
            <label htmlFor={cardNumberInputKey.cardnumber} className={cardInputBoxLabel}>
              카드 번호
            </label>
            {this.renderCardInput({
              currentInputKey: cardNumberInputKey.cardnumber,
              nextInputKey: cardNumberInputKey.ccmonth,
              onChange: this.handleChangeCardNumberInput,
              placeholder: `‘-’ 없이 입력`,
              extraProps: {
                allowSpace: true,
                onKeyDown: preventDefaultOnSpaceKeyEvent,
              },
            })}
            <div className={cardInputBoxBorderInteractive} />
          </div>
          <div className={cardInputBoxInlineGroup}>
            <div
              id="ccexp"
              className={cardInputBoxInline}
            >
              <p className={cardInputBoxLabel}>유효 기간</p>
              {this.renderCardInput({
                currentInputKey: cardNumberInputKey.ccmonth,
                prevInputKey: cardNumberInputKey.cardnumber,
                nextInputKey: cardNumberInputKey.ccyear,
                placeholder: 'MM',
                className: innerInputJust,
              })}
              <label htmlFor={cardNumberInputKey.ccmonth} className={a11y}>
                만료 월
              </label>
              <span className={expDateDelimiter}>/</span>
              {this.renderCardInput({
                currentInputKey: cardNumberInputKey.ccyear,
                prevInputKey: cardNumberInputKey.ccmonth,
                nextInputKey: cardNumberInputKey.password,
                placeholder: 'YY',
                className: innerInputJust,
              })}
              <label htmlFor={cardNumberInputKey.ccyear} className={a11y}>
                만료 연도
              </label>
              <div className={cardInputBoxBorderInteractive} />
            </div>
            {/*
              [name="new-password"] for preventing wrong autofill in password field
              doesn't seem to work from 1 day after implementing, not sure why
              next line which is working for now  either could not work after few days. -_-;
              referenced from: https://stackoverflow.com/questions/47775041/disable-autofill-in-chrome-63
            */}
            <input style={{ display: 'none' }}/>
            <div className={cardInputBoxInline}>
              <label htmlFor={cardNumberInputKey.password} className={cardInputBoxLabel}>
                카드 비밀번호
              </label>
              {this.renderCardInput({
                currentInputKey: cardNumberInputKey.password,
                prevInputKey: cardNumberInputKey.ccyear,
                nextInputKey: cardNumberInputKey.birthdate,
                placeholder: '앞 2자리',
                extraProps: {
                  isObscured: true,
                  // Workaround to prevent wrong autofill action since `autoComplete="off"`doesn't work in Chrome
                  // (https://stackoverflow.com/questions/50661767/prevent-chrome-autosuggest-list)
                  // It's against semantic however no other workaround seems to work and voice over works
                  // since this removes only meaning, not content, so..¯\_(ツ)_/¯
                  role: 'presentation',
                },
              })}
              <div className={cardInputBoxBorderInteractive} />
            </div>
          </div>
          <div className={cardInputBox60}>
            <label htmlFor={cardNumberInputKey.birthdate} className={cardInputBoxLabel}>생년월일</label>
            {this.renderCardInput({
              currentInputKey: cardNumberInputKey.birthdate,
              prevInputKey: cardNumberInputKey.password,
              placeholder: '6자리 입력 (예: 840331)',
            })}
            <div className={cardInputBoxBorderInteractive} />
          </div>
        </div>
        <div className={cardInputGroup}>
          <div className={cardInputBoxAgreeToTerms}>
            <CheckBox
              className={agreeToTermsCheckbox}
              checked={!!checkboxInputs[cardCheckboxInputKey.agreeToTerms].checked}
              onChange={this.getHandleChangeCheckbox(cardCheckboxInputKey.agreeToTerms)}
            >
              이용약관 동의
            </CheckBox>
            <div className={cardInputBoxBorder} />
            <Link className="RegisterCreditCard_TermsLink" to="/register/terms">
              약관 보기
            </Link>
          </div>
        </div>
        <Button
          className="RegisterCreditCard_SubmitButton"
          color="blue"
          size="large"
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => e.preventDefault()}
          disabled={!this.isFormValid()}
        >
          카드 등록
        </Button>
      </form>
    );
  }
}