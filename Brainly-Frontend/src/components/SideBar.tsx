import { Logo } from "../Icons/Logo";
import { TwitterIcon } from "../Icons/TwitterIcon";
import { YoutubeIcon } from "../Icons/YoutubeIcon";
import { SidebarItems } from "./SideBarItems";

export function Sidebar(){

    return <div className="h-screen bg-white border-r w-72 fixed left-0 top-0
    pl-6">
        <div className="flex text-2xl pt-4 items-center">
            <div className="pr-2 text-purple-700">
            <Logo/>
            </div>
            
            Brainly
        </div>

        <div className="pt-8 pl-4">
            <SidebarItems text="Twitter" icon={<TwitterIcon/>}/>
            <SidebarItems text="Youtube" icon={<YoutubeIcon/>}/>

        </div>

    </div>
}