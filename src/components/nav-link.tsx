
import { HomeIcon, NotebookPen, PuzzleIcon } from "lucide-react";
import Link from "next/link";


export type LinkData = {
    name: string,
    route: `/${string}`
    Icon: React.ElementType
}

const links: LinkData[] = [
    {
        name: 'Accuel',
        route: "/",
        Icon: HomeIcon
    },
    {
        name: 'Jeux',
        route: "/game",
        Icon: PuzzleIcon

    },
    {
        name: 'A propos',
        route: "/about",
        Icon: NotebookPen
    }
]

type NavLinkItemProps = LinkData & {};



function NavLinkItem({ name, route, Icon }: NavLinkItemProps) {

    return (

        <>

            <li>
                <Link href={route} className="flex flex-row">
                    <Icon />
                    <span className="">{name}</span>
                </Link>
            </li>
        </>

    )

}

export default function NavLink() {

    return (
        <>
            <ul>

                {links.map(link => (
                    <NavLinkItem key={link.route} {...link} />

                ))}

            </ul>

        </>


    )

}