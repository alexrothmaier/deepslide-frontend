import React, { useState, useCallback, useRef, useEffect } from 'react';
import LandingLayout from '../landing/LandingLayout.tsx';
import { useMsalToken } from '../../hooks/useMsalToken.ts';
import styles from './FilesPage.module.css';

interface FileInfo {
  filename: string;
  size: number;
  last_modified?: string;
}

const API_URL = "http://localhost:8001";

const FilesPage: React.FC = () => {
  const { getToken, accounts } = useMsalToken(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<FileInfo[]>([]);
  const [listLoading, setListLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<FileInfo | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [dropActive, setDropActive] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  // Fetch .pptx file list from backend
  const fetchFileList = useCallback(async () => {
    setListLoading(true);
    setStatus(null);
    try {
      const token = await getToken();
      if (!token) {
        setStatus('You must be logged in to view your files.');
        setFileList([]);
        return;
      }
      const response = await fetch(`${API_URL}/api/list-files`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setFileList(Array.isArray(data.files) ? data.files : []);
      } else {
        setStatus('Could not fetch file list.');
        setFileList([]);
      }
    } catch (e) {
      setStatus('Error fetching file list.');
      setFileList([]);
    } finally {
      setListLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    fetchFileList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accounts]);

  // File upload handler
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setStatus(null);
    try {
      const token = await getToken();
      if (!token) {
        setStatus('You must be logged in to upload files.');
        setLoading(false);
        return;
      }
      const formData = new FormData();
      formData.append('file', selectedFile);
      const response = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (response.ok) {
        setStatus('File uploaded successfully.');
        setSelectedFile(null);
        fetchFileList();
      } else {
        setStatus('Upload failed.');
      }
    } catch (e) {
      setStatus('Error uploading file.');
    } finally {
      setLoading(false);
    }
  };

  // Drag and drop handlers
  useEffect(() => {
    const dropArea = dropRef.current;
    if (!dropArea) return;
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      setDropActive(true);
    };
    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      setDropActive(false);
    };
    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      setDropActive(false);
      if (e.dataTransfer && e.dataTransfer.files.length > 0) {
        setSelectedFile(e.dataTransfer.files[0]);
      }
    };
    dropArea.addEventListener('dragover', handleDragOver);
    dropArea.addEventListener('dragleave', handleDragLeave);
    dropArea.addEventListener('drop', handleDrop);
    return () => {
      dropArea.removeEventListener('dragover', handleDragOver);
      dropArea.removeEventListener('dragleave', handleDragLeave);
      dropArea.removeEventListener('drop', handleDrop);
    };
  }, []);

  // Delete file handlers
  const handleDeleteClick = (file: FileInfo) => {
    setFileToDelete(file);
    setDeleteDialogOpen(true);
  };
  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setFileToDelete(null);
  };
  const handleConfirmDelete = async () => {
    if (!fileToDelete) return;
    setDeleteLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        setStatus('You must be logged in to delete files.');
        setDeleteLoading(false);
        return;
      }
      const response = await fetch(`${API_URL}/api/delete-file`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filename: fileToDelete.filename }),
      });
      if (response.ok) {
        setStatus('File deleted.');
        fetchFileList();
      } else {
        setStatus('Delete failed.');
      }
    } catch (e) {
      setStatus('Error deleting file.');
    } finally {
      setDeleteLoading(false);
      setDeleteDialogOpen(false);
      setFileToDelete(null);
    }
  };

  return (
    <LandingLayout>
      <section className={styles['files-page']}>
        <h1 className={styles['files-page__header']}>Your Files</h1>
        {status && <div className={styles['files-page__status']} role="alert">{status}</div>}
        <div className={styles['files-page__upload']}>
          <div
            ref={dropRef}
            className={dropActive ? `${styles['files-page__drop']} ${styles['files-page__drop--active']}` : styles['files-page__drop']}
            tabIndex={0}
            aria-label="Drag and drop a file here or click to select"
            onClick={() => {
              const input = document.getElementById('file-upload-input');
              if (input) input.click();
            }}
          >
            {selectedFile ? (
              <span>{selectedFile.name}</span>
            ) : (
              <span>Drag & drop a .pptx file here, or click to select</span>
            )}
          </div>
          <input
            id="file-upload-input"
            type="file"
            accept=".pptx"
            style={{ display: 'none' }}
            onChange={handleFileChange}
            disabled={loading}
          />
          <button
            className="button-primary"
            style={{ marginTop: 16 }}
            onClick={handleUpload}
            disabled={!selectedFile || loading}
          >
            {loading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
        <div className={styles['files-page__list']}>
          <h3 style={{ marginBottom: 16 }}>Your .pptx Files</h3>
          {listLoading ? (
            <div>Loading files...</div>
          ) : fileList.length === 0 ? (
            <div style={{ color: '#888' }}>No .pptx files found in your bucket.</div>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {fileList.map((f) => (
                <li key={f.filename} className={styles['files-page__file-row']}>
                  <span className={styles['files-page__file-name']}>{f.filename}</span>
                  <span className={styles['files-page__file-size']}>{(f.size/1024/1024).toFixed(2)} MB</span>
                  {f.last_modified && <span className={styles['files-page__file-date']}>{new Date(f.last_modified).toLocaleString()}</span>}
                  <button
                    className={styles['files-page__delete-btn']}
                    title="Delete file"
                    aria-label={`Delete file ${f.filename}`}
                    onClick={() => handleDeleteClick(f)}
                    disabled={deleteLoading}
                  >
                    &#128465;
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        {deleteDialogOpen && (
          <div className={styles['files-page__dialog']} role="dialog" aria-modal="true">
            <div style={{ marginBottom: '1rem', fontWeight: 600 }}>Delete File</div>
            <div style={{ marginBottom: '1rem' }}>
              {fileToDelete ? `Are you sure you want to delete "${fileToDelete.filename}"? This action cannot be undone.` : ''}
            </div>
            <div className={styles['files-page__dialog-footer']}>
              <button
                className="button-danger"
                onClick={handleConfirmDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
              <button
                className="button-secondary"
                onClick={handleCancelDelete}
                disabled={deleteLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>
    </LandingLayout>
  );
};

export default FilesPage;
