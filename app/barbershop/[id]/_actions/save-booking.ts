'use server'

import { db } from '@/app/_lib/prisma'
import { revalidatePath } from 'next/cache'

interface SaveBookingProps {
  barbershopId: string
  serviceId: string
  userId: string
  date: Date
}

export const SaveBooking = async (params: SaveBookingProps) => {
  await db.booking.create({
    data: {
      serviceId: params.serviceId,
      userId: params.userId,
      date: params.date,
      barbershopId: params.barbershopId,
    },
  })

  revalidatePath('/')
  revalidatePath('/bookings')
}