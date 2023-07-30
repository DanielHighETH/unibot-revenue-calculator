import Link from 'next/link';

export default function Footer() {

    return (
        <footer>
            <div className='text-center mt-10 text-lg'>
                <p>Created by <a href='https://twitter.com/dhigh_eth' target='blank' className='text-sky-500 hover:text-sky-400 hover:underline'>@DanielHigh</a></p>
                <p>You can check the source code on <a href='https://github.com/DanielHighETH/unibot-revenue-calculator' target='blank' className='text-sky-500 hover:text-sky-400 hover:underline'>GitHub</a></p>
                <p>This site is not affiliated with <a href='https://unibot.app/' target='blank' className='text-sky-500 hover:text-sky-400 hover:underline'>Unibot</a> and is for informational purposes only.</p>
            </div>
        </footer>
    );
}