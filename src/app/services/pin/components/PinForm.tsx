import { css } from 'emotion';
import * as React from 'react';

import { FindPin } from 'app/services/pin/components/FindPin';
import { PinInputGroup } from 'app/services/pin/components/PinInputGroup';
import { PinButtonFunctionKey, PinButtonValue, PinPad } from 'app/services/pin/components/PinPad';
import { centralHeading2, resetLayout } from 'app/styles';

export interface PinFormProps {
  title: string;
  description?: string;
  showFindPin?: boolean;
  isSubmitting?: boolean;
  onSubmitPin: (pinList: number[]) => Promise<any>;
}

export interface PinFormState {
  pinList: number[];
}

const PIN_LENGTH = 6;

export class PinForm extends React.Component<PinFormProps, PinFormState> {
  public constructor(props: any) {
    super(props);
    this.state = {
      pinList: [],
    }
  }
  public static defaultProps = {
    description: null,
    showFindPin: false,
    isSubmitting: false,
  };

  private resetPinList = () => {
    this.setState({
      pinList: [],
    });
  }
  
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
    const newPinList = this.clickKey(this.state.pinList, key);
    this.setState({
      pinList: newPinList,
    });
    if (newPinList.length === PIN_LENGTH) {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          this.props.onSubmitPin(newPinList)
            .then(this.resetPinList);
        })
      });
    }
  }

  public render() {
    return (
      <>
        <h2 className={centralHeading2}>{this.props.title}</h2>
        {!!this.props.description && <p className={styles.description}>{this.props.description}</p>}
        {/* TODO: Show spinner if this.props.isSubmitting is true */}
        {
          this.props.isSubmitting && (
            <div>로딩 중... </div>
          )
        }
        <PinInputGroup pinList={this.state.pinList}/>
        {this.props.showFindPin && <FindPin />}
        <PinPad clickKey={this.handleClickKey} />
      </>
    );
  }
}

const styles = {
  description: css({
    ...resetLayout,
    marginTop: '13px',
    fontSize: '14px',
    lineHeight: '17px',
    textAlign: 'center',
    color: '#59667a',
  })
}