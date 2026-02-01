import Image from "next/image";

type Props = {
  size?: number; // px
  className?: string;
  priority?: boolean;
};

export default function Logo({
  size = 160,
  className = "",
  priority = true,
}: Props) {
  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        position: "relative",
      }}
    >
      <Image
        src="/coincrew-logo.png"
        alt="CoinCrew logo"
        fill
        priority={priority}
        className="object-contain"
        sizes={`${size}px`}
      />
    </div>
  );
}
