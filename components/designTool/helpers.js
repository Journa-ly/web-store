
export function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function(e) {
      resolve(e.target.result); // Resolve the promise with the Base64 string
    };
    reader.onerror = reject; // Reject the promise on error
    reader.readAsDataURL(file);
  });
}

export function handleAddToCart({ variantId, quantity, properties }) {
  fetch('/cart/add.js', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      id: variantId,
      quantity,
      properties,
    }),
  })
  .then(response => response.json())
  .then(data => {
    console.log('Product added to cart:', data);
    // Handle success (e.g., redirect to cart, show confirmation)
  })
  .catch(error => {
    console.error('Error adding product to cart:', error);
    // Handle error
  });
}

export function dedupeArrayByKey(array, key) {
  const seen = new Set();
  const dedupedArray = [];

  for (const item of array) {
    if (!seen.has(item[key])) {
      seen.add(item[key]);
      dedupedArray.push(item);
    }
  }

  return dedupedArray;
}

export function constructShareURL(generation_image_id, image_url) {
  const url = window.location.href;
  const [baseUrl, hash] = url.split('#'); // Split the URL at the '#'
  const separator = baseUrl.includes('?') ? '&' : '?';
  const newUrl = `${baseUrl}${separator}generation_image_id=${generation_image_id}&image_url=${image_url}`;
  
  // Re-attach the hash part if it existed
  return encodeURI(hash ? `${newUrl}#${hash}` : `${newUrl}#preview`);
}


export function get_generation_image_id_from_url() {
  const urlParams = new URLSearchParams(window.location.search);
  const gen_id = urlParams.get('generation_image_id');

  if (!gen_id) {
    return null;
  }

  try {
    const parsed_id = parseInt(gen_id);
    return parsed_id === NaN ? null : parsed_id;
  } catch (error) {
    console.error('Failed to parse shared ID:', error);
  }
  return null
}