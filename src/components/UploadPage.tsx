import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMsalToken } from '../hooks/useMsalToken.ts';

import { IconButton, Dialog, DialogType, DialogFooter, DefaultButton, PrimaryButton } from '@fluentui/react';

interface FileInfo {
  filename: string;
  size: number;
  last_modified?: string;
}

const API_URL = "http://localhost:8001";
type UploadPageProps = { showBackButton?: boolean };

const UploadPage: React.FC<UploadPageProps> = ({ showBackButton }) => {
  // Disable auto-fetch, call getToken explicitly after accounts are ready
  const { getToken, accounts } = useMsalToken(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<FileInfo[]>([]);
  const [listLoading, setListLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<FileInfo | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);
  console.log('Accounts in UploadPage:', accounts);

  // Fetch .pptx file list from backend
  const fetchFileList = useCallback(async () => {
    setListLoading(true);
    setStatus(null);
    try {
      const token = await getToken();
      console.log('MSAL Access Token in UploadPage:', token);
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
      setStatus('Could not fetch file list.');
      setFileList([]);
    } finally {
      setListLoading(false);
    }
  }, [getToken]);

  // Only call fetchFileList when accounts are ready
  useEffect(() => {
    if (accounts.length > 0) {
      fetchFileList();
    } else {
      console.log('No accounts found yet in UploadPage');
    }
  }, [accounts, fetchFileList]);


  // Handle file upload
  const handleUpload = useCallback(async () => {
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
        setStatus('Upload successful!');
        setSelectedFile(null);
        fetchFileList();
      } else {
        setStatus('Upload failed.');
      }
    } catch {
      setStatus('Upload failed.');
    } finally {
      setLoading(false);
    }
  }, [selectedFile, getToken, fetchFileList]);

  // Delete logic
  const handleDeleteClick = (file: FileInfo) => {
    setFileToDelete(file);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = useCallback(async () => {
    if (!fileToDelete) return;
    setDeleteLoading(true);
    setStatus(null);
    try {
      const token = await getToken();
      if (!token) {
        setStatus('You must be logged in to delete files.');
        setDeleteLoading(false);
        return;
      }
      const response = await fetch(`${API_URL}/api/delete-file?filename=${encodeURIComponent(fileToDelete.filename)}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setStatus('File deleted.');
        setFileList((prev) => prev.filter(f => f.filename !== fileToDelete.filename));
      } else {
        setStatus('Delete failed.');
      }
    } catch {
      setStatus('Delete failed.');
    } finally {
      setDeleteDialogOpen(false);
      setFileToDelete(null);
      setDeleteLoading(false);
    }
  }, [fileToDelete, getToken]);

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setFileToDelete(null);
  };


  useEffect(() => {
    fetchFileList();
  }, [fetchFileList]);

  // Drag-and-drop logic
  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: 24 }}>
      {showBackButton && (
        <button onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>Back</button>
      )}
      <div
        ref={dropRef}
        onDrop={onDrop}
        onDragOver={e => e.preventDefault()}
        style={{ border: '2px dashed #b3b3b3', borderRadius: 8, padding: 32, textAlign: 'center', marginBottom: 20 }}
      >
        <div style={{ marginBottom: 12 }}>
          <b>Drag & Drop your .pptx file here</b>
        </div>
        <div style={{ color: '#888', marginBottom: 8 }}>or</div>
        <label htmlFor="pptx-input" style={{ cursor: 'pointer', color: '#0078d4', fontWeight: 600 }}>
          Choose a file
        </label>
        <input
          id="pptx-input"
          type="file"
          accept=".pptx,application/vnd.openxmlformats-officedocument.presentationml.presentation"
          style={{ display: 'none' }}
          onChange={handleFileChange}
          disabled={loading}
        />
      </div>
      <button
        onClick={handleUpload}
        disabled={loading || !selectedFile}
        style={{
          background: '#0078d4',
          color: 'white',
          border: 'none',
          borderRadius: 6,
          padding: '10px 28px',
          fontWeight: 600,
          fontSize: 16,
          cursor: loading || !selectedFile ? 'not-allowed' : 'pointer',
          marginBottom: 12,
          width: '100%',
        }}
      >
        {loading ? 'Uploading...' : 'Upload'}
      </button>
      {status && (
        <div style={{ marginTop: 10, color: status.startsWith('Upload successful') ? 'green' : 'red', textAlign: 'center' }}>{status}</div>
      )}
      <hr style={{ margin: '32px 0 18px 0', border: 'none', borderTop: '1px solid #e5e5e5' }} />
      <h3 style={{ marginBottom: 12, fontWeight: 600 }}>Your .pptx Files</h3>
      {listLoading ? (
        <div>Loading files...</div>
      ) : fileList.length === 0 ? (
        <div style={{ color: '#888' }}>No .pptx files found in your bucket.</div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {fileList.map((f) => (
            <li key={f.filename} style={{
              padding: '8px 0',
              borderBottom: '1px solid #f1f1f1',
              display: 'flex',
              alignItems: 'center',
              fontSize: 15,
            }}>
              <span style={{ flex: 1 }}>{f.filename}</span>
              <span style={{ color: '#666', fontSize: 13 }}>{(f.size/1024/1024).toFixed(2)} MB</span>
              {f.last_modified && <span style={{ color: '#aaa', fontSize: 12, marginLeft: 10 }}>{new Date(f.last_modified).toLocaleString()}</span>}
              <IconButton
                iconProps={{ iconName: 'Delete' }}
                title="Delete file"
                ariaLabel="Delete file"
                style={{ marginLeft: 8, color: '#c50f1f' }}
                onClick={() => handleDeleteClick(f)}
                disabled={deleteLoading}
              />
            </li>
          ))}
        </ul>
      )}
      <Dialog
        hidden={!deleteDialogOpen}
        onDismiss={handleCancelDelete}
        dialogContentProps={{
          type: DialogType.normal,
          title: 'Delete File',
          subText: fileToDelete ? `Are you sure you want to delete "${fileToDelete.filename}"? This action cannot be undone.` : '',
        }}
        modalProps={{
          isBlocking: deleteLoading,
        }}
      >
        <DialogFooter>
          <PrimaryButton onClick={handleConfirmDelete} text={deleteLoading ? 'Deleting...' : 'Delete'} disabled={deleteLoading} styles={{ root: { background: '#c50f1f', borderColor: '#c50f1f' } }} />
          <DefaultButton onClick={handleCancelDelete} text="Cancel" disabled={deleteLoading} />
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default UploadPage;
