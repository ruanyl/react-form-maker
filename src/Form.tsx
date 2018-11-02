import React from 'react'

export interface FormProps<T> {
  initialValues: T
  validators: Validators<T>
  children: (form: FormObject<T>, handlers: Handlers<T>) => React.ReactNode
}

type Validators<T> = {
  [K in keyof T]?: (v: T[K], values: T) => boolean | Promise<boolean>
}

export interface FormState<T> {
  values: T
  touched: string[]
  validationResults: {
    [P in keyof T]: boolean | undefined
  }
}

export interface FormValue<T> {
  value: T
  touched: boolean
  invalid: boolean | undefined
}

export interface Handler<T> {
  handleChange: (value: T) => any
  handleBlur: () => any
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
      values: props.initialValues,
      touched: [],
      validationResults: {} as FormState<TValue>['validationResults'],
    }
    this.createHandlers(props.initialValues)
    this.initialValues = props.initialValues
  }

  handlers: Handlers<TValue> = {} as Handlers<TValue>
  initialValues: TValue

  createFormObject = (values: TValue): FormObject<TValue> => {
    const formObject: FormObject<TValue> = {} as FormObject<TValue>
    Object.keys(values).forEach(k => {
      const name = k as keyof TValue
      const value = values[name]
      const touched = this.state.touched.includes(k)
      const invalid = this.state.validationResults[name] === undefined ? undefined : !this.state.validationResults[name]
      formObject[name] = {
        value,
        touched,
        invalid,
      }
    })
    return formObject
  }

  createHandlers = (values: TValue) => {
    Object.keys(values).forEach(k => {
      const name = k as keyof TValue
      if (!this.handlers[name]) {
        this.handlers[name] = {
          handleChange: (v: any) => this.onChange(name, v),
          handleBlur: () => this.onBlur(name)
        }
      }
    })
    return this.handlers
  }

  onChange = (k: keyof TValue, v: any) => {
    this.setState({
      values: Object.assign({}, this.state.values, { [k]: v }),
      touched: !this.state.touched.includes(k as string) ? this.state.touched.concat(k as string) : this.state.touched,
    })
    this.validate(k, v)
  }

  validate = (k: keyof TValue, v: any) => {
    if (this.props.validators[k]) {
      const validator = this.props.validators[k];
      Promise.resolve(validator!(v, this.state.values)).then(valid => {
        this.setState({ validationResults: Object.assign({}, this.state.validationResults, { [k]: valid }) })
      })
    }
  }

  onBlur = (k: keyof TValue) => {
    if (!this.state.touched.includes(k as string)) {
      this.setState({
        touched: this.state.touched.concat(k as string),
      })
      this.validate(k, this.props.initialValues[k])
    }
  }

  componentDidMount() {

  }

  render() {
    const formObject = this.createFormObject(this.state.values)
    return this.props.children(formObject, this.handlers)
  }
}
