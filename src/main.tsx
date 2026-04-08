import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

import './index.css'

import Home from './pages/Home.tsx'
import Cart from './pages/Cart.tsx'
import Checkout from './pages/Checkout.tsx'
import Confirmation from './pages/Confirmation.tsx'
import Details from "./pages/Details.tsx";
import Layout from "./pages/Layout.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/details/:id" element={<Details />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/confirmation" element={<Confirmation />} />
                </Route>
            </Routes>
        </BrowserRouter>
    </StrictMode>,
)
