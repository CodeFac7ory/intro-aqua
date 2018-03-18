const React = require('react');

class ImageUpload extends React.Component {
  constructor(props) {
    super(props);

    this.state = {file: '',imagePreviewUrl: ''};
  }

  _handleImageChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result
      });

      this.props.setProfilePic(file, reader.result);
    }

    if (file instanceof Blob) {
      reader.readAsDataURL(file)
    }

  }

  render() {

    var imgPreview = {
      // border: '1px solid gray',
      // maxHeight: 200
    };

    let {imagePreviewUrl} = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (<img style={{maxHeight: 200, maxWidth: 345}} src={imagePreviewUrl} />);
    } else {
      $imagePreview = (<div className="previewText">Please select an Image for Preview</div>);
    }

    return (
      <div className="previewComponent">
          <input className="fileInput" 
            type="file"
            onChange={(e)=>this._handleImageChange(e)} />
        <br />
        <div style={imgPreview}>
          {$imagePreview}
        </div>
      </div>
    )
  }
}

module.exports = ImageUpload;