/* eslint-disable @typescript-eslint/no-explicit-any */
import { format } from 'date-fns'
import Header from '../_components/header'
import { ptBR } from 'date-fns/locale'
import Search from './_components/search'
import { db } from '../_lib/prisma'
import BarberShopItem from './_components/barbershop-item'
import { Barbershop } from '@prisma/client'
import BookingItem from '../_components/booking-item'
import { getServerSession } from 'next-auth'
import { authOptions } from '../_lib/auth'

export default async function Home() {
  const session = await getServerSession(authOptions)

  const [barbershops, recommendBarberShops, confirmedBookings] =
    await Promise.all([
      db.barbershop.findMany({}),
      db.barbershop.findMany({
        orderBy: {
          id: 'asc',
        },
      }),

      session?.user
        ? db.booking.findMany({
            where: {
              userId: (session.user as any).id,
              date: {
                gte: new Date(),
              },
            },
            include: {
              service: true,
              barbershop: true,
            },
          })
        : Promise.resolve([]),
    ])

  return (
    <div className=" md:flex md:flex-col md:gap-6 w-screen ">
      <Header />

      <div className="md:flex md:pb-8 w-screen">
        <div className="px-5 pt-5">
          <h2 className="text-xl font-bold">
            {' '}
            {session?.user
              ? `Olá, ${session.user.name?.split(' ')[0]}`
              : 'Olá, vamos agendar um corte hoje?'}
          </h2>
          <p className="capitalize text-sm">
            {format(new Date(), "EEEE', 'dd 'de' MMMM", {
              locale: ptBR,
            })}
          </p>
        </div>

        <div className="px-5 mt-6 md:flex-1">
          <Search />
        </div>
      </div>

      <div className="mt-6 ">
        {confirmedBookings.length > 0 && (
          <div>
            <h2 className="pl-5 text-xs uppercase text-gray-400 font-bold mb-3">
              Agendamentos
            </h2>
            <div className="flex md:grid md:grid-cols-2 w-screen pb-3 px-5 gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden">
              {confirmedBookings.map((booking) => (
                <BookingItem booking={booking} key={booking.id} />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6">
        <h2 className="px-5 text-xs uppercase text-gray-400 font-bold mb-3">
          Recomendados
        </h2>
        <div className="flex px-5 gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {barbershops.map((barbershop: Barbershop) => (
            <div key={barbershop.id} className="min-w-[167px] max-w-[167px]">
              <BarberShopItem barbershop={barbershop} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 mb-[4.5rem]">
        <h2 className="px-5 text-xs uppercase text-gray-400 font-bold mb-3">
          Populares
        </h2>
        <div className="flex px-5 gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {recommendBarberShops.map((barbershop: Barbershop) => (
            <div key={barbershop.id} className="min-w-[167px] max-w-[167px]">
              <BarberShopItem barbershop={barbershop} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
