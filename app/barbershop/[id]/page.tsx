import { db } from '@/app/_lib/prisma'
import BarberShopInfo from './components/barbershopinfo'
import ServiceItem from './components/service-item'
import { Service } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

interface BarbershopDetailsPageProps {
  params: {
    id?: string
  }
}

const BarbershopDetailsPage = async ({
  params,
}: BarbershopDetailsPageProps) => {
  const session = await getServerSession(authOptions)

  if (!params.id) {
    // TODO: Redirecionar para home
    return null
  }

  const barbershop = await db.barbershop.findUnique({
    where: {
      id: params.id,
    },
    include: {
      services: true,
    },
  })
  if (!barbershop) {
    // TODO: Redirecionar para home
    return null
  }
  return (
    <div>
      <BarberShopInfo barbershop={barbershop} />
      <div className="px-5 flex flex-col gap-4 py-6 ">
        {' '}
        {barbershop.services.map((service: Service) => (
          <ServiceItem
            service={service}
            key={service.id}
            isAuthenticated={!!session?.user}
          />
        ))}
      </div>
    </div>
  )
}

export default BarbershopDetailsPage
