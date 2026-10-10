import { apiClient, type ApiMeta } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type {
  Product,
  ProductRemoval,
  ProductWrite,
  UploadSignature,
} from "./types";

/** Lists every product, archived ones included. */
export async function getProducts(
  params: { search?: string; category?: string; status?: string; limit?: number } = {},
): Promise<{ data: Product[]; meta?: ApiMeta }> {
  return apiClient.getPage<Product[]>(ENDPOINTS.products.list, { params });
}

/** Creates a product and opens its stock record. */
export async function createProduct(input: ProductWrite): Promise<Product> {
  return apiClient.post<Product>(ENDPOINTS.products.create, input);
}

/** Applies a partial change to a product. */
export async function updateProduct(
  id: string,
  input: ProductWrite,
): Promise<Product> {
  return apiClient.patch<Product>(ENDPOINTS.products.update(id), input);
}

/**
 * Removes a product.
 *
 * The API decides which of the two things that means: a product no order
 * refers to is deleted outright, along with its stock record and its images;
 * one that has been bought is archived, because its order lines still name it.
 * The result says which happened, so the dashboard can report it accurately
 * rather than guessing.
 */
export async function removeProduct(id: string): Promise<ProductRemoval> {
  return apiClient.delete<ProductRemoval>(ENDPOINTS.products.delete(id));
}

/** Requests a short-lived signature for a direct upload to ImageKit. */
export async function getUploadSignature(
  folder?: string,
): Promise<UploadSignature> {
  return apiClient.post<UploadSignature>(ENDPOINTS.products.uploadSignature, {
    folder,
  });
}

/** The size cap the product form enforces before uploading, from the prototype. */
export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

/**
 * Uploads an image straight to ImageKit using a signature from the API.
 *
 * The file never passes through the backend, which keeps large uploads off the
 * VPS, and the private key stays on the server.
 */
export async function uploadProductImage(
  file: File,
): Promise<{ url: string; file_id: string }> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose a valid image file.");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Please choose an image smaller than 8 MB.");
  }

  const signature = await getUploadSignature();

  const form = new FormData();
  form.append("file", file);
  form.append("fileName", file.name);
  form.append("publicKey", signature.public_key);
  form.append("signature", signature.signature);
  form.append("expire", String(signature.expire));
  form.append("token", signature.token);
  form.append("folder", signature.folder);
  form.append("useUniqueFileName", "true");

  const res = await fetch(signature.upload_url, { method: "POST", body: form });
  const body = await res.json().catch(() => null);

  if (!res.ok || !body?.url) {
    throw new Error(body?.message ?? "The image could not be uploaded.");
  }

  return { url: body.url as string, file_id: body.fileId as string };
}
