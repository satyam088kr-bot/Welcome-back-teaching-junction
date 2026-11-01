import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { db, storage } from './config';
import { FileFormat, StudyMaterial } from '../types';

export interface UploadProgressCallback {
  (progress: number, bytesTransferred: number, totalBytes: number): void;
}

export interface UploadResult {
  fileUrl: string;
  storagePath: string;
  fileName: string;
  fileFormat: FileFormat;
  fileSize: string;
  fileSizeBytes: number;
}

/**
 * Detect file format from file extension or MIME type
 */
export function detectFileFormat(fileName: string, mimeType?: string): FileFormat {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';

  if (ext === 'pdf' || mimeType === 'application/pdf') return 'pdf';
  if (ext === 'doc') return 'doc';
  if (ext === 'docx') return 'docx';
  if (ext === 'xls') return 'xls';
  if (ext === 'xlsx') return 'xlsx';
  if (ext === 'ppt') return 'ppt';
  if (ext === 'pptx') return 'pptx';
  if (ext === 'jpg' || ext === 'jpeg') return 'jpg';
  if (ext === 'png') return 'png';
  if (ext === 'txt' || ext === 'text') return 'txt';

  return 'other';
}

/**
 * Format bytes to human readable string (e.g., 2.4 MB)
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * Uploads any educational study material to Firebase Cloud Storage.
 * Supports PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, JPG, PNG, TXT.
 * Reports live progress (0-100%).
 * Falls back safely to client DataURL if Firebase Cloud Storage is offline or rules restricted.
 */
export async function uploadMaterialFile(
  file: File,
  onProgress?: UploadProgressCallback
): Promise<UploadResult> {
  const fileName = file.name;
  const fileFormat = detectFileFormat(fileName, file.type);
  const fileSizeBytes = file.size;
  const fileSize = formatFileSize(fileSizeBytes);
  const safeBaseName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storagePath = `materials/${Date.now()}_${safeBaseName}`;

  try {
    const storageRef = ref(storage, storagePath);
    const metadata = {
      contentType: file.type || 'application/octet-stream',
      customMetadata: {
        originalName: fileName,
        uploadedAt: new Date().toISOString(),
        format: fileFormat,
      },
    };

    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    const downloadUrl = await new Promise<string>((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            snapshot.totalBytes > 0
              ? Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
              : 0;
          if (onProgress) {
            onProgress(progress, snapshot.bytesTransferred, snapshot.totalBytes);
          }
        },
        (error) => {
          console.warn('Firebase Storage upload failed, utilizing resilient offline fallback:', error);
          reject(error);
        },
        async () => {
          try {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(url);
          } catch (e) {
            reject(e);
          }
        }
      );
    });

    return {
      fileUrl: downloadUrl,
      storagePath,
      fileName,
      fileFormat,
      fileSize,
      fileSizeBytes,
    };
  } catch (storageError) {
    console.warn('Falling back to local Blob/Base64 store for offline resilience:', storageError);

    // Simulate smooth progress for instant feedback
    if (onProgress) {
      onProgress(35, Math.round(fileSizeBytes * 0.35), fileSizeBytes);
      await new Promise((r) => setTimeout(r, 120));
      onProgress(85, Math.round(fileSizeBytes * 0.85), fileSizeBytes);
      await new Promise((r) => setTimeout(r, 120));
      onProgress(100, fileSizeBytes, fileSizeBytes);
    }

    // Read as Data URL so it persists in browser across reloads
    const localDataUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = () => {
        // Fallback to object URL
        resolve(URL.createObjectURL(file));
      };
      reader.readAsDataURL(file);
    });

    return {
      fileUrl: localDataUrl,
      storagePath: `local_cache_${Date.now()}_${safeBaseName}`,
      fileName,
      fileFormat,
      fileSize,
      fileSizeBytes,
    };
  }
}

/**
 * Saves a study material document to Cloud Firestore
 */
export async function saveMaterialToFirestore(material: StudyMaterial): Promise<void> {
  try {
    const docRef = doc(db, 'materials', material.id);
    await setDoc(docRef, {
      ...material,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('Firestore write warning (material will remain cached locally):', err);
  }
}

/**
 * Updates a study material document in Cloud Firestore
 */
export async function updateMaterialInFirestore(
  materialId: string,
  updates: Partial<StudyMaterial>
): Promise<void> {
  try {
    const docRef = doc(db, 'materials', materialId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('Firestore update warning:', err);
  }
}

/**
 * Deletes a study material document from Cloud Firestore and Storage
 */
export async function deleteMaterialFromFirestore(
  materialId: string,
  storagePath?: string
): Promise<void> {
  try {
    const docRef = doc(db, 'materials', materialId);
    await deleteDoc(docRef);

    if (storagePath && !storagePath.startsWith('local_cache_')) {
      try {
        const fileRef = ref(storage, storagePath);
        await deleteObject(fileRef);
      } catch (storageErr) {
        console.warn('Storage file cleanup warning:', storageErr);
      }
    }
  } catch (err) {
    console.warn('Firestore delete warning:', err);
  }
}

/**
 * Loads materials from Cloud Firestore
 */
export async function loadMaterialsFromFirestore(): Promise<StudyMaterial[]> {
  try {
    const coll = collection(db, 'materials');
    const snap = await getDocs(coll);
    const results: StudyMaterial[] = [];
    snap.forEach((d) => {
      results.push(d.data() as StudyMaterial);
    });
    return results;
  } catch (err) {
    console.warn('Firestore load warning:', err);
    return [];
  }
}
