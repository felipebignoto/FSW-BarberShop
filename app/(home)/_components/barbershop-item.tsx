'use client'

import { Badge } from '@/app/_components/ui/badge'
import { Button } from '@/app/_components/ui/button'
import { Card, CardContent } from '@/app/_components/ui/card'
import { Barbershop } from '@prisma/client'
import { StarIcon } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface BarbershopItemProps {
  barbershop: Barbershop
}

const BarbershopItem = ({ barbershop }: BarbershopItemProps) => {
  const router = useRouter()

  const handleBookinkClick = () => {
    router.push(`/barbershop/${barbershop.id}`)
  }

  return (
    <Card className="min-w-[167px] max-w-[167px] rounded-2xl">
      <CardContent className="px-1 py-0">
        <div className="w-full h-[159px] relative">
          <div className="absolute left-2 top-2 z-50">
            <Badge
              variant="secondary"
              className="opacity-90 flex items-center justify-center gap-1 "
            >
              <StarIcon size={12} className="fill-primary text-primary" />
              <span className="text-xs">5,0</span>
            </Badge>
          </div>
          <Image
            alt={barbershop.name}
            src={barbershop.imageUrl}
            style={{
              objectFit: 'cover',
            }}
            fill
            className="rounded-2xl"
          />
        </div>

        <div className="px-2 pb-5">
          <h2 className="font-bold mt-2 overflow-hidden text-ellipsis whitespace-nowrap">
            {barbershop.name}
          </h2>
          <p className="text-sm text-gray-400 overflow-hidden text-ellipsis whitespace-nowrap">
            {barbershop.address}
          </p>
          <Button
            onClick={handleBookinkClick}
            className="w-full mt-3"
            variant="secondary"
          >
            Reservar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default BarbershopItem
