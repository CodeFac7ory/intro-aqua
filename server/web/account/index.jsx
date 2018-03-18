'use strict';
const React = require('react');


class AccountPage extends React.Component {
    render() {

        return (
            <html>
                <head>
                    <title>Account</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <link rel="stylesheet" href="/public/core.min.css" />
                    <link rel="stylesheet" href="/public/pages/account.min.css" />
                    {/*<link rel="shortcut icon" href="/public/media/favicon.ico" />*/}
                    <link rel="shortcut icon" href="/public/media/si-logo-03.png" />
                    <script
                      src="https://code.jquery.com/jquery-3.2.1.js"
                      integrity="sha256-DZAnKJ/6XZ9si04Hgrsxu/8s717jcIzLy3oi35EouyE="
                      crossorigin="anonymous">
                    </script>
                </head>
                <body>
                    <div id="app-mount"></div>
                    <script src="/public/core.min.js"></script>
                    <script src="/public/pages/account.min.js"></script>
                </body>
            </html>
        );
    }
}


module.exports = AccountPage;
