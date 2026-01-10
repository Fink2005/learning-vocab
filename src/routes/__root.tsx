import { Outlet, createRootRoute, useRouter } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import Header from '../components/Header'
import BottomNav from '../components/BottomNav'

import { LanguageProvider } from '@/contexts/LanguageContext'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {

  return (
    <LanguageProvider>
      <Header />
      <main>
        <Outlet />
      </main>
     <BottomNav />
      <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </LanguageProvider>
  )
}

