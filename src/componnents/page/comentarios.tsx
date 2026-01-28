import { useState, useEffect, useCallback } from 'react';

import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  CircularProgress,
} from '@mui/material';
import CommentService from '../../API/comentario';
import type {
  Comment as CommentType,
  CreateCommentDto,
  CreateReplyDto,
} from '../../API/comentario';

const Comment = ({
  comment,
  onReply,
}: {
  comment: CommentType;
  onReply: (id: number, data: CreateReplyDto) => void;
}) => {
  const [showReply, setShowReply] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [replyAuthor, setReplyAuthor] = useState('');
  const [replyEmail, setReplyEmail] = useState('');

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || !replyAuthor.trim() || !replyEmail.trim()) return;

    const replyData: CreateReplyDto = {
      content: replyContent,
      author: replyAuthor,
      email: replyEmail,
    };

    await onReply(comment.id, replyData);
    setShowReply(false);
    setReplyContent('');
    setReplyAuthor('');
    setReplyEmail('');
  };

  return (
    <Box sx={{ mt: 2 }}>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar>{comment.author.charAt(0)}</Avatar>
        </ListItemAvatar>
        <ListItemText primary={comment.author} secondary={comment.content} />
      </ListItem>
      <Box sx={{ pl: 7 }}>
        <Button size="small" onClick={() => setShowReply(!showReply)}>
          Responder
        </Button>
        {showReply && (
          <Box
            component="form"
            onSubmit={handleReplySubmit}
            sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 1 }}
          >
            <TextField
              size="small"
              fullWidth
              label="Seu Nome"
              value={replyAuthor}
              onChange={(e) => setReplyAuthor(e.target.value)}
              required
            />
            <TextField
              size="small"
              fullWidth
              label="Seu E-mail"
              value={replyEmail}
              onChange={(e) => setReplyEmail(e.target.value)}
              required
            />
            <TextField
              size="small"
              fullWidth
              label="Sua resposta..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              required
            />
            <Button type="submit" variant="contained" size="small" sx={{ alignSelf: 'flex-start' }}>
              Enviar
            </Button>
          </Box>
        )}
        {comment.replies && comment.replies.length > 0 && (
          <List sx={{ pl: 4 }}>
            {comment.replies.map((reply: CommentType) => (
              <Comment key={reply.id} comment={reply} onReply={onReply} />
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
};

const Comentarios = ({ newsId }: { newsId: number }) => {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState({ author: '', email: '', content: '' });

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedComments = await CommentService.getAllByNewsId(newsId);
      setComments(fetchedComments);
    } catch (error) {
      console.error('Erro ao carregar comentários:', error);
    } finally {
      setLoading(false);
    }
  }, [newsId]);

  useEffect(() => {
    if (newsId) {
      fetchComments();
    }
  }, [fetchComments, newsId]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.content.trim() || !newComment.author.trim() || !newComment.email.trim()) return;

    const commentData: CreateCommentDto = {
      ...newComment,
      newsId,
    };

    try {
      await CommentService.create(commentData);
      setNewComment({ author: '', email: '', content: '' });
      fetchComments(); // Re-fetch comments to show the new one
    } catch (error) {
      console.error('Erro ao enviar comentário:', error);
    }
  };

  const handleReply = async (commentId: number, replyData: CreateReplyDto) => {
    try {
      await CommentService.replyTo(commentId, replyData);
      fetchComments(); // Re-fetch to show the new reply
    } catch (error) {
      console.error('Erro ao enviar resposta:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewComment((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Box sx={{ py: 6, backgroundColor: 'background.default' }}>
      <Container maxWidth="md">
        <Typography variant="h4" component="h2" gutterBottom textAlign="center">
          Deixe seu Comentário
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
          O seu endereço de e-mail não será publicado.
        </Typography>
        <Box
          component="form"
          onSubmit={handleCommentSubmit}
          noValidate
          autoComplete="off"
          sx={{ mt: 3 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Seu Nome"
                name="author"
                value={newComment.author}
                onChange={handleInputChange}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Seu E-mail"
                name="email"
                value={newComment.email}
                onChange={handleInputChange}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Seu Comentário"
                name="content"
                value={newComment.content}
                onChange={handleInputChange}
                variant="outlined"
                multiline
                rows={4}
                required
              />
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button type="submit" variant="contained" color="primary" size="large">
                Enviar Comentário
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 6 }} />

        <Typography variant="h5" component="h3" gutterBottom>
          Comentários
        </Typography>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
            <CircularProgress />
          </Box>
        ) : comments.length > 0 ? (
          <List>
            {comments.map((comment) => (
              <Comment key={comment.id} comment={comment} onReply={handleReply} />
            ))}
          </List>
        ) : (
          <Typography variant="body1" color="text.secondary" textAlign="center">
            Ainda não há comentários. Seja o primeiro a comentar!
          </Typography>
        )}
      </Container>
    </Box>
  );
};

export default Comentarios;
