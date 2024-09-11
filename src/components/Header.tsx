import Image from "next/image";

export default function Header() {
  return (
    <section className="w-full mb-6 text-center">
      <div className="flex flex-col md:flex-row items-center justify-center gap-3 mb-3">
        <Image
          src="/logo.png"
          alt="logo"
          width={64}
          height={64}
          className="mb-3 md:mb-0"
        />
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-700 dark:text-gray-300">
          Ödeme Planı Simülasyon Sistemi
        </h1>
      </div>
      <div
        className="w-20 h-0.5 bg-[#007a3d] mx-auto rounded-full mt-1"
        aria-hidden="true"
      ></div>
    </section>
  );
}
