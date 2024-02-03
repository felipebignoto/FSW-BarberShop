/* eslint-disable @typescript-eslint/no-explicit-any */
import { getServerSession } from 'next-auth'
import Header from '../_components/header'
import { redirect } from 'next/navigation'
import { db } from '../_lib/prisma'
import BookingItem from '../_components/booking-item'
import { authOptions } from '../_lib/auth'

const BookingPage = async () => {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/')
  }

  const [confirmedBookings, finhsheddBookings] = await Promise.all([
    db.booking.findMany({
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
    }),
    db.booking.findMany({
      where: {
        userId: (session.user as any).id,
        date: {
          lt: new Date(),
        },
      },
      include: {
        service: true,
        barbershop: true,
      },
    }),
  ])

  return (
    <div>
      <Header />
      <div className="px-5 py-6">
        <h1 className="text-xl font-bold">Agendamentos</h1>

        {/* Agendamentos Confirmados */}
        {confirmedBookings.length > 0 && (
          <div>
            <h2 className="text-gray-400 uppercase font-bold text-sm mt-6 mb-3">
              Confirmados
            </h2>
            <div className="flex flex-col gap-3">
              {confirmedBookings.map((booking) => (
                <BookingItem booking={booking} key={booking.id} />
              ))}
            </div>
          </div>
        )}

        {/* Agendamentos finalizados */}
        {finhsheddBookings.length > 0 && (
          <div>
            <h2 className="text-gray-400 uppercase font-bold text-sm mt-6 mb-3">
              Finalizados
            </h2>
            <div className="flex flex-col gap-3">
              {finhsheddBookings.map((booking) => (
                <BookingItem booking={booking} key={booking.id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BookingPage
