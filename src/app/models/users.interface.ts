export interface User {
  createdAt: string|number|Date
  id: number
  firstName: string
  lastName: string
  maidenName: string
  age: number
  gender: string
  email: string
  username:String
  image: string
  phone?:string
  birthDate?:string
  royaltyPoints?:number
  country?:string
  billingAddress?:string
  address?:string
  joined?:string

//  Added  these custom fields
  paymentMethods?: string[];
  
}
