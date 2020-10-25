import {Component, Fragment} from 'react';
import {Link} from "react-router-dom";
import CookieConsent from 'react-cookie-consent';
import Col from 'react-bootstrap/Col';
import {CSSTransition} from 'react-transition-group';

import GlobalContext from './GlobalContext';

import Clock from './Clock.js';
import Version from './Version.js';

import reactlogo from '../res/react.png';
import spotifylogo from '../res/spotify.svg';
import GravatarIMG from "./GravatarIMG";
import Alerts from "./Alerts";
import Config from "./Configuration";
import useUser from "../hooks/user";


class BaseLayout extends Component {
    static contextType = GlobalContext;

    render() {
        return (
            <Fragment>
                <div className="page-body">
                    <CookieConsent
                        location="top"
                        cookieSecurity={true}
                        sameSite="strict"
                        style={{background: "black"}}
                    >
                        This website uses cookies to ensure you get the best experience on our website. <a
                        className="cookielink" href="https://cookiesandyou.com/">Learn more</a>
                    </CookieConsent>
                    {Config.showversion && <Version/>}
                    <Alerts onClose={this.context.removeAlert}>{this.context.alerts}</Alerts>
                    {this.props.children}
                </div>
                <Footer/>
            </Fragment>
        );
    }
}

class Footer extends Component {

    static contextType = GlobalContext;

    constructor(props) {
        super(props);
        this.state = {
            isMenuOpen: false
        };
    }
    render() {
        return (
            <Fragment>
                {Config.showlogos &&
                <Fragment>
                    <img className="spotify-logo d-none d-md-block" alt="spotify Logo" src={spotifylogo}/>
                    <img className="react-logo d-none d-md-block" alt="HTML5 Logo" src={reactlogo}/>
                </Fragment>
                }
                <CSSTransition
                    classNames="slideup"
                    timeout={300}
                    unmountOnExit
                    in={this.state.isMenuOpen}>
                    <AMenu onItemClick={() => this.setState({isMenuOpen: false})} editAccount={this.context.editAccount}
                           logout={this.context.logout}/>
                </CSSTransition>
                {Config.showfooter &&
                    <footer className="d-flex flex-row justify-content-between no-gutters">
                        <Col className="text-left">
                            {Config.enableusers &&
                            <LoginFooter onLogin={() => this.context.login()}
                                         onMenu={() => this.setState({isMenuOpen: !this.state.isMenuOpen})}/>}
                        </Col>
                        <Col className="text-center">
                            {Config.showstats && <Link to="/statistik">Statistik</Link>}
                        </Col>
                        <Col className="text-right">
                            {Config.showrights && <a href={Config.rightslink}>Impressum<span
                                className="d-none d-sm-inline">/Disclaimer/Datenschutz</span></a>}

                            {Config.showclock && <Clock className="clock d-none d-md-inline"/>}
                        </Col>
                    </footer>
                }
            </Fragment>
        );
    }
}

function LoginFooter(props) {

    const user = useUser();

    if (user) {
        return (
            <span className="LoginFooter">
                <Link to={`/user/${user.name}`}>
                    <GravatarIMG>{user.gravatarId}</GravatarIMG>
                    <span><span className="d-none d-sm-inline">Willkommen </span>{user.name}</span>
                </Link>
                <Link to="#" onClick={props.onMenu}>Menü</Link>
            </span>
        );
    }
    else {
        return (
            <span className="LoginFooter">
                <Link to="#" onClick={props.onLogin}>Login</Link>
            </span>
        );
    }
}

function AMenu(props) {

    const user = useUser();

    return (
        <nav className="AMenu">
            <li><Link to="/" onClick={props.onItemClick}>Startseite</Link></li>
            {Config.showarchive && <li><Link to="/archiv" onClick={props.onItemClick}>Archiv</Link></li>}
            {Config.showstats && <li><Link to="/statistik" onClick={props.onItemClick}>Statistik</Link></li>}
            {user && user.admin &&
            <Fragment>
                <li><Link to="/import" onClick={props.onItemClick}>Playlist Importieren</Link></li>
                <li><Link to="/songs" onClick={props.onItemClick}>Gesperrte Songs</Link></li>
                <li><Link to="/gapcloser" onClick={props.onItemClick}>Gapcloser</Link></li>
                <li><Link to="/log" onClick={props.onItemClick}>Log</Link></li>
                <li><Link to="/users" onClick={props.onItemClick}>User</Link></li>
                <li><Link to="/debug" onClick={props.onItemClick}>Entwicklermenü</Link></li>
            </Fragment>
            }
            {user && <li><Link to="#" onClick={() => {
                props.onItemClick();
                props.editAccount()
            }}>Account bearbeiten</Link></li>}
            {user && <li><Link to="#" onClick={() => {
                props.onItemClick();
                props.logout()
            }}>Logout</Link></li>}
        </nav>
    );
}

export default BaseLayout;
