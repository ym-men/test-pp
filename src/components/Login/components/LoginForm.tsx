import * as React from 'react';
import { Form, FormField, TextInput, Text } from 'grommet';
import { Button } from 'components/ui';

export class LoginForm extends React.PureComponent<IProps, IState> {
  public readonly state = { user: '', password: '' };

  public render(): React.ReactNode {
    const errors = { user: '', password: '', custom: '' };
    const status = (this.props.error && this.props.error.status) || 200;
    switch (status) {
      case 404:
        errors.user = 'Пользователь не найден';
        break;
      case 400:
        errors.password = 'Неверный пароль';
        break;
      default:
        errors.custom = (status !== 200 && 'Неизвестная ошибка') || '';
    }

    return (
      <Form>
        <FormField label="Пользователь" htmlFor="user" error={errors.user}>
          <TextInput
            id="login-textInput-user"
            placeholder="email"
            value={this.state.user}
            onChange={this.changeHandler('user')}
            required={true}
          />
        </FormField>
        <FormField label="Пароль" htmlFor="password" error={errors.password}>
          <TextInput
            id="login-textInput-password"
            type="password"
            placeholder="password"
            value={this.state.password}
            onChange={this.changeHandler('password')}
            required={true}
          />
        </FormField>

        <Button
          btnType="promise"
          id="login-button-submit"
          primary={true}
          label="Login"
          onClick={async () => {
            await this.props.onLogin(this.state);
          }}
        />
        {errors.custom && <Text>{errors.custom}</Text>}
      </Form>
    );
  }

  protected changeHandler = (field: 'user' | 'password') => (
    ev: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = ev.target;
    this.setState({ [field]: value } as any);
  };
}

interface IProps {
  onLogin: ({ value }: any) => void;
  error: any;
}

interface IState {
  user: string;
  password: string;
}
