import React from 'react'
import { render } from 'react-dom'

import { Form } from '../src/Form'

interface Values {
  name: string
  age: number
  gender: string
}

const asyncValidator = (v: any) => new Promise<boolean>(resolve => setTimeout(() => resolve(false), 1000))

class MyForm extends Form<Values> {}

class App extends React.PureComponent<{}, {}> {
  render() {
    return (
      <MyForm initialValues={{ name: '', age: 0, gender: 'female' }} validators={{ name: v => v.length > 0, age: asyncValidator }}>
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
              <input
              type="text"
              value={ form.age.value }
              onChange={ e => handlers.age.handleChange(parseInt(e.target.value)) }
              onBlur={ handlers.age.handleBlur }
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
