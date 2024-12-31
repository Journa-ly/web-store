
const PlaceholderArea = () => (
  <div style={{
    display: "flex",
    alignItems: "center",
    width: "100%", /* Full width */
    justifyContent: "center",
    aspectRatio: "1 / 1", /* Square aspect ratio */
    maxHeight: "276px", /* Maximum height */
    backgroundColor: "#fff", /* Light gray background */
    borderRadius: "12px", /* Rounded corners */
    border: "2px solid #e0e0e0", /* Light gray border */
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", /* Subtle shadow */
    textSlign: "center", /* Center text */
    marginBottom: "10px", /* Space around the component */
  }}>
    <img style={{ aspectRatio: "1 / 1", height: "100%" }} src="https://journatest.blob.core.windows.net/content/Journa_Get-to-Typing_Corgi_No-Loop.gif" alt="Placeholder" />
  </div>
);

export default PlaceholderArea;