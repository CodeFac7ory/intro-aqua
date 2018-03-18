'use strict';
const React = require('react');
const Actions = require('../settings/actions');
const Store = require('../settings/store');

class ProfilePage extends React.Component {
	constructor(props) {
		super(props);

		Actions.getDetails();
		Actions.getUser();

		this.state = Store.getState();
		console.log('this.state');
		console.log(this.state);
	}

	componentDidMount() {

		this.unsubscribeStore = Store.subscribe(this.onStoreChange.bind(this));
	}

	componentWillUnmount() {

		this.unsubscribeStore();
	}

	onStoreChange() {

		this.setState(Store.getState());
	}

	render() {
		return (
			<section className="container">
				<div className="row">
					<br />
					<div className="col-sm-3 col-md-2">
						<img src="/public/media/blank-profile-picture.png"
						style={{ width: 168, height: 168 }} />
					</div>
					<div className="col-sm-9 col-md-10">
						<div className="row">
							{this.state.details.name.first} {this.state.details.name.last}
						</div>
						<div className="row">
							{this.state.details.title}
						</div>
						<div className="row">
							{this.state.details.organization}
						</div>
						<div className="row">
							{this.state.details.phone}
						</div>
					</div>
				</div>
			</section>
		)
	}
}

module.exports = ProfilePage;