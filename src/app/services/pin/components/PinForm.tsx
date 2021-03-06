import * as classNames from 'classnames';
import { css } from 'emotion';
import * as React from 'react';

import { ConnectedFindPin, FindPin } from 'app/services/pin/components/FindPin';
import { PinInputGroup, PinList } from 'app/services/pin/components/PinInputGroup';
import { PinButtonFunctionKey, PinButtonValue, PinPad } from 'app/services/pin/components/PinPad';
import { applyGraySpinner, breakpoints, centralHeading2, paperProStylesClassName, paperStylesClassName, resetLayout } from 'app/styles';

export type PinFormOnSubmit = (pinList: PinList) => any;
export interface PinFormProps {
  title: string;
  pinList: PinList;
  description?: string;
  showFindPin?: boolean;
  isSubmitting?: boolean;
  onSubmitPin: PinFormOnSubmit;
  onChange: (pinList: PinList) => any;
}

const PIN_LENGTH = 6;

export class PinForm extends React.Component<PinFormProps> {
  public static defaultProps = {
    description: null,
    showFindPin: false,
    isSubmitting: false,
  };

  private clickKey = (pinList: number[], key: PinButtonValue) => {
    switch (key) {
      case PinButtonFunctionKey.clear:
        return [];
      case PinButtonFunctionKey.delete:
        return pinList.slice(0, -1);
      default:
        return pinList.concat(pinList.length < PIN_LENGTH ? [key] : []);
    }
  }

  public handleClickKey = (key: PinButtonValue) => {
    const newPinList = this.clickKey(this.props.pinList, key);
    this.props.onChange(newPinList);
    if (newPinList.length === PIN_LENGTH) {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          this.props.onSubmitPin(newPinList);
        })
      });
    }
  }

  public render() {
    return (
      <>
        <h2 className={classNames(centralHeading2, styles.title)}>{this.props.title}</h2>
        {!!this.props.description && <p className={styles.description}>{this.props.description}</p>}
        {
          this.props.isSubmitting ?
            <div className={styles.spinner} /> :
            <PinInputGroup pinList={this.props.pinList}/>
        }
        {this.props.showFindPin && <ConnectedFindPin />}
        <PinPad clickKey={this.handleClickKey} />
      </>
    );
  }
}

const styles = {
  title: css({
    [breakpoints.pinPageSmallHeight]: {
      marginTop: '6vh'
    },
  }),
  spinner: css({
    height: '40px',
    margin: '35px 0 55px',
    ...applyGraySpinner('40px'),
    [`.${paperStylesClassName} &`]: {
      background: 'url(/public/images/spinner/gray_line.e.gif) no-repeat center center',
      height: '20px',
      width: 'auto',
      margin: '30px 0 60px',
      '&::after': {
        content: 'none',
      }
    },
    [`.${paperProStylesClassName} &`]: {
      height: '30px',
      margin: '46px 0 90px',
    }
  } as {}),
  description: css({
    ...resetLayout,
    marginTop: '13px',
    fontSize: '14px',
    lineHeight: '17px',
    textAlign: 'center',
    color: '#59667a',
  })
}