import React, { useState, useCallback, useRef, useEffect } from 'react';
import LandingLayout from '../../pages/landing/LandingLayout.tsx';
import { useFirebaseAuth } from '../../../auth/useFirebaseAuth.ts';
import './FilesPage.css';

interface FileInfo {
  filename: string;
  size: number;
  last_modified?: string;
  status?: string;
}

const API_URL = "http://localhost:8001";

const FilesPage: React.FC = () => {
  const { user, loading, getIdToken } = useFirebaseAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [fileList, setFileList] = useState<FileInfo[]>([]);
  const [listLoading, setListLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<FileInfo | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [dropActive, setDropActive] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);
  const deleteTooltipRef = useRef<HTMLDivElement | null>(null);

  // Close delete tooltip on outside click
  useEffect(() => {
    if (!deleteDialogOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        deleteTooltipRef.current &&
        !deleteTooltipRef.current.contains(event.target as Node)
      ) {
        setDeleteDialogOpen(false);
        setFileToDelete(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [deleteDialogOpen]);

  // Fetch .pptx file list from backend
  // Fetch .pptx file list from backend
  const fetchFileList = useCallback(async () => {
    setListLoading(true);
    setStatus(null);
    try {
      if (!user) {
        // Only show the message if loading is false (auth check complete)
        if (!loading) {
          setStatus('You must be logged in to view your files.');
        }
        setFileList([]);
        return;
      }
      const token = await getIdToken();
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
  }, [user]);

  useEffect(() => {
    fetchFileList();
  }, [fetchFileList]);

  // File upload handler
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);
    for (const file of files) {
      setSelectedFile(file);
      await uploadFile(file);
    }
    setSelectedFile(null);
  };

  // Drag-and-drop handler should also trigger upload
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
    const handleDrop = async (e: DragEvent) => {
      e.preventDefault();
      setDropActive(false);
      if (e.dataTransfer && e.dataTransfer.files.length > 0) {
        const files = Array.from(e.dataTransfer.files).filter(f => f.name.endsWith('.pptx'));
        for (const file of files) {
          setSelectedFile(file);
          await uploadFile(file);
        }
        setSelectedFile(null);
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

  const uploadFile = async (file: File) => {
    setUploadLoading(true);
    setStatus(null);
    try {
      const token = await getIdToken();
      if (!token) {
        setStatus('You must be logged in to upload files.');
        setUploadLoading(false);
        return;
      }
      const formData = new FormData();
      formData.append('file', file);
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
        setSelectedFile(null);
      }
    } catch (e) {
      setStatus('Error uploading file.');
    } finally {
      setUploadLoading(false);
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
      const token = await getIdToken();
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
      {/* Inject accent color from env as CSS variable for use in CSS */}
      <section
        className="files-page"
        style={{
          '--accent-color': process.env.REACT_APP_ACCENT_COLOR || '#00bfae',
        } as React.CSSProperties}
      >
        <h2 className="files-page__header files-page__header--centered">Manage your files</h2>
        <div className="files-page__status" role="status" aria-live="polite">
          {status}
        </div>
        <section className="files-page__main">
          <div className="files-page__upload">
            <div
              ref={dropRef}
              className={dropActive ? "files-page__drop files-page__drop--active" : "files-page__drop"}
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
              multiple
              style={{ display: 'none' }}
              onChange={handleFileChange}
              disabled={uploadLoading}
            />
            {selectedFile && !uploadLoading && (
              <div className="files-page__upload-filename">{selectedFile.name}</div>
            )}
            {uploadLoading && (
              <div className="files-page__upload-loading-bar" role="progressbar" aria-label="Uploading file">
                <span className="files-page__upload-loading-inner" />
              </div>
            )}
        </div>
        <h3 className="files-page__list-header">Your presentations</h3>
        <div className="files-page__list">
          {listLoading ? (
            <div>Loading...</div>
          ) : fileList.length === 0 ? (
            <div style={{ color: '#888' }}>No .pptx files found in your bucket.</div>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {fileList.map((f) => (
                <li key={f.filename} className="files-page__file-row">
                  <span className="files-page__status-indicator">
  {f.status === 'processing' && (
    <span className="files-page__spinner" title="Processing" aria-label="Processing" />
  )}
  {f.status === 'completed' && (
    <span className="files-page__checkmark" title="Completed" aria-label="Completed">&#10003;</span>
  )}
</span>
<span className="files-page__file-name">{f.filename}</span>
                  <span className="files-page__file-size">{(f.size/1024/1024).toFixed(2)} MB</span>
                  {f.last_modified && <span className="files-page__file-date">{new Date(f.last_modified).toLocaleString()}</span>}
                  <span style={{ position: 'relative', display: 'inline-block' }}>
                    <button
                      className="files-page__delete-btn"
                      title="Delete file"
                      aria-label={`Delete file ${f.filename}`}
                      onClick={() => handleDeleteClick(f)}
                      disabled={deleteLoading}
                    >
                      &#128465;
                    </button>
                    {deleteDialogOpen && fileToDelete && fileToDelete.filename === f.filename && (
                      <div
                        className="files-page__delete-tooltip"
                        role="dialog"
                        aria-modal="true"
                        ref={deleteTooltipRef}
                      >
                        <div className="files-page__delete-tooltip-arrow" />
                        <div className="files-page__delete-tooltip-content">
                          <div style={{ marginBottom: 8, fontWeight: 600, fontSize: 15 }}>Delete?</div>
                          <div style={{ marginBottom: 10, fontSize: 13, color: '#f87171' }}>
                            Are you sure?
                          </div>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button
                              className="files-page__delete-tooltip-btn files-page__delete-tooltip-btn--danger"
                              onClick={handleConfirmDelete}
                              disabled={deleteLoading}
                              style={{ minWidth: 48 }}
                            >
                              {deleteLoading ? '...' : 'Delete'}
                            </button>
                            <button
                              className="files-page__delete-tooltip-btn files-page__delete-tooltip-btn--cancel"
                              onClick={handleCancelDelete}
                              disabled={deleteLoading}
                              style={{ minWidth: 48 }}
                            >
                              Cancel
                            </button>
                            
                          </div>
                        </div>
                      </div>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </section>
  </LandingLayout>
);
}
export default FilesPage;
