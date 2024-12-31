const ImageText = ({ defaultQuotePrompt }) => {

  return (
    <div className="image-text-input">
      <label htmlFor="image-text">Image Text (optional)</label>
      <input
        type="text"
        id="image-text"
        name="quotePrompt"
        className="prevent-zoom"
        defaultValue={defaultQuotePrompt}
        placeholder="---"
        style={{
          textAlign: "center",
        }}
      />
    </div>
  );
};

export default ImageText;
