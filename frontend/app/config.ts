import { 
    createConfig, 
    http, 
    cookieStorage,
    createStorage
  } from 'wagmi'
  import { sepolia } from 'wagmi/chains'
  
  export function getConfig() {
    return createConfig({
      chains: [sepolia],
      ssr: true,
      storage: createStorage({
        storage: cookieStorage,
      }),
      transports: {
        [sepolia.id]: http(),
      },
    })
  }