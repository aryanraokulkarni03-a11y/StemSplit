/**
 * API utilities for upload constraints and validation
 */

export interface UploadConstraints {
  maxFileSize: number;
  maxFileSizeMB: number;
  acceptedTypes: string[];
  acceptedExtensions: string[];
}

/**
 * Fetches upload constraints from the backend
 */
export async function fetchUploadConstraints(): Promise<UploadConstraints> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/upload/constraints`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch upload constraints');
  }
  
  return response.json();
}

/**
 * Validates a file against given constraints
 */
export function validateFile(file: File, constraints: UploadConstraints): string | null {
  // Check file type
  const isValidType = constraints.acceptedTypes.includes(file.type) ||
    constraints.acceptedExtensions.some(ext => file.name.toLowerCase().endsWith(ext));

  if (!isValidType) {
    const extensions = constraints.acceptedExtensions.join(', ').toUpperCase();
    return `Only ${extensions} files supported`;
  }

  // Check file size
  if (file.size > constraints.maxFileSize) {
    return `Max file size is ${constraints.maxFileSizeMB}MB`;
  }

  return null;
}