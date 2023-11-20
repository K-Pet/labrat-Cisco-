import "./sidebar.scss";
import DashboardIcon from '@mui/icons-material/Dashboard';
import DomainIcon from '@mui/icons-material/Domain';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import StorageIcon from '@mui/icons-material/Storage';
import CellTowerIcon from '@mui/icons-material/CellTower';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import CloudIcon from '@mui/icons-material/Cloud';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar"> 
        <div className="top">
            <Link to="/home" style={{textDecoration: 'none'}}>
            <span className="logo">labrat</span>
            </Link>
        </div>
        <hr />
        <div className="middle">
            <ul>
                <p className="title">MAIN</p>
                <Link to="/home" style={{textDecoration: 'none'}}>
                    <li>
                        <DashboardIcon className="icon" />
                        <span>Dashboard</span>
                    </li>
                </Link>
                <p className="title">INVENTORY</p>
                <Link to="/datacenters" style={{textDecoration: 'none'}}>
                    <li>
                        <DomainIcon className="icon" />
                        <span>Datacenters</span>
                    </li>
                </Link>
                <Link to="/labs" style={{textDecoration: 'none'}}>
                    <li>
                        <MeetingRoomIcon className="icon" />
                        <span>Labs</span>
                    </li>
                </Link>
                <Link to="/racks" style={{textDecoration: 'none'}}>
                <li>
                    <StorageIcon className="icon" />
                    <span>Racks</span>
                </li>
                </Link>
                <Link to="/servers" style={{textDecoration: 'none'}}>
                    <li>
                        <CellTowerIcon className="icon" />
                        <span>Servers</span>
                    </li>
                </Link>
                <Link to="/switches" style={{textDecoration: 'none'}}>
                    <li>
                        <ToggleOffIcon className="icon" />
                        <span>Switches</span>
                    </li>
                </Link>
                <Link to="/vms" style={{textDecoration: 'none'}}>
                    <li>
                        <CloudIcon className="icon" />
                        <span>VMs</span>
                    </li>
                </Link>
                <p className="title">USER</p>
                <li>
                    <LogoutIcon className="icon" />
                    <span>Logout</span>
                </li>
            </ul>
        </div>
        <div className="bottom">
            <div className="colorOption"></div>
            <div className="colorOption"></div>
        </div>
    
    </div>
  )
}

export default Sidebar