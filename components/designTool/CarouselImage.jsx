import BounceLoader from "react-spinners/BounceLoader";
import ShareButton from './ShareButton';
import HeartButton from './buttons/HeartButton';

const CarouselImage = ({ imageData }) => {

  if (imageData.status === 'Pending') {
    return (
      <div className="carousel-image loading">
        <BounceLoader color={'#000'} loading={true} size={50} />
      </div>
    );
  }

  if (imageData.status === 'Failed') {
    return (
      <div className="carousel-image error">
        <div className="error-message">Failed to load image</div>
      </div>
    );
  }

  if (imageData.image && imageData.status === 'Succeeded') {
    return (
      <div className="carousel-image">
        {/* <div style={{ width: 0, height: 0, position: "relative", margin: "0 auto"}}>
          <AddToCartIconButton />
        </div> */}
        <img src={imageData.image.image} alt="Loaded image" />
        <div style={{
          width: 0,
          height: 0,
          margin: '0 auto',
          position: 'relative',
        }}>
          <HeartButton imageUUID={imageData.uuid} initialHearted={imageData.favorited} />
          <ShareButton id={imageData.id} imageUrl={imageData.image.image} />
        </div>
      </div>
    );
  }

  return (
    <div className="carousel-image placeholder">
      <div className="placeholder-message">No image available</div>
    </div>
  );
};

export default CarouselImage;
