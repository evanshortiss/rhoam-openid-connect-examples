import { useEffect, useState } from "react"
import Spinner from "./Spinner"

type Product = {
  id: string
  name: string
  description: string
  price: number
}

const ProductsList: React.FC<{ token: string }> = ({ token }) => {
  const [ products, setProducts ] = useState<Product[]>()
  const [ message, setMessage ] = useState<string>('Fetching Products')

  useEffect(() => {
    const fetchProducts = async () => {
      const url = new URL('/api/products', process.env.REACT_APP_PRODUCT_API_URL as string)

      try {
        const response = await fetch(url.toString(), {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const products = await response.json() as Product[]
        setProducts(products)
      } catch (e) {
        console.error('error fetching products', e)
        setMessage(`Failed to fetch products: ${e.toString()}`)
      }
    }

    setTimeout(() => fetchProducts(), 1000)
  }, [token])


  if (products) {
    const els = products.map((product) => {
      return (
        <div key={`product-${product.id}`} className="grid grid-cols-5 gap-4 border-t pb-2 mb-4">
          <div key={`product-detail-${product.id}`} className="col-span-4 pr-4">
            <h3 className="font-semibold pb-2 pt-2">{product.name}</h3>
            <p className="text-gray-200">{product.description}</p>
          </div>
          <div key={`product-price-${product.id}`} className="col-span-1 flex items-start text-right">
            <p className="font-semibold text-gray-200 w-full pt-2">${product.price.toFixed(2)}</p>
          </div>
        </div>
      )
    })
    return (
      <div>
        <div className="grid grid-cols-5 gap-4 py-4">
          <h2 className="text-2xl text-gray-400 col-span-4">
            Products
          </h2>
          <h2 className="text-2xl text-gray-400 col-span-1 text-right">
            Price
          </h2>
        </div>
        {els}
      </div>
    )
  } else {
    return <Spinner message={message}/>
  }
}

export default ProductsList
