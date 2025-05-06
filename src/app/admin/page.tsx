'use client';

import { useEffect, useState } from 'react';
import { Trash, Edit, Check, X, RefreshCw, Save, ArrowLeft } from 'lucide-react';
import type { Song } from '../types';
import { auth } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
    type status = 'approved' | 'pending';
    
    const [pendingSongs, setPendingSongs] = useState<Song[]>([]);
    const [approvedSongs, setApprovedSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('pending');
    const [editingSong, setEditingSong] = useState<Song | null>(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [editingTab, setEditingTab] = useState<status | null>(null);
    const router = useRouter();
    const adminUid = process.env.NEXT_PUBLIC_ADMIN_UID;
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            if (user.uid === adminUid) {
              console.log('Admin UID:', user.uid);
              fetchSongs(); 
            } else {
              console.log('User is not admin');
              router.push('/profile');
            }
          } else {
            console.log('User not logged in');
            router.push('/profile');
          }
          setLoading(false);
        });
    
        return () => unsubscribe();
    }, [router]);

    const fetchSongs = async () => {
        setLoading(true);
        try {
            const pendingRes = await fetch('/api/pending-song');
            const pendingData = await pendingRes.json();
            setPendingSongs(pendingData);
            
            const approvedRes = await fetch('/api/songs');
            const approvedData = await approvedRes.json();
            setApprovedSongs(approvedData);
        } catch (err) {
            console.error('Failed to fetch songs', err);
            setErrorMessage('Failed to load songs. Please try again.');
        } finally {
            setLoading(false);
        }
    };

  const approveSong = async (id: string) => {
    try {
        setLoading(true);
        const res = await fetch('/api/approve-song', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }),
        });
      
        if (!res.ok) {
            throw new Error('Failed to approve song');
        }
      
        const approvedSong = pendingSongs.find(song => song.id === id);
        if (approvedSong) {
            setApprovedSongs(prev => [...prev, approvedSong]);
            setPendingSongs(prev => prev.filter(song => song.id !== id));
        }
      
        setSuccessMessage('Song approved successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
        console.error('Error approving song:', err);
        setErrorMessage('Failed to approve song. Please try again.');
        setTimeout(() => setErrorMessage(''), 3000);
    } finally {
        setLoading(false);
    }
  };

    const deleteSong = async (id: string, collection: 'songs' | 'pendingSongs') => {
        if (!confirm('Are you sure you want to delete this song?')) {
            return;
        }
        
        try {
            setLoading(true);
            const res = await fetch(`/api/songs/${id}`, {
                method: 'DELETE',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ collection }),
            });
        
        if (!res.ok) {
            throw new Error('Failed to delete song');
        }
        
        if (collection === 'pendingSongs') {
            setPendingSongs(prev => prev.filter(song => song.id !== id));
        } else {
            setApprovedSongs(prev => prev.filter(song => song.id !== id));
        }
        
            setSuccessMessage('Song deleted successfully');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            console.error('Error deleting song:', err);
            setErrorMessage('Failed to delete song. Please try again.');
            setTimeout(() => setErrorMessage(''), 3000);
        } finally {
            setLoading(false);
        }
    };

    const startEditing = (song: Song, tab: status) => {
        setEditingSong({...song});
        setEditingTab(tab);
    };

     const cancelEditing = () => {
        setEditingSong(null);
     };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        if (!editingSong) return;
        
        setEditingSong({
            ...editingSong,
            [e.target.name]: e.target.value
        });
     };

    const saveSongChanges = async () => {
        if (!editingSong) return;
        
        try {
            setLoading(true);
            console.log(editingSong);
            
            const res = await fetch(`/api/songs/${editingSong.id}`, {
                method: 'PUT',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...editingSong,
                    status: editingTab,
                })
            });
        
        if (!res.ok) {
            throw new Error('Failed to update song');
        }
        
        if (editingSong.approved) {
            setApprovedSongs(prev => 
            prev.map(song => song.id === editingSong.id ? editingSong : song)
            );
        } else {
            setPendingSongs(prev => 
            prev.map(song => song.id === editingSong.id ? editingSong : song)
            );
        }
        
            setEditingSong(null);
            setSuccessMessage('Song updated successfully');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            console.error('Error updating song:', err);
            setErrorMessage('Failed to update song. Please try again.');
            setTimeout(() => setErrorMessage(''), 3000);
        } finally {
            setLoading(false);
        }
     };

  if (editingSong) {
    return (
      <div className="p-4 max-w-4xl mx-auto">
        <div className="flex items-center mb-6 gap-2">
          <button 
            onClick={cancelEditing}
            className="flex items-center text-gray-600 hover:text-blue-500"
          >
            <ArrowLeft size={18} className="mr-1" /> Back to List
          </button>
          <h1 className="text-2xl font-bold ml-4">Edit Song</h1>
        </div>

        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {errorMessage}
          </div>
        )}

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Title</label>
              <input
                type="text"
                name="title"
                value={editingSong.title}
                onChange={handleEditChange}
                className="w-full border rounded p-2"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Artist</label>
              <input
                type="text"
                name="artist"
                value={editingSong.artist}
                onChange={handleEditChange}
                className="w-full border rounded p-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Language</label>
              <select
                name="language"
                value={editingSong.language}
                onChange={handleEditChange}
                className="w-full border rounded p-2"
              >
                <option value="Vietnamese">Vietnamese</option>
                <option value="English">English</option>
                <option value="Korean">Korean</option>
                <option value="Japanese">Japanese</option>
                <option value="Romaji">Japanese (Romaji)</option>
                <option value="Chinese">Chinese</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">Status</label>
              <select
                name="approved"
                value={editingSong.approved ? "true" : "false"}
                onChange={(e) => {
                  setEditingSong({
                    ...editingSong,
                    approved: e.target.value === "true"
                  });
                }}
                className="w-full border rounded p-2"
              >
                <option value="true">Approved</option>
                <option value="false">Pending</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Lyrics</label>
            <textarea
              name="lyrics"
              value={editingSong.lyrics}
              onChange={handleEditChange}
              rows={12}
              className="w-full border rounded p-2"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={cancelEditing}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 flex items-center"
            >
              <X size={16} className="mr-1" /> Cancel
            </button>
            <button
              onClick={saveSongChanges}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
              disabled={loading}
            >
              {loading ? (
                <RefreshCw size={16} className="mr-1 animate-spin" />
              ) : (
                <Save size={16} className="mr-1" />
              )}
              Save Changes
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Song Management</h1>
      
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errorMessage}
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      <div className="mb-4">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              className={`mr-1 py-2 px-4 font-medium ${
                activeTab === 'pending'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('pending')}
            >
              Pending Songs ({pendingSongs.length})
            </button>
            <button
              className={`mr-1 py-2 px-4 font-medium ${
                activeTab === 'approved'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('approved')}
            >
              Approved Songs ({approvedSongs.length})
            </button>
          </nav>
        </div>
      </div>

      <div className="mb-4 flex justify-between items-center">
        <button
          onClick={fetchSongs}
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded flex items-center"
        >
          <RefreshCw size={16} className={`mr-1 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {loading && <p className="text-center py-4">Loading songs...</p>}

      {activeTab === 'pending' && !loading && (
        <>
          {pendingSongs.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No pending songs</p>
          ) : (
            <div className="bg-white shadow overflow-hidden rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Artist</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Language</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingSongs.map((song) => (
                    <tr key={song.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{song.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{song.artist}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{song.language}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => approveSong(song.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Approve"
                          >
                            <Check size={18} />
                          </button>
                          <button
                            onClick={() => startEditing(song, activeTab)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => deleteSong(song.id, 'pendingSongs')}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <Trash size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {activeTab === 'approved' && !loading && (
        <>
          {approvedSongs.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No approved songs</p>
          ) : (
            <div className="bg-white shadow overflow-hidden rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Artist</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Language</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Likes</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {approvedSongs.map((song) => (
                    <tr key={song.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{song.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{song.artist}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{song.language}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{song.views || 0}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{song.likes || 0}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => startEditing(song, activeTab)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => deleteSong(song.id, 'songs')}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <Trash size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}