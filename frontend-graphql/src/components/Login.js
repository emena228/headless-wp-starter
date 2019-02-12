import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { AUTH_TOKEN, USERNAME } from '../constants';

const LOGIN_MUTATION = gql`
  mutation LoginMutation(
    $username: String!
    $password: String!
    $clientMutationId: String!
  ) {
    login(
      input: {
        clientMutationId: $clientMutationId
        username: $username
        password: $password
      }
    ) {
      authToken
      user {
        nickname
      }
    }
  }
`;

class Login extends Component {
  state = {
    username: '',
    password: '',
  };

  confirm = async data => {
    const { history } = this.props;
    const { authToken, user } = data.login;
    localStorage.setItem(AUTH_TOKEN, authToken);
    localStorage.setItem(USERNAME, user.nickname);
    history.push(`/`);
  };

  render() {
    const { username, password } = this.state;
    const clientMutationId =
      Math.random()
        .toString(36)
        .substring(2) + new Date().getTime().toString(36);
    return (
      <div>
        <h4>Login</h4>
        <div className="flex flex-column login">
          <input
            className="input-padding"
            value={username}
            onChange={e => this.setState({ username: e.target.value })}
            type="text"
            placeholder="Your username"
          />
          <input
            className="input-padding"
            value={password}
            onChange={e => this.setState({ password: e.target.value })}
            type="password"
            placeholder="Your password"
          />
        </div>
        <div className=" mt3">
          <Mutation
            mutation={LOGIN_MUTATION}
            variables={{ username, password, clientMutationId }}
            onCompleted={data => this.confirm(data)}
          >
            {mutation => (
              <button className="pointer" type="button" onClick={mutation}>
                {'login'}
              </button>
            )}
          </Mutation>
        </div>
      </div>
    );
  }
}

export default Login;
