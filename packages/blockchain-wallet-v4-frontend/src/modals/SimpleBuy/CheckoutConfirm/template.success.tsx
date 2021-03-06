import { Button, HeartbeatLoader, Icon, Text } from 'blockchain-info-components'
import { ErrorCartridge } from 'components/Cartridge'
import { fiatToString } from 'core/exchange/currency'
import { FlyoutWrapper, Row, Title, Value } from 'components/Flyout'
import { Form } from 'components/Form'
import { FormattedMessage } from 'react-intl'
import {
  getBaseAmount,
  getBaseCurrency,
  getCounterAmount,
  getCounterCurrency,
  getOrderType
} from 'data/components/simpleBuy/model'
import { InjectedFormProps, reduxForm } from 'redux-form'
import { Props as OwnProps, SuccessStateType } from '.'
import { SupportedWalletCurrenciesType } from 'core/types'

import { displayFiat, getPaymentMethod } from '../model'
import React from 'react'
import styled from 'styled-components'

const CustomForm = styled(Form)`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
const TopText = styled(Text)`
  display: flex;
  align-items: center;
`
const Bottom = styled(FlyoutWrapper)`
  display: flex;
  flex-direction: column;
  padding-top: 30px;
  height: 100%;
  text-align: center;
  border-top: 1px solid ${props => props.theme.grey000};
`
const Amount = styled.div`
  margin-top: 40px;
  > div {
    display: inline;
  }
`

const Success: React.FC<InjectedFormProps<{}, Props> & Props> = props => {
  const orderType = getOrderType(props.order)
  const baseAmount = getBaseAmount(props.order)
  const baseCurrency = getBaseCurrency(props.order, props.supportedCoins)
  const counterAmount = getCounterAmount(props.order)
  const counterCurrency = getCounterCurrency(props.order, props.supportedCoins)

  return (
    <CustomForm onSubmit={props.handleSubmit}>
      <FlyoutWrapper>
        <TopText color='grey800' size='20px' weight={600}>
          <Icon
            cursor
            name='arrow-left'
            size='20px'
            color='grey600'
            style={{ marginRight: '24px' }}
            role='button'
            onClick={() =>
              props.simpleBuyActions.setStep({
                order: props.order,
                step: 'CANCEL_ORDER'
              })
            }
          />
          <FormattedMessage
            id='modals.simplebuy.checkoutconfirm'
            defaultMessage='Checkout'
          />
        </TopText>
        <Amount data-e2e='sbTotalAmount'>
          <Text size='32px' weight={600} color='grey800'>
            {baseAmount}
          </Text>
          <Text size='32px' weight={600} color='grey800'>
            {baseCurrency}
          </Text>
        </Amount>
      </FlyoutWrapper>
      <Row>
        <Title>
          <FormattedMessage
            id='modals.simplebuy.confirm.coin_price'
            defaultMessage='{coin} Price'
            values={{
              coin: baseCurrency
            }}
          />
        </Title>
        <Value data-e2e='sbExchangeRate'>
          {displayFiat(props.order, props.supportedCoins, props.quote.rate)}
        </Value>
      </Row>
      <Row>
        <Title>
          <FormattedMessage id='copy.fee' defaultMessage='Fee' />
        </Title>
        <Value>
          {props.order.fee
            ? displayFiat(props.order, props.supportedCoins, props.order.fee)
            : `${displayFiat(
                props.order,
                props.supportedCoins,
                props.quote.fee
              )} ${props.order.inputCurrency}`}
        </Value>
      </Row>
      <Row>
        <Title>
          <FormattedMessage id='copy.total' defaultMessage='Total' />
        </Title>
        <Value data-e2e='sbFiatBuyAmount'>
          {fiatToString({ value: counterAmount, unit: counterCurrency })}
        </Value>
      </Row>
      <Row>
        <Title>
          <FormattedMessage
            id='modals.simplebuy.confirm.payment'
            defaultMessage='Payment Method'
          />
        </Title>
        <Value>{getPaymentMethod(props.order, props.supportedCoins)}</Value>
      </Row>
      <Bottom>
        <Text size='12px' weight={500} color='grey600'>
          <FormattedMessage
            id='modals.simplebuy.confirm.activity'
            defaultMessage='Your final amount may change due to market activity.'
          />
        </Text>
        <Button
          fullwidth
          nature='primary'
          data-e2e='confirmSBOrder'
          size='16px'
          height='48px'
          type='submit'
          style={{ marginTop: '28px' }}
          disabled={props.submitting}
        >
          {props.submitting ? (
            <HeartbeatLoader height='16px' width='16px' color='white' />
          ) : (
            `${
              orderType === 'BUY' ? 'Buy' : 'Sell'
            } ${baseAmount} ${baseCurrency}`
          )}
        </Button>
        <Button
          data-e2e='sbCancelCheckout'
          disabled={props.submitting}
          size='16px'
          height='48px'
          nature='light-red'
          onClick={() =>
            props.simpleBuyActions.setStep({
              step: 'CANCEL_ORDER',
              order: props.order
            })
          }
          style={{ marginTop: '16px' }}
        >
          <FormattedMessage id='buttons.cancel' defaultMessage='Cancel' />
        </Button>
        {props.error && (
          <ErrorCartridge
            style={{ marginTop: '16px' }}
            data-e2e='checkoutError'
          >
            <Icon
              name='alert-filled'
              color='red600'
              style={{ marginRight: '4px' }}
            />
            Error: {props.error}
          </ErrorCartridge>
        )}
      </Bottom>
    </CustomForm>
  )
}

type Props = OwnProps &
  SuccessStateType & { supportedCoins: SupportedWalletCurrenciesType }

export default reduxForm<{}, Props>({ form: 'sbCheckoutConfirm' })(Success)
