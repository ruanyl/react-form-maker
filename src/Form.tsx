import React from 'react'

export interface FormProps<T> {
  initialValues: T
  children: (form: FormObject<T>, handlers: Handlers<T>) => React.ReactNode
}

export interface FormState<T> {
  values: T
}

export interface FormValue<T> {
  value: T
}

export interface Handler<T> {
  handleChange: (value: T) => any
}

export type Handlers<T> = {
  [P in keyof T]: Handler<T[P]>
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
    this.createHandlers(props.initialValues)
    this.initialValues = props.initialValues
  }

  handlers: Handlers<TValue> = {} as Handlers<TValue>
  initialValues: TValue

  createFormObject = (values: TValue): FormObject<TValue> => {
    const formObject: FormObject<TValue> = {} as FormObject<TValue>
    Object.keys(values).forEach(k => {
      formObject[k as keyof TValue] = {
        value: values[k as keyof TValue],
      }
    })
    return formObject
  }

  createHandlers = (values: TValue) => {
    Object.keys(values).forEach(k => {
      if (!this.handlers[k as keyof TValue]) {
        this.handlers[k as keyof TValue] = {
          handleChange: (v: any) => this.onChange(k, v),
        }
      }
    })
    return this.handlers
  }

  onChange = (k: string, v: any) => {
    this.setState({ values: Object.assign({}, this.state.values, { [k]: v }) })
  }

  componentDidMount() {

  }

  render() {
    const formObject = this.createFormObject(this.state.values)
    return this.props.children(formObject, this.handlers)
  }
}
