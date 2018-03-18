'use strict';
const Actions = require('./actions');
const Alert = require('../../../components/alert.jsx');
const Button = require('../../../components/form/button.jsx');
const ControlGroup = require('../../../components/form/control-group.jsx');
const LinkState = require('../../../helpers/link-state');
const PropTypes = require('prop-types');
const React = require('react');
const Spinner = require('../../../components/form/spinner.jsx');
const TextControl = require('../../../components/form/text-control.jsx');
const ImageUpload = require('../../../components/form/image-upload.jsx');


const propTypes = {
    error: PropTypes.string,
    hasError: PropTypes.object,
    help: PropTypes.object,
    hydrated: PropTypes.bool,
    loading: PropTypes.bool,
    name: PropTypes.shape({
        first: PropTypes.string,
        middle: PropTypes.string,
        last: PropTypes.string
    }),
    organization: PropTypes.string,
    phone: PropTypes.string,
    website: PropTypes.string,
    showSaveSuccess: PropTypes.bool
};


class DetailsForm extends React.Component {
    constructor(props) {

        super(props);

        this.state = {
            name: props.name,
            title: props.title,
            organization: props.organization,
            phone: props.phone,
            website: props.website
        };

        this.setProfilePic = this.setProfilePic.bind(this);
        this.saveProfilePic = this.saveProfilePic.bind(this);
    }

    componentWillReceiveProps(nextProps) {

        this.setState({
            name: nextProps.name,
            title: nextProps.title,
            organization: nextProps.organization,
            phone: nextProps.phone,
            website: nextProps.website,
            showSaveSuccess: nextProps.bool
        });
    }

    handleSubmit(event) {

        event.preventDefault();
        event.stopPropagation();

        Actions.saveDetails({
            name: this.state.name,
            title: this.state.title,
            organization: this.state.organization,
            phone: this.state.phone,
            website: this.state.website
        });
    }

    setProfilePic(file, result) {
        console.log('profilePic');
        console.log(file);
        console.log(result);

        this.setState({
            profilePicture: result
        });
    }

    saveProfilePic(event) {

        var form_data = new FormData($('input[type=file]')[0]);
        console.log('--------------form_data');
        console.log(form_data);

        $.ajax({
          type:'POST',
          url:'/accounts/my/profile-picture/',
          processData: false,
          contentType: false,
          async: false,
          cache: false,
          data : form_data,
          success: function(response){

          }
        });

        // event.preventDefault();
        // event.stopPropagation();

        // Actions.saveProfilePicture({
        //     profilePicture: this.state.profilePicture,
        // });
    }

    render() {

        if (!this.props.hydrated) {
            return (
                <div className="alert alert-info">
                    Loading contact info data...
                </div>
            );
        }

        const alerts = [];

        if (this.props.showSaveSuccess) {
            alerts.push(<Alert
                key="success"
                type="success"
                onClose={Actions.hideDetailsSaveSuccess}
                message="Success. Changes have been saved."
            />);
        }

        if (this.props.error) {
            alerts.push(<Alert
                key="danger"
                type="danger"
                message={this.props.error}
            />);
        }

        return (
            <form onSubmit={this.handleSubmit.bind(this)}>
                <fieldset>
                    <legend>Contact info</legend>
                    {alerts}
                    <TextControl
                        name="name.first"
                        label="First name"
                        value={this.state.name.first}
                        onChange={LinkState.bind(this)}
                        hasError={this.props.hasError['name.first']}
                        help={this.props.help['name.first']}
                        disabled={this.props.loading}
                    />
                    <TextControl
                        name="name.middle"
                        label="Middle name"
                        value={this.state.name.middle}
                        onChange={LinkState.bind(this)}
                        hasError={this.props.hasError['name.middle']}
                        help={this.props.help['name.middle']}
                        disabled={this.props.loading}
                    />
                    <TextControl
                        name="name.last"
                        label="Last name"
                        value={this.state.name.last}
                        onChange={LinkState.bind(this)}
                        hasError={this.props.hasError['name.last']}
                        help={this.props.help['name.last']}
                        disabled={this.props.loading}
                    />
                    <ImageUpload
                        name="profilePicture"
                        label="Profile Picture"
                        setProfilePic={this.setProfilePic}
                        hasError={this.props.hasError['profilePicture']}
                        disabled={this.props.loading}
                    />
                    <br />
                    <Button inputClasses={{ 'btn-success': true }} 
                        onClick={this.saveProfilePic}>
                        <i className="fa fa-floppy-o"></i> Save as profile picture
                    </Button>

                    <br />
                    <br />
                    <TextControl
                        name="organization"
                        label="Organization"
                        value={this.state.organization}
                        onChange={LinkState.bind(this)}
                        hasError={this.props.hasError['organization']}
                        help={this.props.help['organization']}
                        disabled={this.props.loading}
                    />
                    <TextControl
                        name="title"
                        label="Title"
                        value={this.state.title}
                        onChange={LinkState.bind(this)}
                        hasError={this.props.hasError['title']}
                        help={this.props.help['title']}
                        disabled={this.props.loading}
                    />
                    <TextControl
                        name="phone"
                        label="Phone"
                        value={this.state.phone}
                        type="tel"
                        onChange={LinkState.bind(this)}
                        hasError={this.props.hasError['phone']}
                        help={this.props.help['phone']}
                        disabled={this.props.loading}
                    />
                    <TextControl
                        name="website"
                        label="Website"
                        value={this.state.website}
                        type="tel"
                        onChange={LinkState.bind(this)}
                        hasError={this.props.hasError['website']}
                        help={this.props.help['website']}
                        disabled={this.props.loading}
                    />
                    <br />
                    <ControlGroup hideLabel={true} hideHelp={true}>
                        <Button
                            type="submit"
                            inputClasses={{ 'btn-primary': true }}
                            disabled={this.props.loading}>

                            Update contact info
                            <Spinner
                                space="left"
                                show={this.props.loading}
                            />
                        </Button>
                    </ControlGroup>
                </fieldset>
            </form>
        );
    }
}

DetailsForm.propTypes = propTypes;


module.exports = DetailsForm;
