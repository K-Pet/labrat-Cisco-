import "./widget.scss";
import DashboardIcon from '@mui/icons-material/Dashboard';
import DomainIcon from '@mui/icons-material/Domain';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import StorageIcon from '@mui/icons-material/Storage';
import CellTowerIcon from '@mui/icons-material/CellTower';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import CloudIcon from '@mui/icons-material/Cloud';


const Widget = ({type}) => {
    let data;

    //temp

    const amount = 100;

    switch(type) {
        case "datacenters":
            data = {
                title: "DATACENTERS",
                counter: "1234",
                link: "See all datacenters",
                icon: <DashboardIcon className="icon" />
            }
            break;
        case "labs":
            data = {
                title: "LABS",
                counter: "1234",
                link: "See all labs",
                icon: <MeetingRoomIcon className="icon" />
            }
            break;
        case "racks":
            data = {
                title: "RACKS",
                counter: "1234",
                link: "See all racks",
                icon: <StorageIcon className="icon" />
            }
            break;
        case "servers":
            data = {
                title: "SERVERS",
                counter: "1234",
                link: "See all servers",
                icon: <CellTowerIcon className="icon" />
            }
            break;
        case "switches":
            data = {
                title: "SWITCHES",
                counter: "1234",
                link: "See all switches",
                icon: <ToggleOffIcon className="icon" />
            }
            break;
        case "vms":
            data = {
                title: "VMS",
                counter: "1234",
                link: "See all vms",
                icon: <CloudIcon className="icon" />
            }
            break;
        default:
            break;
    }




    return (
        <div className="widget">
            <div className="left">
                <span className="title">{data.title}</span>
                <span className="counter">{amount}</span>
                <span className="link">{data.link}</span>
            </div>
            <div className="right">
                {data.icon}
            </div>
            
        </div>
        )
}

export default Widget
