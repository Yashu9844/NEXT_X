"use client"

import React from 'react'

import { SessionProvider } from "next-auth/react"

const SeesionWrapper = ({children}) => {
  return (
    <SessionProvider>
       {children}
    </SessionProvider>
  )
}

export default SeesionWrapper
