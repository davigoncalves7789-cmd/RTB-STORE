/**
 * userService: interface de autenticação.
 *
 * Ainda NÃO há login implementado nesta fase — isso é proposital, não um
 * descuido. Aqui só define-se o "contrato" (nomes e formato de retorno) que
 * o Firebase Authentication (login Google) vai implementar de verdade
 * futuramente, para que `userStore` e as telas já possam ser escritos contra
 * essa interface sem precisar ser reescritos depois.
 *
 * Por isso cada função lança um erro explícito em vez de simular um login
 * falso — simular um login fake seria pior do que deixar claro que a
 * funcionalidade ainda não existe.
 */

export async function loginWithGoogle() {
  throw new Error(
    'loginWithGoogle: ainda não implementado. Entra na Fase de integração com Firebase Authentication.'
  )
}

export async function logout() {
  throw new Error('logout: ainda não implementado.')
}

export async function getCurrentUser() {
  // Futuro: vai checar o estado de sessão do Firebase Auth.
  return null
}
