import Image from 'next/image'

interface DesktopIconProps {
  name: string
  icon: string
  onClick: () => void
  position: { x: number; y: number }
}

export const DesktopIcon = ({ name, icon, onClick, position }: DesktopIconProps) => {
  return (
    <div
      className="absolute w-20 flex flex-col items-center gap-1 cursor-pointer 
                 hover:bg-white/10 p-2 rounded group"
      style={{ left: position.x, top: position.y }}
      onClick={onClick}
    >
      <Image
        src={icon}
        alt={name}
        width={40}
        height={40}
        className="group-hover:scale-105 transition-transform"
      />
      <span className="text-white/80 text-sm text-center">
        {name}
      </span>
    </div>
  )
}
