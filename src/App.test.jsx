import '@testing-library/jest-dom';
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import LoginForm from "./App";
import * as utils from './utils';


describe('app', () => {
  
  // todo - 
  test(`O botão de login deve disparar a função login(), 
        importada no topo deste arquivo, 
        e passar os dados necessários.`, async () => {
    const loginSpy = vi.spyOn(utils, 'login');
          
    const { email, pass, btn } = renderLoginForm();

    await userEvent.type(email, 'email@mail.com')
    await userEvent.type(pass, 'pass123')
    await userEvent.click(btn);

    expect(loginSpy).toHaveBeenCalled();
    expect(loginSpy).toHaveBeenCalledWith({
      email: 'mail@mail.com', password: '123'
    });
  });

  test(`Desabilite o botão de Login caso o e-mail esteja em branco 
        OU a senha for menor que 6 dígitos.`, () => {
    
    const { btn } = renderLoginForm();
    
    expect(btn).toBeDisabled();    
  });

  test(`Desabilite o botão de Login 
        enquanto você está executando o login.`, async () => {
          
    const { btn, email, pass } = renderLoginForm();
    
    await act(async () => {
      await userEvent.type(email, 'email@mail.com')
      await userEvent.type(pass, 'password123')
    });
    
    await userEvent.click(btn);

    expect(btn).toBeDisabled();
    
    await new Promise((res) => 
      setTimeout(() => res(), 3500)
    )
    
    expect(btn).not.toBeDisabled();
  });

test(`
  Mostre uma mensagem de erro de login() 
  caso o Login falhe. 
  A mensagem deve ser limpa a cada nova 
  tentativa de Login.`, async () =>{

    const { btn, email, pass } = renderLoginForm();
    
    await act(async () => {
      await userEvent.type(email, 'email@mail.com')
      await userEvent.type(pass, 'wrongpass')
    });
    
    await userEvent.click(btn);

    expect(btn).toBeDisabled();
    expect(screen.queryByText(/e-mail or password wrong./i)).not.toBeInTheDocument();
    
    await new Promise((res) => 
      setTimeout(() => res(), 4000)
    )

    expect(screen.getByText(/e-mail or password wrong./i)).toBeInTheDocument();

}) 
test(`
  Mostre um alerta caso o login seja efetuado com sucesso 
  (javascript alert). Investigue a função login() 
  para entender como ter sucesso na requisição.`, async () => {
    
    const alertSpy = vi.spyOn(window, 'alert');

    const { btn, email, pass } = renderLoginForm();
    
    await act(async () => {
      await userEvent.type(email, 'email@mail.com')
      await userEvent.type(pass, 'password123')
    });
    
    await userEvent.click(btn);

    expect(btn).toBeDisabled();
    expect(screen.queryByText(/e-mail or password wrong./i)).not.toBeInTheDocument();
    
    await new Promise((res) => 
      setTimeout(() => res(), 4000)
    )
    expect(alertSpy).toHaveBeenCalled();
    expect(screen.queryByText(/e-mail or password wrong./i)).not.toBeInTheDocument();
})

})

function renderLoginForm() {
  render(<LoginForm />);
  const email = screen.getByLabelText(/email/i);
  const pass = screen.getByLabelText(/password/i);
  const btn = screen.getByRole('button');
  return { email, pass, btn };
}
