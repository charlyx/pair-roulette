import React from 'react'
import { render, fireEvent, waitForElement } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { Preferences } from './Preferences'

describe('Preferences', () => {
  const updatePreferences = jest.fn()

  beforeEach(jest.clearAllMocks)

  it('should render 3 language list', () => {
    const wrapper = render(<Preferences onSubmit={updatePreferences} />)

    expect(wrapper.queryByLabelText('First language')).not.toBeNull()
    expect(wrapper.queryByLabelText('Second language')).not.toBeNull()
    expect(wrapper.queryByLabelText('Third language')).not.toBeNull()
  })

  it('should initialize language lists with placeholder value', () => {
    const wrapper = render(<Preferences onSubmit={updatePreferences} />)
    const firstLanguage = wrapper.getByLabelText('First language')
    const secondLanguage = wrapper.getByLabelText('Second language')
    const thirdLanguage = wrapper.getByLabelText('Third language')

    expect(firstLanguage.value).toBe('-1')
    expect(secondLanguage.value).toBe('-1')
    expect(thirdLanguage.value).toBe('-1')
  })

  it('should have first language required', () => {
    const wrapper = render(<Preferences onSubmit={updatePreferences} />)

    const firstLanguage = wrapper.getByLabelText('First language')

    expect(firstLanguage.hasAttribute('required')).toBe(true)
  })

  it('should remove first selected language from other list', () => {
    const wrapper = render(<Preferences onSubmit={updatePreferences} />)
    const firstLanguage = wrapper.getByLabelText('First language')
    const secondLanguage = wrapper.getByLabelText('Second language')
    const thirdLanguage = wrapper.getByLabelText('Third language')

    fireEvent.change(firstLanguage, { target: { value: 'Javascript' } })

    expect(secondLanguage.querySelector('[value=Javascript]')).toBeNull()
    expect(thirdLanguage.querySelector('[value=Javascript]')).toBeNull()
  })

  it('should remove second selected language from other list', () => {
    const wrapper = render(<Preferences onSubmit={updatePreferences} />)
    const firstLanguage = wrapper.getByLabelText('First language')
    const secondLanguage = wrapper.getByLabelText('Second language')
    const thirdLanguage = wrapper.getByLabelText('Third language')

    fireEvent.change(secondLanguage, { target: { value: 'Javascript' } })

    expect(firstLanguage.querySelector('[value=Javascript]')).toBeNull()
    expect(thirdLanguage.querySelector('[value=Javascript]')).toBeNull()
  })

  it('should remove third selected language from other list', () => {
    const wrapper = render(<Preferences onSubmit={updatePreferences} />)
    const firstLanguage = wrapper.getByLabelText('First language')
    const secondLanguage = wrapper.getByLabelText('Second language')
    const thirdLanguage = wrapper.getByLabelText('Third language')

    fireEvent.change(thirdLanguage, { target: { value: 'Javascript' } })

    expect(firstLanguage.querySelector('[value=Javascript]')).toBeNull()
    expect(secondLanguage.querySelector('[value=Javascript]')).toBeNull()
  })

  it('should not call updatePreferences with empty preferences', () => {
    const wrapper = render(<Preferences onSubmit={updatePreferences} />)
    const saveButton = wrapper.getByText('Enregistrer')
    const firstLanguage = wrapper.getByLabelText('First language')


    fireEvent.change(firstLanguage, { target: { value: 'Javascript' } })
    fireEvent.click(saveButton)

    expect(updatePreferences).toHaveBeenNthCalledWith(1, ['Javascript'])
  })
})

jest.mock('./firebase', () => ({
  useFirebaseAuth: () => ({ user: {} }),
  useFirebaseApp: () => {},
}))
