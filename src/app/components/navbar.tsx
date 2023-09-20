import Link from 'next/link';

export default function Navbar() {

    return (
        <nav className="flex items-center justify-between flex-wrap">
            <div className="flex items-center flex-shrink-0 text-white gap-5 font-bold text-lg">
                <Link href="/">Home</Link>
                <Link href="/prediction">Prediction</Link>
                <Link href="https://dune.com/whale_hunter/unibot-revenue" target='blank'>Data</Link>
                <Link href="/about">About</Link>
                </div>
        </nav>
    );
}