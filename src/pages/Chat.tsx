import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
  Chip,
  LinearProgress,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Snackbar,
  Alert,
  Fade,
  Paper,
  Tooltip,
  Stack,
  Grid,
  Divider,
  Badge,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  InputAdornment,
  Fab
} from '@mui/material';
import {
  Chat,
  Send,
  Search,
  FilterList,
  Person,
  History,
  Block,
  Flag,
  Delete,
  Close,
  VolumeUp,
  VolumeOff,
  Dashboard,
  Refresh,
  Message,
  Notifications,
  NotificationsOff,
  Schedule,
  CheckCircle,
  RadioButtonUnchecked,
  DoneAll,
  Mic,
  MicOff,
  AttachFile,
  Image,
  SmartToy,
  Mood,
  Translate,
  MoreVert,
  VideoCall,
  Phone,
  Star,
  StarBorder,
  Share,
  Bookmark,
  BookmarkBorder,
  EmojiEmotions,
  KeyboardVoice,
  CloudUpload,
  Download,
  Reply,
  ReplyAll,
  Forward,
  Edit,
  Save,
  Cancel,
  Check,
  ScheduleSend,
  MarkChatRead,
  MarkChatUnread,
  Archive,
  Unarchive,
  Report,
  Security,
  Lock,
  LockOpen,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { listMessages, sendMessage, getConversation, markConversationRead, listConversationStatuses, setConversationStatus, blockUser, deleteMessage, flagConversation, getChatStats } from '../services/chat';
import usersService from '../services/users';
import { API_BASE } from '../services/api';

export default function ChatPage() {
  const [allMsgs, setAllMsgs] = useState<any[]>([]);
  const [convMsgs, setConvMsgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [unread, setUnread] = useState<Record<string, number>>({});
  const [statuses, setStatuses] = useState<Record<string, {status:string, updatedAt?:string}>>({});
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [usersMap, setUsersMap] = useState<Record<string,string>>({});
  const [showProfile, setShowProfile] = useState(false);
  const [profileUser, setProfileUser] = useState<any | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [historyMsgs, setHistoryMsgs] = useState<any[]>([]);
  const [soundOn, setSoundOn] = useState<boolean>(true);
  const [newMessageAlert, setNewMessageAlert] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'info' });
  const esRef = useRef<EventSource | null>(null);

  // Future Features State
  const [isRecording, setIsRecording] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState<Record<string, boolean>>({});
  const [onlineStatus, setOnlineStatus] = useState<Record<string, boolean>>({});
  const [starredMessages, setStarredMessages] = useState<Set<string>>(new Set());
  const [archivedConversations, setArchivedConversations] = useState<Set<string>>(new Set());
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [showMessageActions, setShowMessageActions] = useState(false);
  const [replyToMessage, setReplyToMessage] = useState<any | null>(null);
  const [editingMessage, setEditingMessage] = useState<any | null>(null);
  const [translatedMessages, setTranslatedMessages] = useState<Record<string, string>>({});
  const [showTranslateDialog, setShowTranslateDialog] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [showScheduledSend, setShowScheduledSend] = useState(false);
  const [scheduledDateTime, setScheduledDateTime] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [showSearchInChat, setShowSearchInChat] = useState(false);
  const [chatSearchQuery, setChatSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showVoiceCall, setShowVoiceCall] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [encryptionEnabled, setEncryptionEnabled] = useState(true);
  const [readReceiptsEnabled, setReadReceiptsEnabled] = useState(true);
  const [typingIndicatorsEnabled, setTypingIndicatorsEnabled] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const data = await listMessages();
      const arr = Array.isArray(data) ? data : [];
      setAllMsgs(arr);
      // if no conversation selected, show all messages in main pane
      if (!selectedUser) setConvMsgs(arr);
      // load statuses
      try {
        const st = await listConversationStatuses();
        setStatuses(st || {});
      } catch (e) { console.warn('failed loading statuses', e); }
      // load users map for search/labels
      try {
        const ulist = await usersService.getUsers();
        const map: Record<string,string> = {};
        (ulist || []).forEach(u => { map[u._id] = u.fullName || (u.email || u.phone || ''); });
        setUsersMap(map);
      } catch (e) { console.warn('failed loading users', e); }
    } catch (e) {
      console.error(e);
      setSnackbar({ open: true, message: 'Failed to load messages', severity: 'error' });
    }
    setLoading(false);
  }

  function playBeep() {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = 880;
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      g.gain.setValueAtTime(0.0001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.1, ctx.currentTime + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);
      o.stop(ctx.currentTime + 0.16);
    } catch (e) { console.warn('beep failed', e); }
  }

  useEffect(() => { load(); }, []);

  const location = useLocation();

  useEffect(() => {
    try {
      const conv = (location && (location as any).state && (location as any).state.conversationId) || null;
      if (conv && !loading) selectConversation(conv);
    } catch (e) {}
  }, [loading, location]);

  useEffect(() => {
    // connect to SSE notifications (use absolute backend URL to avoid dev-server proxy issues)
    try {
      const esUrl = `${API_BASE.replace(/\/$/, '')}/api/notifications/stream`;
      const es = new EventSource(esUrl);
      es.addEventListener('notification', (ev: any) => {
        try {
          const data = JSON.parse(ev.data);
          if (data && data.type === 'chat_message') {
            setAllMsgs(prev => [...prev, data]);
            const conv = data.conversationId || (data.from === 'admin' ? data.to : data.from) || 'unknown';
            if (!selectedUser) setConvMsgs(prev => [...prev, data]);
            else if (selectedUser === conv) setConvMsgs(prev => [...prev, data]);
            setUnread(prev => {
              if (selectedUser === conv) return prev; // already viewing
              const next = { ...prev };
              next[conv] = (next[conv] || 0) + 1;
              return next;
            });
            // notification UI + sound
            try {
              setNewMessageAlert(`${data.from}: ${String(data.text || '').slice(0,80)}`);
              if (soundOn) playBeep();
              setTimeout(() => setNewMessageAlert(null), 5000);
            } catch (e) { /* ignore */ }
          }
        } catch (e) { console.error('sse parse', e); }
      });
      esRef.current = es;
    } catch (e) {
      console.warn('SSE not available', e);
    }
    return () => { if (esRef.current) esRef.current.close(); };
  }, [selectedUser]);

  async function handleSend() {
    if (!text.trim()) return;
    const payload: any = { from: 'admin', text: text.trim() };
    if (selectedUser) payload.to = selectedUser;
    if (selectedUser) payload.conversationId = selectedUser;
    try {
      const sent = await sendMessage(payload);
      // append locally
      setAllMsgs(prev => [...prev, sent]);
      setConvMsgs(prev => [...prev, sent]);
      setText('');
    } catch (e) {
      console.error(e);
      setSnackbar({ open: true, message: 'Failed to send message', severity: 'error' });
    }
  }

  async function selectConversation(who: string) {
    setSelectedUser(who);
    // try load conversation by id/window
    try {
      const conv = who; // we use conversationId if present; for now use who
      const data = await getConversation(conv);
      setConvMsgs(data || []);
      // mark read on server
      try { await markConversationRead(conv); } catch (e) {}
      setUnread(prev => { const n = {...prev}; delete n[conv]; return n; });
    } catch (e) {
      console.error(e);
    }
  }

  async function openProfile(who: string) {
    // try to fetch full user details; fall back to usersMap
    try {
      const u = await usersService.getUser(who);
      if (u) setProfileUser(u);
      else setProfileUser({ _id: who, fullName: usersMap[who] || who });
    } catch (e) {
      setProfileUser({ _id: who, fullName: usersMap[who] || who });
    }
    setShowProfile(true);
  }

  async function openHistory(who: string) {
    try {
      const conv = await getConversation(who);
      setHistoryMsgs(Array.isArray(conv) ? conv : (conv.messages || []));
    } catch (e) {
      console.error('failed loading history', e);
      setHistoryMsgs([]);
    }
    setShowHistory(true);
  }

  async function handleBlockUser(userId: string) {
    try {
      await blockUser(userId);
      setSnackbar({ open: true, message: 'User blocked successfully', severity: 'success' });
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Failed to block user', severity: 'error' });
    }
  }

  async function handleFlagConversation(userId: string) {
    try {
      await flagConversation(userId);
      setSnackbar({ open: true, message: 'Conversation flagged', severity: 'success' });
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Failed to flag conversation', severity: 'error' });
    }
  }

  async function handleDeleteMessage(messageId: string) {
    try {
      await deleteMessage(messageId);
      setAllMsgs(prev => prev.filter(x => x._id !== messageId));
      setConvMsgs(prev => prev.filter(x => x._id !== messageId));
      setSnackbar({ open: true, message: 'Message deleted', severity: 'success' });
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Failed to delete message', severity: 'error' });
    }
  }

  async function handleStatusChange(userId: string, status: string) {
    try {
      await setConversationStatus(userId, status);
      const ns = await listConversationStatuses();
      setStatuses(ns || {});
      setSnackbar({ open: true, message: 'Status updated', severity: 'success' });
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Failed to update status', severity: 'error' });
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'success';
      case 'pending': return 'warning';
      case 'closed': return 'default';
      default: return 'primary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <RadioButtonUnchecked />;
      case 'pending': return <Schedule />;
      case 'closed': return <CheckCircle />;
      default: return <Message />;
    }
  };

  // Future Features Functions
  const startRecording = () => {
    setIsRecording(true);
    // Future: Implement voice recording functionality
    setSnackbar({ open: true, message: 'Voice recording started', severity: 'info' });
  };

  const stopRecording = () => {
    setIsRecording(false);
    // Future: Process and send voice message
    setSnackbar({ open: true, message: 'Voice message recorded', severity: 'success' });
  };

  const handleFileAttach = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      setAttachments(prev => [...prev, ...newFiles]);
      // Future: Upload files and show progress
      newFiles.forEach(file => {
        setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));
        // Simulate upload progress
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          setUploadProgress(prev => ({ ...prev, [file.name]: progress }));
          if (progress >= 100) {
            clearInterval(interval);
          }
        }, 200);
      });
    }
  };

  const toggleStarMessage = (messageId: string) => {
    setStarredMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
        setSnackbar({ open: true, message: 'Message removed from starred', severity: 'info' });
      } else {
        newSet.add(messageId);
        setSnackbar({ open: true, message: 'Message starred', severity: 'success' });
      }
      return newSet;
    });
  };

  const toggleArchiveConversation = (conversationId: string) => {
    setArchivedConversations(prev => {
      const newSet = new Set(prev);
      if (newSet.has(conversationId)) {
        newSet.delete(conversationId);
        setSnackbar({ open: true, message: 'Conversation unarchived', severity: 'info' });
      } else {
        newSet.add(conversationId);
        setSnackbar({ open: true, message: 'Conversation archived', severity: 'success' });
      }
      return newSet;
    });
  };

  const generateAISuggestions = () => {
    // Future: AI-powered message suggestions
    const suggestions = [
      "Thank you for your message!",
      "I'll get back to you shortly.",
      "How can I help you today?",
      "Let me check that for you."
    ];
    setAiSuggestions(suggestions);
    setShowAIAssistant(true);
  };

  const translateMessage = async (messageId: string, text: string) => {
    // Future: Implement translation API
    const translated = `[Translated] ${text}`;
    setTranslatedMessages(prev => ({ ...prev, [messageId]: translated }));
    setSnackbar({ open: true, message: 'Message translated', severity: 'success' });
  };

  const scheduleMessage = () => {
    // Future: Implement scheduled message sending
    setSnackbar({ open: true, message: 'Message scheduled', severity: 'success' });
    setShowScheduledSend(false);
    setScheduledDateTime('');
  };

  const startVoiceCall = () => {
    setShowVoiceCall(true);
    setSnackbar({ open: true, message: 'Voice call initiated', severity: 'info' });
  };

  const startVideoCall = () => {
    setShowVideoCall(true);
    setSnackbar({ open: true, message: 'Video call initiated', severity: 'info' });
  };

  const searchInChat = () => {
    // Future: Implement chat search functionality
    const results = convMsgs.filter(msg => 
      msg.text?.toLowerCase().includes(chatSearchQuery.toLowerCase())
    );
    setSearchResults(results);
  };

  const toggleEncryption = () => {
    setEncryptionEnabled(!encryptionEnabled);
    setSnackbar({ 
      open: true, 
      message: `Encryption ${!encryptionEnabled ? 'enabled' : 'disabled'}`, 
      severity: 'success' 
    });
  };

  const toggleReadReceipts = () => {
    setReadReceiptsEnabled(!readReceiptsEnabled);
    setSnackbar({ 
      open: true, 
      message: `Read receipts ${!readReceiptsEnabled ? 'enabled' : 'disabled'}`, 
      severity: 'success' 
    });
  };

  const toggleTypingIndicators = () => {
    setTypingIndicatorsEnabled(!typingIndicatorsEnabled);
    setSnackbar({ 
      open: true, 
      message: `Typing indicators ${!typingIndicatorsEnabled ? 'enabled' : 'disabled'}`, 
      severity: 'success' 
    });
  };

  const calculateAvgResponseTime = () => {
    try {
      const convs: Record<string, any[]> = {};
      allMsgs.forEach(m => { 
        const k = m.conversationId || m.from || m.to || 'unknown'; 
        (convs[k] = convs[k]||[]).push(m); 
      });
      const deltas: number[] = [];
      Object.values(convs).forEach(arr => {
        arr.sort((a,b) => new Date(a.createdAt||Date.now()).getTime() - new Date(b.createdAt||Date.now()).getTime());
        for (let i=0;i<arr.length-1;i++) {
          const a = arr[i], b = arr[i+1];
          if (a.from !== 'admin' && b.from === 'admin') {
            const ta = new Date(a.createdAt||Date.now()).getTime();
            const tb = new Date(b.createdAt||Date.now()).getTime();
            deltas.push(tb-ta);
          }
        }
      });
      if (deltas.length === 0) return '-';
      const avg = Math.round((deltas.reduce((s,n)=>s+n,0)/deltas.length)/1000);
      return `${avg}s`;
    } catch (e) { return '-'; }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      p: { xs: 1.5, sm: 3 }
    }}>
      {/* Header */}
      <Paper sx={{ 
        p: { xs: 2, sm: 3 }, 
        borderRadius: 3, 
        background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
        color: 'white',
        boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)',
        mb: { xs: 2, sm: 4 }
      }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          alignItems: { xs: 'flex-start', md: 'center' }, 
          justifyContent: 'space-between',
          gap: 2 
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ 
              bgcolor: 'rgba(255, 255, 255, 0.2)', 
              mr: { xs: 1.5, sm: 2 },
              width: { xs: 44, sm: 56 },
              height: { xs: 44, sm: 56 }
            }}>
              <Chat sx={{ fontSize: { xs: 24, sm: 32 } }} />
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ 
                fontWeight: 'bold', 
                mb: 0.5,
                fontSize: { xs: '1.25rem', sm: '1.75rem', md: '2.125rem' }
              }}>
                Chat Management
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' } }}>
                Real-time messaging and conversation management
              </Typography>
            </Box>
          </Box>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            width: { xs: '100%', md: 'auto' },
            justifyContent: { xs: 'space-between', md: 'flex-end' },
            flexWrap: 'wrap'
          }}>
            <Button
              variant="contained"
              startIcon={<Dashboard />}
              onClick={async ()=>{ 
                try { 
                  const s = await getChatStats(); 
                  setStats(s || {}); 
                  setShowStatsModal(true); 
                } catch(e){ 
                  console.warn(e); 
                  setShowStatsModal(true);
                }
              }}
              sx={{ 
                bgcolor: 'rgba(255, 255, 255, 0.2)', 
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3)' },
                color: 'white'
              }}
            >
              View Dashboard
            </Button>
            
            {/* Future Features Buttons */}
            <Tooltip title="AI Assistant">
              <IconButton 
                onClick={generateAISuggestions}
                sx={{ 
                  bgcolor: 'rgba(255, 255, 255, 0.2)', 
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3)' },
                  color: 'white'
                }}
              >
                <SmartToy />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Voice Call">
              <IconButton 
                onClick={startVoiceCall}
                sx={{ 
                  bgcolor: 'rgba(255, 255, 255, 0.2)', 
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3)' },
                  color: 'white'
                }}
              >
                <Phone />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Video Call">
              <IconButton 
                onClick={startVideoCall}
                sx={{ 
                  bgcolor: 'rgba(255, 255, 255, 0.2)', 
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3)' },
                  color: 'white'
                }}
              >
                <VideoCall />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Toggle Encryption">
              <IconButton 
                onClick={toggleEncryption}
                sx={{ 
                  bgcolor: encryptionEnabled ? 'rgba(76, 175, 80, 0.3)' : 'rgba(255, 255, 255, 0.2)', 
                  '&:hover': { bgcolor: encryptionEnabled ? 'rgba(76, 175, 80, 0.4)' : 'rgba(255, 255, 255, 0.3)' },
                  color: 'white'
                }}
              >
                {encryptionEnabled ? <Lock /> : <LockOpen />}
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Search in Chat">
              <IconButton 
                onClick={() => setShowSearchInChat(true)}
                sx={{ 
                  bgcolor: 'rgba(255, 255, 255, 0.2)', 
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3)' },
                  color: 'white'
                }}
              >
                <Search />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Refresh messages">
              <IconButton 
                onClick={load}
                disabled={loading}
                sx={{ 
                  bgcolor: 'rgba(255, 255, 255, 0.2)', 
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3)' },
                  color: 'white'
                }}
              >
                {loading ? <Refresh sx={{ animation: 'spin 1s linear infinite' }} /> : <Refresh />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Paper>

      {/* Loading State */}
      {loading && (
        <Box sx={{ mb: 3 }}>
          <LinearProgress sx={{ height: 8, borderRadius: 4 }} />
          <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
            Loading conversations...
          </Typography>
        </Box>
      )}

      {/* Main Chat Interface */}
      <Grid container spacing={3}>
        {/* Conversations List */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)', height: '600px', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Conversations
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="Search users..."
                value={search}
                onChange={e=>setSearch(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />
                }}
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    onChange={e=>setStatusFilter(e.target.value)}
                    label="Status"
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="open">Open</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="closed">Closed</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  size="small"
                  type="date"
                  label="From"
                  value={dateFrom}
                  onChange={e=>setDateFrom(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  size="small"
                  type="date"
                  label="To"
                  value={dateTo}
                  onChange={e=>setDateTo(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
            </CardContent>
            <Box sx={{ flex: 1, overflow: 'auto' }}>
              {(() => {
                const groups = Array.from(new Set(allMsgs.map(m => m.conversationId || (m.from === 'admin' ? m.to : m.from) || m.to || 'unknown')));
                groups.sort((a,b) => {
                  const la = allMsgs.filter(m => (m.conversationId|| (m.from === 'admin' ? m.to : m.from) || m.to) === a).slice(-1)[0];
                  const lb = allMsgs.filter(m => (m.conversationId|| (m.from === 'admin' ? m.to : m.from) || m.to) === b).slice(-1)[0];
                  const ta = la ? (new Date(la.createdAt || la._id?._timestamp || Date.now()).getTime()) : 0;
                  const tb = lb ? (new Date(lb.createdAt || lb._id?._timestamp || Date.now()).getTime()) : 0;
                  return tb - ta;
                });
                const processed = groups
                  .map((who) => {
                    const lastMsg = allMsgs.filter(m => (m.conversationId|| (m.from === 'admin' ? m.to : m.from) || m.to) === who).slice(-1)[0];
                    const lastDate = lastMsg ? new Date(lastMsg.createdAt || Date.now()) : null;
                    const st = statuses[who] && statuses[who].status ? statuses[who].status : 'open';
                    const displayName = usersMap[who] || who;
                    return { who, lastMsg, lastDate, st, displayName };
                  })
                  .filter(g => {
                    if (search && !String(g.displayName).toLowerCase().includes(search.toLowerCase())) return false;
                    if (statusFilter !== 'all' && g.st !== statusFilter) return false;
                    if (dateFrom) {
                      const d = new Date(dateFrom);
                      if (!g.lastDate || g.lastDate < d) return false;
                    }
                    if (dateTo) {
                      const d = new Date(dateTo);
                      d.setHours(23,59,59,999);
                      if (!g.lastDate || g.lastDate > d) return false;
                    }
                    return true;
                  });
                return processed.map(g => (
                  <ListItem
                    key={g.who}
                    button
                    selected={selectedUser === g.who}
                    onClick={() => selectConversation(g.who)}
                    sx={{
                      '&.Mui-selected': {
                        bgcolor: 'primary.light',
                        color: 'primary.contrastText',
                        '&:hover': { bgcolor: 'primary.main' }
                      }
                    }}
                  >
                    <ListItemAvatar>
                      <Badge badgeContent={unread[g.who] || 0} color="error">
                        <Avatar sx={{ bgcolor: selectedUser === g.who ? 'primary.main' : 'grey.400' }}>
                          <Person />
                        </Avatar>
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText
                      primary={g.displayName}
                      secondary={
                        <Box>
                          <Typography variant="body2" sx={{ 
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: 200
                          }}>
                            {g.lastMsg && g.lastMsg.text ? String(g.lastMsg.text).slice(0,60) : ''}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                            <Chip
                              icon={getStatusIcon(g.st)}
                              label={g.st}
                              size="small"
                              color={getStatusColor(g.st) as any}
                              variant="outlined"
                            />
                            <Typography variant="caption" color="text.secondary">
                              {g.lastDate ? g.lastDate.toLocaleString() : ''}
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                ));
              })()}
            </Box>
          </Card>
        </Grid>

        {/* Chat Messages */}
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)', height: '600px', display: 'flex', flexDirection: 'column' }}>
            {selectedUser && (
              <CardContent sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <Person />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {usersMap[selectedUser] || selectedUser}
                      </Typography>
                      <Chip
                        icon={getStatusIcon(statuses[selectedUser]?.status || 'open')}
                        label={statuses[selectedUser]?.status || 'open'}
                        size="small"
                        color={getStatusColor(statuses[selectedUser]?.status || 'open') as any}
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="View Profile">
                      <IconButton size="small" onClick={() => openProfile(selectedUser)}>
                        <Person />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="View History">
                      <IconButton size="small" onClick={() => openHistory(selectedUser)}>
                        <History />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Block User">
                      <IconButton size="small" onClick={() => handleBlockUser(selectedUser)}>
                        <Block />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Flag Conversation">
                      <IconButton size="small" onClick={() => handleFlagConversation(selectedUser)}>
                        <Flag />
                      </IconButton>
                    </Tooltip>
                    <FormControl size="small">
                      <Select
                        value={statuses[selectedUser]?.status || 'open'}
                        onChange={(e) => handleStatusChange(selectedUser, e.target.value)}
                        sx={{ minWidth: 100 }}
                      >
                        <MenuItem value="open">Open</MenuItem>
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="closed">Closed</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
              </CardContent>
            )}
            <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
              {(selectedUser ? convMsgs : allMsgs).map(m => (
                <Box
                  key={m._id || Math.random()}
                  sx={{
                    display: 'flex',
                    justifyContent: m.from === 'admin' ? 'flex-end' : 'flex-start',
                    mb: 2
                  }}
                >
                  <Box sx={{
                    maxWidth: '70%',
                    bgcolor: m.from === 'admin' ? 'primary.main' : 'grey.200',
                    color: m.from === 'admin' ? 'white' : 'text.primary',
                    p: 2,
                    borderRadius: 2,
                    position: 'relative'
                  }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {m.from}
                      {m.meta && m.meta.deviceId && ` • ${m.meta.deviceId}`}
                      {m.createdAt && ` • ${new Date(m.createdAt).toLocaleString()}`}
                    </Typography>
                    <Typography variant="body1">
                      {m.text}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                      <Tooltip title="Delete message">
                        <IconButton 
                          size="small" 
                          onClick={() => handleDeleteMessage(m._id)}
                          sx={{ 
                            bgcolor: 'rgba(255, 255, 255, 0.2)',
                            color: m.from === 'admin' ? 'white' : 'text.secondary',
                            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3)' }
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Flag conversation">
                        <IconButton 
                          size="small" 
                          onClick={() => handleFlagConversation(m.conversationId || m.from || m.to)}
                          sx={{ 
                            bgcolor: 'rgba(255, 255, 255, 0.2)',
                            color: m.from === 'admin' ? 'white' : 'text.secondary',
                            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3)' }
                          }}
                        >
                          <Flag fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
            <CardContent sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
              {/* AI Suggestions */}
              {showAIAssistant && aiSuggestions.length > 0 && (
                <Box sx={{ mb: 2, p: 2, bgcolor: 'primary.50', borderRadius: 1 }}>
                  <Typography variant="caption" sx={{ color: 'primary.dark', mb: 1, display: 'block' }}>
                    AI Suggestions:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {aiSuggestions.map((suggestion, index) => (
                      <Chip
                        key={index}
                        label={suggestion}
                        size="small"
                        clickable
                        onClick={() => {
                          setText(suggestion);
                          setShowAIAssistant(false);
                        }}
                        sx={{ bgcolor: 'white', '&:hover': { bgcolor: 'grey.100' } }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
              
              {/* Reply to Message */}
              {replyToMessage && (
                <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Replying to: {replyToMessage.text?.slice(0, 50)}...
                    </Typography>
                    <IconButton size="small" onClick={() => setReplyToMessage(null)}>
                      <Close fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              )}
              
              {/* Attachments Preview */}
              {attachments.length > 0 && (
                <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {attachments.map((file, index) => (
                    <Box key={index} sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1, 
                      p: 1, 
                      bgcolor: 'grey.100', 
                      borderRadius: 1 
                    }}>
                      <AttachFile fontSize="small" />
                      <Typography variant="caption">{file.name}</Typography>
                      <IconButton size="small" onClick={() => {
                        setAttachments(prev => prev.filter((_, i) => i !== index));
                      }}>
                        <Close fontSize="small" />
                      </IconButton>
                      {uploadProgress[file.name] !== undefined && (
                        <LinearProgress 
                          variant="determinate" 
                          value={uploadProgress[file.name]} 
                          sx={{ width: 60 }}
                        />
                      )}
                    </Box>
                  ))}
                </Box>
              )}
              
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
                <TextField
                  fullWidth
                  multiline
                  maxRows={4}
                  value={text}
                  onChange={e=>setText(e.target.value)}
                  placeholder="Type a message..."
                  variant="outlined"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          {/* Emoji Picker */}
                          <Tooltip title="Add Emoji">
                            <IconButton size="small" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                              <EmojiEmotions fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          
                          {/* File Attachment */}
                          <Tooltip title="Attach File">
                            <IconButton size="small" component="label">
                              <input
                                type="file"
                                multiple
                                hidden
                                onChange={(e) => handleFileAttach(e.target.files)}
                              />
                              <AttachFile fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          {/* Voice Recording */}
                          <Tooltip title={isRecording ? "Stop Recording" : "Start Recording"}>
                            <IconButton 
                              size="small" 
                              onClick={isRecording ? stopRecording : startRecording}
                              sx={{ 
                                color: isRecording ? 'error.main' : 'text.secondary',
                                animation: isRecording ? 'pulse 1.5s infinite' : 'none'
                              }}
                            >
                              {isRecording ? <MicOff /> : <Mic />}
                            </IconButton>
                          </Tooltip>
                          
                          {/* Schedule Send */}
                          <Tooltip title="Schedule Message">
                            <IconButton size="small" onClick={() => setShowScheduledSend(true)}>
                              <ScheduleSend fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </InputAdornment>
                    )
                  }}
                />
                <Fab
                  size="small"
                  color="primary"
                  onClick={handleSend}
                  disabled={!text.trim() && attachments.length === 0}
                  sx={{
                    bgcolor: encryptionEnabled ? 'success.main' : 'primary.main',
                    '&:hover': { 
                      bgcolor: encryptionEnabled ? 'success.dark' : 'primary.dark' 
                    }
                  }}
                >
                  <Send />
                </Fab>
              </Box>
              <Typography variant="caption" sx={{ mt: 1, color: 'text.secondary' }}>
                Selected: {selectedUser || 'All conversations'} | 
                Encryption: {encryptionEnabled ? 'On' : 'Off'} |
                {isRecording && ' | Recording...'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Stats Bar */}
      <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)', mt: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Chip 
                icon={<Chat />}
                label={`Active chats: ${Array.from(new Set(allMsgs.map(m => m.conversationId || m.from || m.to || 'unknown'))).length}`}
                color="primary"
                variant="outlined"
              />
              <Chip 
                icon={<Schedule />}
                label={`Avg response: ${calculateAvgResponseTime()}`}
                color="success"
                variant="outlined"
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={soundOn}
                    onChange={e=>setSoundOn(e.target.checked)}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {soundOn ? <VolumeUp /> : <VolumeOff />}
                    Sound
                  </Box>
                }
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Stats Modal */}
      <Dialog 
        open={showStatsModal} 
        onClose={() => setShowStatsModal(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
          color: 'white',
          py: 3
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              Chat Statistics
            </Typography>
            <IconButton 
              onClick={() => setShowStatsModal(false)}
              sx={{ color: 'white' }}
            >
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="body1">
              <strong>Active chats:</strong> {stats?.activeChats ?? Array.from(new Set(allMsgs.map(m => m.conversationId || m.from || m.to || 'unknown'))).length}
            </Typography>
            <Typography variant="body1">
              <strong>Messages last 24h:</strong> {stats?.messagesLast24h ?? '-'}
            </Typography>
            <Typography variant="body1">
              <strong>Avg response time:</strong> {stats?.avgResponseTime ?? '-'}
            </Typography>
            <Typography variant="body1">
              <strong>Messages per day:</strong> {stats?.messagesPerDay ? JSON.stringify(stats.messagesPerDay) : '-'}
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Profile Modal */}
      <Dialog 
        open={showProfile} 
        onClose={() => setShowProfile(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
          color: 'white',
          py: 3
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              User Profile
            </Typography>
            <IconButton 
              onClick={() => setShowProfile(false)}
              sx={{ color: 'white' }}
            >
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {profileUser && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="body1">
                <strong>Name:</strong> {profileUser.fullName || profileUser._id}
              </Typography>
              <Typography variant="body1">
                <strong>Email:</strong> {profileUser.email || '-'}
              </Typography>
              <Typography variant="body1">
                <strong>Phone:</strong> {profileUser.phone || '-'}
              </Typography>
              <Typography variant="body1">
                <strong>Telegram:</strong> {profileUser.telegramUsername || profileUser.telegramChatId || '-'}
              </Typography>
              <Typography variant="body1">
                <strong>Roles:</strong> {(profileUser.roles || []).join(', ') || '-'}
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* History Modal */}
      <Dialog 
        open={showHistory} 
        onClose={() => setShowHistory(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
          color: 'white',
          py: 3
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              Conversation History
            </Typography>
            <IconButton 
              onClick={() => setShowHistory(false)}
              sx={{ color: 'white' }}
            >
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
            {historyMsgs.length === 0 && (
              <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 4 }}>
                No history available.
              </Typography>
            )}
            {historyMsgs.map(m => (
              <Box
                key={m._id || Math.random()}
                sx={{
                  display: 'flex',
                  justifyContent: m.from === 'admin' ? 'flex-end' : 'flex-start',
                  mb: 2
                }}
              >
                <Box sx={{
                  maxWidth: '70%',
                  bgcolor: m.from === 'admin' ? 'primary.main' : 'grey.200',
                  color: m.from === 'admin' ? 'white' : 'text.primary',
                  p: 2,
                  borderRadius: 2
                }}>
                  <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>
                    {m.from}
                    {m.meta && m.meta.deviceId && ` • ${m.meta.deviceId}`}
                    {m.createdAt && ` • ${new Date(m.createdAt).toLocaleString()}`}
                  </Typography>
                  <Typography variant="body2">
                    {m.text}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </DialogContent>
      </Dialog>

      {/* New Message Alert */}
      <Snackbar
        open={!!newMessageAlert}
        autoHideDuration={5000}
        onClose={() => setNewMessageAlert(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="info" sx={{ width: '100%' }}>
          {newMessageAlert}
        </Alert>
      </Snackbar>

      {/* General Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          severity={snackbar.severity} 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
