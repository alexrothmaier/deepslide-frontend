import React, { useState } from 'react';
import {
  List,
  Image,
  Text,
  Stack,
  ActionButton,
  ProgressIndicator,
  IconButton,
  Dialog,
  DialogType,
  DialogFooter,
  DefaultButton,
} from '@fluentui/react';
import { useOfficeContext } from '../hooks/useOfficeContext.ts';
import { SearchResult } from '../types';
import './ResultsList.css';

/// <reference types="office-js" />
declare const PowerPoint: any;
declare const Office: any;

// Helper to get selected slide ID using Office.js
function getSelectedSlideID(): Promise<string | undefined> {
  return new Promise((resolve, reject) => {
    if (!Office || !Office.context || !Office.context.document) {
      reject('Office.js context is not available');
      return;
    }
    Office.context.document.getSelectedDataAsync(Office.CoercionType.SlideRange, function (asyncResult: any) {
      try {
        if (asyncResult.status === Office.AsyncResultStatus.Failed) {
          reject(asyncResult.error.message);
        } else if (asyncResult.value?.slides?.length > 0) {
          resolve(asyncResult.value.slides[0].id);
        } else {
          resolve(undefined);
        }
      } catch (error) {
        reject(error);
      }
    });
  });
}

interface ResultsListProps {
  results: SearchResult[];
  searchHistoryId: string;
}

interface FeedbackMap {
  [slideId: string]: 'helpful' | 'not helpful' | 'inserted' | null;
}

// Authenticated fetch hook
function useAuthFetch() {
  const { instance, accounts } = useAuthContext();
  const account = accounts[0];

  const authFetch = async (url: string, options: any = {}) => {
    const token = await getAccessToken(instance, account);
    return fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
      },
    });
  };

  const getToken = async () => {
    return await getAccessToken(instance, account);
  };

  return { authFetch, getToken };
}

const API_URL = 'http://localhost:8001';

const ResultsList: React.FC<ResultsListProps> = ({ results, searchHistoryId }) => {
  const { authFetch, getToken } = useAuthFetch();
  const { insertSlide, inserting, error } = useOfficeContext();

  const [feedbacks, setFeedbacks] = useState<FeedbackMap>({});
  const [feedbackErrors, setFeedbackErrors] = useState<{ [slideId: string]: string | null }>({});
  const [descDialogOpen, setDescDialogOpen] = useState(false);
  const [descDialogContent, setDescDialogContent] = useState('');
  const [downloadError, setDownloadError] = useState<string | null>(null);
  // Track which slide's feedback message is currently shown
  const [feedbackShown, setFeedbackShown] = useState<{ [slideId: string]: boolean }>({});

  const handleOpenDescription = (description: string) => {
    setDescDialogContent(description);
    setDescDialogOpen(true);
  };

  const handleCloseDescription = () => {
    setDescDialogOpen(false);
    setDescDialogContent('');
  };

  const sendFeedback = async (slideId: string, feedback: 'helpful' | 'not helpful') => {
    if (!searchHistoryId) {
      setFeedbackErrors((prev) => ({ ...prev, [slideId]: 'No search context. Please try again later.' }));
      return;
    }
    setFeedbacks((prev) => ({ ...prev, [slideId]: feedback }));
    setFeedbackErrors((prev) => ({ ...prev, [slideId]: null }));
    setFeedbackShown((prev) => ({ ...prev, [slideId]: true })); // Show feedback message
    // Hide feedback message after 2 seconds and re-enable buttons
    setTimeout(() => {
      setFeedbackShown((prev) => ({ ...prev, [slideId]: false }));
      setFeedbacks((prev) => ({ ...prev, [slideId]: null }));
    }, 2000);
    try {
      const res = await authFetch(`${API_URL}/api/slide-feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          search_history_id: searchHistoryId,
          slide_id: slideId,
          feedback,
        }),
      });
      if (!res.ok) throw new Error('Failed to send feedback');
    } catch (e: any) {
      setFeedbacks((prev) => {
        const copy = { ...prev };
        delete copy[slideId];
        return copy;
      });
      setFeedbackErrors((prev) => ({ ...prev, [slideId]: e?.message || 'Failed to send feedback' }));
    }
  };

  const handleOpenSourcePresentation = async (result: SearchResult) => {
    try {
      const url = `${API_URL}/api/download-pptx?presentation_name=${encodeURIComponent(result.presentation_name)}`;
      const token = await getToken();
      const response = await authFetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error(`Download failed: ${response.statusText}`);
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = result.presentation_name || 'presentation.pptx';
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        window.URL.revokeObjectURL(link.href);
        document.body.removeChild(link);
      }, 100);
    } catch (err) {
      console.error('[Download Error]', err);
      setDownloadError('Failed to download the presentation. Please check your authentication and try again.');
    }
  };

  const markInserted = async (slideId: string) => {
    setFeedbacks((prev) => ({ ...prev, [slideId]: 'inserted' }));
  };

  const handleInsertSlide = async (result: SearchResult) => {
    const url = `${API_URL}/api/get-presentation-base64?presentation_name=${encodeURIComponent(result.presentation_name)}`;
    try {
      const response = await authFetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      Office.onReady().then(async () => {
        if (typeof PowerPoint !== 'undefined' && data.pptx_base64) {
          try {
            let targetSlideId: string | undefined = undefined;
            try {
              targetSlideId = await getSelectedSlideID();
            } catch (err) {
              console.warn('[Insert Slide] Could not get selected slide ID:', err);
            }
            await PowerPoint.run(async (context: any) => {
              const options: any = { sourceSlideIds: [result.slide_id] };
              if (targetSlideId) options.targetSlideId = `${targetSlideId}#`;
              context.presentation.insertSlidesFromBase64(data.pptx_base64, options);
              await context.sync();
            });
          } catch (e) {
            console.error('[Insert Slide] PowerPoint insertion failed:', e);
          }
        }
      });
    } catch (err) {
      console.error('[Insert Slide] Fetch/Insert failed:', err);
    }
  };

  const renderResult = (item?: SearchResult, index?: number): React.ReactNode => {
    if (!item || typeof index !== 'number') return null;
    const isInserting = inserting === item.id;

    return (
      <Stack className="result-item" key={item.id || index}>
        <Stack horizontal tokens={{ childrenGap: 12 }}>
          <div className="thumbnail-container">
            <Image
              src={item.image_url || item.image_path || '/placeholder-slide.png'}
              alt={`Slide ${item.slide_number}`}
              width={320}
              height={180}
              className="slide-thumbnail"
              styles={{ root: { background: '#f4f4f4', border: '1px solid #edebe9' } }}
              onError={(e) => {
                if (e.currentTarget.src !== window.location.origin + '/placeholder-slide.png') {
                  e.currentTarget.src = '/placeholder-slide.png';
                }
              }}
            />
            <Text className="slide-number">Slide {item.slide_number}</Text>
          </div>
          <Stack className="result-details" tokens={{ childrenGap: 8 }}>
            <Text className="presentation-name">{item.presentation_name}</Text>
            <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 4 }}>
              <Text className="relevance-score">
                Relevance Score:{' '}
                {typeof item.distance === 'number'
                  ? item.distance.toFixed(3)
                  : typeof item.similarity === 'number'
                  ? (1 - item.similarity).toFixed(3)
                  : 'N/A'}
              </Text>
              <IconButton iconProps={{ iconName: 'Info' }} onClick={() => handleOpenDescription(item.description)} />
            </Stack>
            {feedbackShown[item.slide_id] && feedbacks[item.slide_id] !== 'inserted' ? (
              <Text variant="small" style={{ marginTop: 4, color: '#107c10', fontWeight: 500 }}>
                Thanks for your feedback!
              </Text>
            ) : (
              <Stack horizontal tokens={{ childrenGap: 8 }}>
                <IconButton
                  iconProps={{ iconName: 'Like' }}
                  title="Helpful"
                  aria-label="Helpful"
                  onClick={() => sendFeedback(item.slide_id, 'helpful')}
                  disabled={!!feedbackShown[item.slide_id]}
                />
                <IconButton
                  iconProps={{ iconName: 'Dislike' }}
                  title="Not Helpful"
                  aria-label="Not Helpful"
                  onClick={() => sendFeedback(item.slide_id, 'not helpful')}
                  disabled={!!feedbackShown[item.slide_id]}
                />
                <ActionButton
                  iconProps={{ iconName: 'Add' }}
                  text="Insert Slide"
                  onClick={async () => {
                    await handleInsertSlide(item);
                    await markInserted(item.slide_id);
                  }}
                  disabled={isInserting || feedbacks[item.slide_id] === 'inserted'}
                  className="insert-button"
                  title="Insert this slide into your current presentation"
                />
              </Stack>
            )}
            {feedbackErrors[item.slide_id] && (
              <Text variant="small" style={{ color: 'red', marginTop: 4 }}>
                {feedbackErrors[item.slide_id]} (please try again)
              </Text>
            )}
            {feedbacks[item.slide_id] === 'inserted' && (
              <Text variant="small" style={{ marginTop: 4 }}>
                Feedback: inserted
              </Text>
            )}
            <ActionButton
              iconProps={{ iconName: 'OpenInNewWindow' }}
              text="Open Source"
              onClick={() => handleOpenSourcePresentation(item)}
              className="open-source-presentation-button"
              title="Open the original PowerPoint presentation in a new window"
            />
            {isInserting && <ProgressIndicator label="Inserting slide..." />}
          </Stack>
        </Stack>
      </Stack>
    );
  };

  return (
    <div className="results-list">
      {!searchHistoryId && (
        <Text style={{ color: 'red', fontWeight: 600, marginBottom: 16 }}>
          Cannot send feedback: missing search context. Please refresh or start a new search.
        </Text>
      )}
      <Text variant="large" className="results-header">
        {results.length} {results.length === 1 ? 'Result' : 'Results'}
      </Text>
      <List items={results} onRenderCell={renderResult} />

      <Dialog
        hidden={!descDialogOpen}
        onDismiss={handleCloseDescription}
        dialogContentProps={{
          type: DialogType.normal,
          title: 'Slide Description',
          subText: descDialogContent,
        }}
        modalProps={{ isBlocking: false }}
      >
        <DialogFooter>
          <DefaultButton onClick={handleCloseDescription} text="Close" />
        </DialogFooter>
      </Dialog>

      <Dialog
        hidden={!downloadError}
        onDismiss={() => setDownloadError(null)}
        dialogContentProps={{
          type: DialogType.normal,
          title: 'Download Error',
          subText: downloadError || '',
        }}
        modalProps={{ isBlocking: false }}
      >
        <DialogFooter>
          <DefaultButton onClick={() => setDownloadError(null)} text="OK" />
        </DialogFooter>
      </Dialog>

      {error && <Text className="error-text">{error}</Text>}
    </div>
  );
};

export default ResultsList;
