import Image from "next/image"
import Link from "next/link"

const Header = () => {
    return (
        <header>
            <div>
                <Link href="/">
                    <Image src="/header.svg" width={1330} height={148}alt="header-image" priority />
                </Link>
            </div>
            <nav>
                <ul>
                    <li><Link href="/user/register">Register</Link></li>
                    <li><Link href="/user/login">Login</Link></li>
                    <li><Link href="/item/create"> Create an item</Link></li>
                </ul>
            </nav>
        </header>
    )
}
export default Header