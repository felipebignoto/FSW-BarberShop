/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Button } from '@/app/_components/ui/button'
import { Calendar } from '@/app/_components/ui/calendar'
import { Card, CardContent } from '@/app/_components/ui/card'
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/app/_components/ui/sheet'
import { Barbershop, Booking, Service } from '@prisma/client'
import { ptBR } from 'date-fns/locale'
import { signIn, useSession } from 'next-auth/react'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { generateDayTimeList } from '../_helpers.ts/hours'
import { addDays, format, setHours, setMinutes } from 'date-fns'
import { SaveBooking } from '../_actions/save-booking'
import { Loader2, LogInIcon } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { getDayBookings } from '../_actions/getDayBookings'

interface ServiceItemProps {
  service: Service
  isAuthenticated: boolean
  barbershop: Barbershop
}

const ServiceItem = ({
  service,
  isAuthenticated,
  barbershop,
}: ServiceItemProps) => {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [hour, setHour] = useState<string | undefined>()
  const [submitIsloading, setSubmitIsloading] = useState(false)
  const [sheetIsOpen, setSheetIsOpen] = useState(false)
  const [dayBookings, setDayBookings] = useState<Booking[]>([])

  const { data } = useSession()
  const router = useRouter()

  const handleSiginClick = () => {
    signIn('google')
  }

  useEffect(() => {
    if (!date) {
      return
    }
    const refreshAvailableHours = async () => {
      const _dayBookings = await getDayBookings(barbershop.id, date)
      setDayBookings(_dayBookings)
    }

    refreshAvailableHours()
  }, [date, barbershop.id])

  const handleDateClick = (date: Date | undefined) => {
    setDate(date)
    setHour(undefined)
  }

  const handleHourClick = (time: string) => {
    setHour(time)
  }

  const handleBookingClick = () => {
    if (!isAuthenticated) {
      return signIn('google')
    }

    // TODO: Abrir modal de agendamentos
  }

  const handleBookingSubmit = async () => {
    setSubmitIsloading(true)
    try {
      if (!hour || !date || !data?.user) {
        return
      }

      const dateHour = Number(hour.split(':')[0])
      const dateMinutes = Number(hour.split(':')[1])
      const newDate = setMinutes(setHours(date, dateHour), dateMinutes)

      await SaveBooking({
        serviceId: service.id,
        barbershopId: barbershop.id,
        date: newDate,
        userId: (data.user as any).id,
      })

      setSheetIsOpen(false)
      setHour(undefined)
      setDate(undefined)
      toast('Reserva realizada com sucesso!', {
        description: format(newDate, "'Para' dd 'de' MMMM 'às' HH':'mm'.'", {
          locale: ptBR,
        }),
        action: {
          label: 'Visualizar',
          onClick: () => router.push('/bookings'),
        },
      })
    } catch (err) {
      console.log(err)
    }
    setSubmitIsloading(true)
  }

  const timeList = useMemo(() => {
    if (!date) {
      return []
    }

    return generateDayTimeList(date).filter((time) => {
      const timeHour = Number(time.split(':')[0])
      const timeMinutes = Number(time.split(':')[1])

      const booking = dayBookings.find((booking) => {
        const bookingHour = booking.date.getHours()
        const bookingMinutes = booking.date.getMinutes()

        return bookingHour === timeHour && bookingMinutes === timeMinutes
      })

      if (!booking) {
        return true
      }

      return false
    })
  }, [date, dayBookings])

  return (
    <Card>
      <CardContent className="p-3 w-full">
        <div className="flex gap-4 items-center">
          <div className="relative min-h-[110px] min-w-[110px] max-h-[110px] max-w-[110px]">
            <Image
              src={service.imageUrl}
              alt={service.name}
              fill
              className="object-contain rounded-lg"
            />
          </div>
          <div className="flex flex-col w-full">
            <h2 className="font-bold">{service.name}</h2>
            <p className="text-sm text-gray-400">{service.description}</p>

            <div className="grid md:flex items-center justify-between mt-3 ">
              <p className="text-sm font-bold text-primary">
                {Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(Number(service.price))}
              </p>

              <Sheet open={sheetIsOpen} onOpenChange={setSheetIsOpen}>
                {data?.user ? (
                  <SheetTrigger asChild>
                    <Button onClick={handleBookingClick} variant="secondary">
                      Reservar
                    </Button>
                  </SheetTrigger>
                ) : (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <h2>Gostaria de fazer uma reserva?</h2>
                    </div>
                    <Button
                      variant="secondary"
                      className="w-full justify-start"
                      onClick={handleSiginClick}
                    >
                      <LogInIcon className="mr-2" size={18} />
                      Fazer login
                    </Button>
                  </div>
                )}

                <SheetContent className="p-0 ">
                  {/* Titulo */}
                  <SheetHeader className="text-left px-5 py-6 md:pt-3 pb-2 border-b border-solid border-secondary">
                    <SheetTitle>Fazer reserva</SheetTitle>
                  </SheetHeader>

                  {/* Calendario */}
                  <div className="py-6 md:py-1">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={handleDateClick}
                      fromDate={addDays(new Date(), 1)}
                      locale={ptBR}
                      className="md:flex justify-center"
                      styles={{
                        head_cell: {
                          width: '100%',
                          textTransform: 'capitalize',
                        },
                        cell: {
                          width: '100%',
                        },
                        button: {
                          width: '100%',
                        },
                        nav_button_previous: {
                          width: '32px',
                          height: '32px',
                        },
                        nav_button_next: {
                          width: '32px',
                          height: '32px',
                        },
                        caption: {
                          textTransform: 'capitalize',
                        },
                      }}
                    />
                  </div>

                  {/* Mostrar lista de horarios */}
                  {date && (
                    <div className="flex overflow-x-auto gap-3 py-6 md:py-3 px-5 border-t border-solid border-secondary [&::-webkit-scrollbar]:hidden">
                      {timeList.map((time) => (
                        <Button
                          variant={hour === time ? 'default' : 'outline'}
                          className="rounded-full"
                          onClick={() => handleHourClick(time)}
                          key={time}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  )}
                  {/* Mostra info do serviço */}
                  <div className="py- md:py-3 px-5 border-t border-solid border-secondary">
                    <Card>
                      <CardContent className="p-3 gap-3 flex flex-col">
                        <div className="flex justify-between">
                          <h2 className="font-bold">{service.name}</h2>
                          <h3 className="font-bold text-sm">
                            {' '}
                            {Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            }).format(Number(service.price))}
                          </h3>
                        </div>

                        {date && (
                          <div className="flex justify-between">
                            <h3 className="text-gray-400 text-sm">Data</h3>
                            <h4 className="text-sm">
                              {format(date, "dd 'de' MMMM", {
                                locale: ptBR,
                              })}
                            </h4>
                          </div>
                        )}

                        {hour && (
                          <div className="flex justify-between">
                            <h3 className="text-gray-400 text-sm">Horário</h3>
                            <h4 className="text-sm">{hour}</h4>
                          </div>
                        )}

                        <div className="flex justify-between">
                          <h3 className="text-gray-400 text-sm">Barbearia</h3>
                          <h4 className="text-sm">{barbershop.name}</h4>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Footer */}
                  <SheetFooter className="px-5">
                    <Button
                      onClick={handleBookingSubmit}
                      disabled={!hour || !date || submitIsloading}
                    >
                      {submitIsloading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Confirmar reserva
                    </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ServiceItem
