import { Card } from 'app/services/cards/cardTypes';

export interface UserProfileResponse {
  payment_methods: {
    cards: Card[];
  };
  has_pin: boolean;
  is_using_onetouch_pay: boolean;
}

export interface UserState {
  isUserLoggedIn: boolean;
  isProfileFetching: boolean;
  isAddingCardFetching: boolean;
  isDeletingCardFetching: boolean;
  profile?: {
    paymentMethods: {
      cards: Card[];
    };
    hasPin: boolean;
    isUsingOnetouchPay: boolean;
  };
}

export interface FetchUserProfileFailurePayload {
  isUserLoggedIn: boolean;
}

export interface AddCardRequestPayload {
  card_number: string;
  card_password: string;
  card_expiration_date: string;
  tax_id: string;
}

export interface AddCardResponse {
  cards: Card[];
}

export interface DeleteCardRequestPayload {
  payment_method_id: string;
}
