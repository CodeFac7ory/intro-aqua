'use strict';
const Footer = require('./footer.jsx');
const Home = require('./home/index.jsx');
const Navbar = require('./navbar.jsx');
const NotFound = require('./not-found.jsx');
const React = require('react');
const ReactRouter = require('react-router-dom');
const Profile = require('./profile/index.jsx');
const Settings = require('./settings/index.jsx');


const Route = ReactRouter.Route;
const Router = ReactRouter.BrowserRouter;
const Switch = ReactRouter.Switch;


const App = (
    <Router>
        <div>
            <Route component={Navbar} />
            <Switch>
                <Route path="/account" exact component={Home} />
                <Route path="/account/profile" exact component={Profile} />
                <Route path="/account/settings" exact component={Settings} />

                <Route component={NotFound} />
            </Switch>
            <Footer />
        </div>
    </Router>
);


module.exports = App;
