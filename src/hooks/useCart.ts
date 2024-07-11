import { useState, useEffect, useMemo } from "react"
import { db } from '../data/db'
import { Guitar, CartItem } from '../types/index'

export const useCart = () => {
    
    const initialCart = () : CartItem[] => {
        const localStorageCart = localStorage.getItem('cart')
        return localStorageCart ? JSON.parse(localStorageCart) : []
    }
    
    const [data] = useState(db)
    const [cart, setCart] = useState(initialCart)

    const MAX_ITEMS = 5
    const MIN_ITEMS = 1

    useEffect( () => {
        localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart] )

    const addToCart = ( item : Guitar ) => {
        const itemExist = cart.findIndex( guitar => guitar.id === item.id )
        if (itemExist >= 0) { //verifica si ya existe
            if (cart[itemExist].quantity >= MAX_ITEMS) return 
            const updateCart = [...cart]
            updateCart[itemExist].quantity++
            setCart(updateCart)
        } else {
            const newItem : CartItem = {...item, quantity : 1}
            setCart([...cart, newItem])
        }
    }

    const removeFromCart = (id : Guitar['id']) => {
        setCart( prevCart => prevCart.filter( guitar => guitar.id !== id ) )
    }

    const decreaseQuantity = (id : Guitar['id']) => {
        const updateCart = cart.map( item => {
            if (item.id === id && item.quantity > MIN_ITEMS) {
            return {
                ...item,
                quantity: item.quantity - 1
            }
            }
            return item
        })
        setCart(updateCart)
    }

    const increaseQuantity = (id : Guitar['id']) => {
        const updateCart = cart.map( item => {
            if (item.id === id && item.quantity < MAX_ITEMS) {
            return {
                ...item,
                quantity: item.quantity + 1
            }
            }
            return item
        })
        setCart(updateCart)
    }

    const clearCart = () => {
        setCart([])
    }

    //state derivado
    const isEmpty = useMemo( () => cart.length === 0, [cart] )
    const cartTotal = useMemo( () => cart.reduce( (total, item) => total + (item.quantity * item.price), 0), [cart])


    return {
        data,
        cart,
        addToCart,
        removeFromCart,
        decreaseQuantity,
        increaseQuantity,
        clearCart,
        isEmpty,
        cartTotal
    }
}

