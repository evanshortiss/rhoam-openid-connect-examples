import fetch, { Response } from "node-fetch";
import log from 'barelog'

export type Product = {
  id: string
  name: string
  description: string
  price: number
}

export class ProductsRequestError extends Error {
  constructor (public readonly statusCode: number, public readonly response: Response) {
    super(`Received a ${statusCode} response from the upstream API endpoint`)
  }
}

export default function fetchProducts (url: string, token: string) {
  log('fetching products from %s with token %s', url, token)
  return fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then(async (response) => {
    const { status } = response
    if (status !== 200) {
      const txt = await response.text()
      console.log('txt,', txt)
      throw new ProductsRequestError(status, response)
    } else {
      return response.json() as Promise<Product[]>
    }
  })
}
