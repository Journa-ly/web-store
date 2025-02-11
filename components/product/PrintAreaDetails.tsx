import { usePrintfulDetails } from '../../hooks/usePrintfulDetails';
import { PrintfulFile } from 'lib/printful/types';

export function PrintAreaDetails({
  productId,
  variantId
}: {
  productId: string;
  variantId?: string;
}) {
  const { productPrintDetails, variantPrintDetails, isLoading, isError } = usePrintfulDetails(
    productId,
    variantId
  );

  if (isLoading) return <div>Loading print details...</div>;
  if (isError) return <div>Error loading print details</div>;
  if (!productPrintDetails) return null;

  return (
    <div>
      <h3>Print Area Details</h3>
      <div>
        <p>Print Area Width: {productPrintDetails.print_details.print_area_width}px</p>
        <p>Print Area Height: {productPrintDetails.print_details.print_area_height}px</p>
        <p>DPI: {productPrintDetails.print_details.dpi}</p>
        <p>
          Available Techniques: {productPrintDetails.print_details.available_techniques.join(', ')}
        </p>
      </div>
      {variantPrintDetails && (
        <div>
          <h4>Variant Print Files</h4>
          {variantPrintDetails.printFiles.map((file: PrintfulFile) => (
            <div key={file.id}>
              <p>
                Position: {file.position.top}px from top, {file.position.left}px from left
              </p>
              <p>
                Dimensions: {file.position.width}px x {file.position.height}px
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
