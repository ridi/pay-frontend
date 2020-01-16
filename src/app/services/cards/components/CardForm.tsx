import { Button, CheckBox } from '@ridi/rsg';
import * as classNames from 'classnames';
import { CreditCardType } from 'cleave.js/options/creditCard'
import * as Cleave from 'cleave.js/react'
import detectIt from 'detect-it';
import { every } from 'lodash-es';
import * as React from 'react';
import { Link } from 'react-router-dom';

import { history } from 'app/config';
import { urls } from 'app/routes';
import {
  cardCheckboxInputKey,
  CardFormState,
  CardInput,
  CardInputKey,
  CardInputProps,
  cardNumberInputAutoCompleteProps,
  cardNumberInputKey,
  cardNumberInputName,
  getInitialCardFormState,
  initialCardInputRefs,
} from 'app/services/cards/components';
import { agreementLinkClass, agreeToTermsCheckbox, cardFormSubmitButtonClass, cardFormSubmitDisabledButtonClass, cardInputBox60, cardInputBoxAgreeToTerms, cardInputBoxBorder, cardInputBoxBorderInteractive, cardInputBoxInline, cardInputBoxInlineGroup, cardInputBoxLabel, cardInputGroup, expDateDelimiter, innerInput, innerInputJust } from 'app/services/cards/components/CardForm.styles';
import { UserActions } from 'app/services/user/userActions';
import { requestRegisterCard } from 'app/services/user/userRequests';
import { RegisterCardPayload, RegisterCardResponse } from 'app/services/user/userTypes';
import { RootState } from 'app/store';
import { a11y } from 'app/styles';
import { AxiosResponse } from 'axios';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { numberInputRegexes } from './CardForm.state';

const cardFormStorageKey = 'cardForm'
const isTouchDevice = detectIt.hasTouch;

interface StorageData {
  storedAt: number;
  state: State;
}

interface CardFormProps {
  type: string;
}


type CleaveChangeEvent = React.ChangeEvent<HTMLInputElement & { rawValue: string }>;

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & CardFormProps
interface State extends CardFormState {
  isFetching: boolean;
  cardNumber: string;
  creditCardType: CreditCardType;
  displayLegal: boolean;
}

export class CardForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      ...getInitialCardFormState(),
      displayLegal: false,
      isFetching: false,
      cardNumber: '',
      creditCardType: 'unknown',
    };
  }
  private cardNumberRef: HTMLInputElement;
  private isSubmitted: boolean = false;
  public state: State;
  public inputRefs = initialCardInputRefs;

  private getCreditCardNumberValidLength = (): number => {
    if (this.state.creditCardType === 'amex') {
      return 15;
    } else if (this.state.creditCardType === 'diners') {
      return 14;
    }
    return 16;
  }

  private getHandleChangeNumberInput = (inputKey: string) => {
    return (event: React.SyntheticEvent<HTMLInputElement>) => {
      const newInputs = { ...this.state.numberInputs };

      newInputs[inputKey].value = event.currentTarget.value;
      newInputs[inputKey].isValid = numberInputRegexes[inputKey].test(event.currentTarget.value);

      this.setState({
        numberInputs: newInputs,
      });
    };
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

  private isFormValid = () => {
    return (
      // Delegate card number validation to backend
      this.state.cardNumber.length >= 14 &&
      every(this.state.numberInputs, ((input) => input.isValid)) &&
      every(this.state.checkboxInputs, ((input) => input.isValid))
    );
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
        maxLength={numberInputs[currentInputKey].maxLength}
        pattern={numberInputRegexes[currentInputKey].toString()}
        placeholder={placeholder}
        required={true}
        {...extraProps}
      />
    );
  }

  private handleSubmitButtonClick = async (e: React.MouseEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (this.state.isFetching || !this.isFormValid()) {
      return;
    }
    const { numberInputs, cardNumber } = this.state;
    const { ccmonth, ccyear, cardnumber, password, birthdate } = cardNumberInputKey;
    const expirationDate = `${numberInputs[ccyear].value}${numberInputs[ccmonth].value}`
    this.setState({ isFetching: true })

    try {
      const response: AxiosResponse<RegisterCardPayload> = await requestRegisterCard({
        card_expiration_date: expirationDate,
        card_number: cardNumber,
        card_password: numberInputs[password].value,
        tax_id: numberInputs[birthdate].value,
      });
      this.props.dispatchUpdateCardRegistrationToken({ validation_token: response.data.validation_token });
      this.isSubmitted = true;
      history.replace(urls.REGISTER_PIN);
    } catch (e) {
      if (e.data.code === 'CARD_REGISTRATION_FAILED') {
        alert(`${e.data.message}\n[${e.data.pg_message}]`);
      } else {
        alert(e.data.message);
      }
      this.setState({ isFetching: false });
    }
  }

  public componentDidMount = () =>  {
    if (this.props.cardExists && this.props.type === 'register') {
      history.replace(urls.SETTINGS);
      return;
    }
    // 카드 변경 url로 들어왔는데 카드가 없을 때
    if (!this.props.cardExists && this.props.type === 'change') {
      history.replace(urls.SETTINGS);
      return;
    }

    if (!isTouchDevice) {
      // autofocus 속성을 사용하거나 requestAnimationFrame 사용 시
      // 포커스 outline 스타일이 보였다 사라지므로 setTimeout으로 처리
      window.setTimeout(() => {
        if (this.cardNumberRef) {
          this.cardNumberRef.focus();
        }
      }, 500);
    }
  }

  public render() {
    const { checkboxInputs } = this.state;

    return (
      <div
        id="RegisterCreditCard_Form"
        className="RegisterCreditCard_Form"
      >
        <div className={cardInputGroup}>
          <div className={cardInputBox60}>
            <label htmlFor={cardNumberInputKey.cardnumber} className={cardInputBoxLabel}>
              카드 번호
            </label>
            <Cleave
              options={{
                creditCard: true,
                onCreditCardTypeChanged: (creditCardType: CreditCardType) => this.setState({ creditCardType }),
              }}
              onChange={(e: CleaveChangeEvent) => {
                const { rawValue } = e.target;
                const { cardNumber } = this.state;
                const hasLastCharacterAdded = cardNumber.slice(0, rawValue.length - 1) === rawValue.slice(0, rawValue.length - 1);
                if (
                  rawValue.length === this.getCreditCardNumberValidLength() && 
                  hasLastCharacterAdded &&
                  rawValue !== cardNumber
                ) {
                  this.inputRefs[cardNumberInputKey.ccmonth].current.focus();
                }
                this.setState({ cardNumber: rawValue });
              }}
              className={classNames([innerInput])}
              placeholder="'-' 없이 입력"
              name={cardNumberInputName[cardNumberInputKey.cardnumber]}
              autoComplete={cardNumberInputAutoCompleteProps[cardNumberInputKey.cardnumber]}
              id={cardNumberInputKey.cardnumber}
              htmlRef={cardNumberRef => this.cardNumberRef = cardNumberRef}
              value={this.state.cardNumber}
              type="tel"
            />
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
            <label htmlFor={cardNumberInputKey.birthdate} className={cardInputBoxLabel}>생년월일 / 사업자번호</label>
            {this.renderCardInput({
              currentInputKey: cardNumberInputKey.birthdate,
              placeholder: '생년월일 6자리 / 사업자번호 10자리',
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
            <Link
              className={agreementLinkClass}
              to="/legal/terms"
              target="_blank"
            >
              약관 보기
            </Link>
          </div>
        </div>
        <Button
          className={classNames(cardFormSubmitButtonClass, { [cardFormSubmitDisabledButtonClass]: !this.isFormValid() })}
          onClick={this.handleSubmitButtonClick}
          disabled={!this.isFormValid()}
          spinner={this.state.isFetching}
          color="blue"
        >
          카드 등록
        </Button>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    cardExists: state.user.cards.length > 0,
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    dispatchUpdateCardRegistrationToken: (payload: RegisterCardPayload) => dispatch(UserActions.updateCardRegistrationToken(payload)),
    // dispatchRequestRegisterCard: (payload: RegisterCardRequestPayload) => dispatch(UserActions.registerCardRequest(payload))
  }
}

export const ConnectedCardForm = connect(mapStateToProps, mapDispatchToProps)(CardForm);