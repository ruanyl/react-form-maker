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
        (formValues) => {
          console.log(formValues)
          return (
            <div>
              <input type="text" value={ formValues.name.value } onChange={ e => formValues.name.onChange(e.target.value) } />
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
