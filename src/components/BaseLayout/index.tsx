'use client'

import { useEffect } from "react";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import Hotjar from '@hotjar/browser';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

export default function BaseLayout({
    children,
}: {
    children: React.ReactNode
}) {
    useEffect(() => {
        Hotjar.init(3747665, 6);
    }, [])

    return (
        <>
            <Navbar />
            <ToastContainer theme="dark" />
            {children}
            <Footer />
        </>
    )
}
