"use client"

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider } from '@chakra-ui/react'
import { SessionProvider } from 'next-auth/react'
import { extendTheme } from '@chakra-ui/react'
import store from '@/redux/store'
import { Provider } from 'react-redux'

const config = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

export const theme = extendTheme({ config })




const Providers = ({ children, session }) => {
  return (
    <SessionProvider session={session}>
      <CacheProvider>
        <ChakraProvider theme={theme}>
          <Provider store={store}>
            {children}
          </Provider>
        </ChakraProvider>
      </CacheProvider>
    </SessionProvider>
  )
}

export default Providers