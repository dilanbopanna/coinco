import Link from "next/link";
import Image from "next/image";

const Header = () => {
  return (
    <header className="flex flex-row justify-between items-stretch box-content min-w-[1180px] p-5 px-28 text-white w-full border-b border-grey-10">
      <div className="">
        <Link href="/">
          <Image
            src="/images/coinco-logo.png"
            alt="CoinCo"
            width={120}
            height={40}
          />
        </Link>
      </div>
    </header>
  );
};

export default Header;
