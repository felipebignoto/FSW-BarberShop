'use client'

import SideMenu from '@/app/_components/side-menu'
import { Button } from '@/app/_components/ui/button'
import { Sheet, SheetTrigger, SheetContent } from '@/app/_components/ui/sheet'
import { Barbershop } from '@prisma/client'
import { ChevronLeftIcon, MenuIcon, MapPin, StarIcon } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface BarberShopInfoProps {
  barbershop: Barbershop
}

const BarberShopInfo = ({ barbershop }: BarberShopInfoProps) => {
  const router = useRouter()
  const handleBackClick = () => {
    router.replace('/')
  }
  return (
    <div>
      <div className="h-[250px] w-full relative">
        <Button
          variant="outline"
          size="icon"
          className="z-50 absolute top-4 left-4"
          onClick={handleBackClick}
        >
          <ChevronLeftIcon />
        </Button>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="z-50 absolute top-4 right-4"
            >
              <MenuIcon />
            </Button>
          </SheetTrigger>

          <SheetContent className="p-0">
            <SideMenu />
          </SheetContent>
        </Sheet>

        <Image
          alt={barbershop.name}
          src={barbershop.imageUrl}
          fill
          className="object-cover opacity-75"
        ></Image>
      </div>

      <div className="px-5 pt-3 pb-6 border-b border-solid border-secondary">
        <h1 className="text-xl font-bold ">{barbershop.name}</h1>
        <div className="flex items-center gap-1 mt-2">
          <MapPin className="text-primary" size={18} />
          <p className="text-sm">{barbershop.address}</p>
        </div>
        <div className="flex items-center gap-1 mt-2">
          <StarIcon className="text-primary" size={18} />
          <p className="text-sm">5,0 (899 avaliações)</p>
        </div>
      </div>
    </div>
  )
}

export default BarberShopInfo
