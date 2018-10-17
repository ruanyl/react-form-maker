import React from 'react'

export interface FormProps<T> {
  initialValues: T
  children: (form: FormObject<T>) => React.ReactNode
}

export interface FormState<T> {
  values: T
}

export interface FormValue<T> {
  value: T
  onChange: (value: T) => any
}

export type FormObject<T> = {
  [P in keyof T]: FormValue<T[P]>
}

export class Form<TValue = object> extends React.Component<FormProps<TValue>, FormState<TValue>> {

  constructor(props: FormProps<TValue>) {
    super(props)
    this.state = {
      values: props.initialValues
    }
  }

  createFormObject = (values: TValue): FormObject<TValue> => {
    const formObject: any = {}
    Object.keys(values).forEach(k => {
      formObject[k] = {
        value: values[k as keyof TValue],
        onChange: (v: any) => this.setState({ values: Object.assign({}, this.state.values, { [k]: v }) })
      }
    })
    return formObject
  }

  componentDidMount() {

  }

  render() {
    const formObject = this.createFormObject(this.state.values)
    return this.props.children(formObject)
  }
}
