import React from 'react'
import { render } from 'react-dom'

import { Form } from '../src/Form'

interface Values {
  name: string
  age: number
  gender: string
}

class MyForm extends Form<Values> {}

class App extends React.PureComponent<{}, {}> {
  render() {
    return (
      <MyForm initialValues={{ name: '', age: 0, gender: 'female' }}>
      {
        (form, handlers) => {
          console.log(form)
          return (
            <div>
              <input
              type="text"
              value={ form.name.value }
              onChange={ e => handlers.name.handleChange(e.target.value) }
              onBlur={ handlers.name.handleBlur }
              />
            </div>
          )
        }
      }
      </MyForm>
    )
  }
}

render(
  <App />,
  document.getElementById('root')
)
