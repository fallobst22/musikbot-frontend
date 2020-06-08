import React, {Component} from 'react';
import Container from 'react-bootstrap/Container';

import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card'

import GlobalContext from '../components/GlobalContext';
import Header from '../components/Header';
import QuickAdd from "../components/QuickAdd";

import './Stats.css';
import CSSTransition from "react-transition-group/CSSTransition";
import {Link} from "react-router-dom";
import {TransitionGroup} from "react-transition-group";
import Config from "../components/Configuration";

class Stats extends Component {

    static contextType = GlobalContext;

    constructor(props) {
        super(props);
        this.state = {
            mostplayed: [],
            mostskipped: [],
            topuser: [],
            general: []
        };

        this.abortController = new AbortController();

        this.load = this.load.bind(this);
    }

    componentDidMount() {
        this.load();
    }

    componentWillUnmount() {
        this.abortController.abort();
    }

    load() {
        fetch(Config.apihost + "/api/v2/stats", {
            method: 'GET',
            headers: this.context.defaultHeaders,
            signal: this.abortController.signal
        })
        .then((res) => {
            if(!res.ok) throw Error(res.statusText);
            return res;
        })
        .then((res) => res.json())
        .then(value => this.setState(value))
        .catch(reason => {
            this.context.handleException(reason);
        });
    }

    render() {
        return (
            <Container fluid className="d-flex flex-column statscontainer">
                <Header />
                <Row className="statsrow">
                    <EntryCard title="Am meisten gewünscht" data={this.state.mostplayed} mapfunction={
                        (entry,key) => (
                            <tr key={key}>
                                <td className="idcolumn">{key+1}.</td>
                                <td><QuickAdd>{entry.link}</QuickAdd></td>
                                <td><a href={entry.link}>{entry.title}</a></td>
                                <td>{entry.count}</td>
                            </tr>
                        )
                    }
                    header={
                        <tr>
                            <th className="idcolumn">Nr.</th>
                            <th className="idcolumn"></th>
                            <th>Titel</th>
                            <th>Anzahl</th>
                        </tr>
                    } />
                    <EntryCard title="Am meisten geskippt" data={this.state.mostskipped} mapfunction={
                        (entry,key) => (
                            <tr key={key}>
                                <td className="idcolumn">{key+1}.</td>
                                <td><QuickAdd>{entry.link}</QuickAdd></td>
                                <td><a href={entry.link}>{entry.title}</a></td>
                                <td>{entry.count}</td>
                            </tr>
                        )
                    }
                    header={
                        <tr>
                            <th className="idcolumn">Nr.</th>
                            <th className="idcolumn"></th>
                            <th>Titel</th>
                            <th>Anzahl</th>
                        </tr>
                    } />

                    <EntryCard title="Top Wünscher" data={this.state.topuser} mapfunction={
                        (entry,key) => (
                            <tr key={key}>
                                <td className="idcolumn">{key+1}.</td>
                                <td><Link to={`/user/${entry.name}`}>{entry.name}</Link></td>
                                <td>{entry.count}</td>
                            </tr>
                        )
                    }
                    header={
                        <tr>
                            <th className="idcolumn">Nr.</th>
                            <th>Name</th>
                            <th>Anzahl</th>
                        </tr>
                    } />

                    <EntryCard title="Allgemeines" data={this.state.general} mapfunction={
                        (entry,key) => (
                            <tr key={key}>
                                <td>{entry.title}:</td>
                                <td>{entry.value}</td>
                            </tr>
                        )
                    }
                    header={
                        <tr>
                            <th>Titel</th>
                            <th>Anzahl</th>
                        </tr>
                    } />
                </Row>
            </Container>
        );
    }
}

function EntryCard(props) {
    return (
        <div className="statscard">
            <Card className="h-100">
                <Card.Body>
                    <Card.Title>{props.title}</Card.Title>
                    <table>
                        <thead>
                            {props.header}
                        </thead>
                        <tbody>
                            <TransitionGroup component={null} exit={false}>
                                {props.data.map(
                                    (entry,key) => (
                                        <CSSTransition key={key} timeout={300} classNames="fade">
                                            {props.mapfunction(entry,key)}
                                        </CSSTransition>
                                    )
                                )}
                            </TransitionGroup>
                        </tbody>
                    </table>
                </Card.Body>
            </Card>
        </div>
    );
}

export default Stats;