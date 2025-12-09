import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Paper,
    Tabs,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    CircularProgress,
    FormControl,
    FormLabel,
    RadioGroup,
    Radio,
    FormControlLabel,
    Switch,
    Grid,
    Card,
    CardActionArea,
    Divider,
} from '@mui/material';
import { Edit, Delete, Add, CloudUpload } from '@mui/icons-material';
import { Users, TrendingUp, Shield, Clock, BarChart2, Award, Zap } from 'lucide-react';
import {
    getAboutSection,
    updateAboutSection,
    getAllStatisticsAdmin,
    createStatistic,
    updateStatistic,
    deleteStatistic,
    getAllSolutionsAdmin,
    createSolution,
    updateSolution,
    deleteSolution,
    type Statistic,
    type Solution,
    type CreateStatisticDto,
    type CreateSolutionDto,
} from '../../../API/content';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div role="tabpanel" hidden={value !== index} {...other}>
            {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
        </div>
    );
}

// Mapeamento de ícones
const iconComponents: Record<string, React.ElementType> = {
    Users,
    TrendingUp,
    Shield,
    Clock,
    BarChart2,
    Award,
    Zap,
};

const ContentAdminPage: React.FC = () => {
    const [tabValue, setTabValue] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // About Section State
    const [aboutForm, setAboutForm] = useState({
        overline: '',
        title: '',
        subtitle: '',
        solutionsOverline: '',
        solutionsTitle: '',
        solutionsSubtitle: '',
    });

    // Statistics State
    const [statistics, setStatistics] = useState<Statistic[]>([]);
    const [statDialog, setStatDialog] = useState(false);
    const [editingStat, setEditingStat] = useState<Statistic | null>(null);
    const [statForm, setStatForm] = useState<CreateStatisticDto>({
        value: '',
        label: '',
        icon: 'Users',
        iconType: 'lucide',
    });
    const [statImagePreview, setStatImagePreview] = useState<string>('');
    const statFileInputRef = useRef<HTMLInputElement>(null);

    // Solutions State
    const [solutions, setSolutions] = useState<Solution[]>([]);
    const [solDialog, setSolDialog] = useState(false);
    const [editingSol, setEditingSol] = useState<Solution | null>(null);
    const [solForm, setSolForm] = useState<CreateSolutionDto>({
        title: '',
        description: '',
        icon: 'BarChart2',
        iconType: 'lucide',
    });
    const [solImagePreview, setSolImagePreview] = useState<string>('');
    const solFileInputRef = useRef<HTMLInputElement>(null);

    const iconOptions = ['Users', 'TrendingUp', 'Shield', 'Clock', 'BarChart2', 'Award', 'Zap'];

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [about, stats, sols] = await Promise.all([
                getAboutSection(),
                getAllStatisticsAdmin(),
                getAllSolutionsAdmin(),
            ]);
            setAboutForm({
                overline: about.overline,
                title: about.title,
                subtitle: about.subtitle,
                solutionsOverline: about.solutionsOverline || 'Nossas Soluções',
                solutionsTitle: about.solutionsTitle || 'Transforme sua gestão com nossas soluções inteligentes',
                solutionsSubtitle: about.solutionsSubtitle || 'Oferecemos um ecossistema completo de soluções em nuvem para modernizar e otimizar todos os processos da gestão pública.',
            });
            setStatistics(stats);
            setSolutions(sols);
        } catch {
            setError('Erro ao carregar dados');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveAbout = async () => {
        try {
            await updateAboutSection(aboutForm);
            setSuccess('Conteúdo atualizado com sucesso!');
            loadData();
            setTimeout(() => setSuccess(''), 3000);
        } catch {
            setError('Erro ao atualizar conteúdo');
        }
    };

    // Handlers para upload de imagem - Estatísticas
    const handleStatImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                setStatImagePreview(base64);
                setStatForm({ ...statForm, icon: base64, iconType: 'image' });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveStat = async () => {
        try {
            if (editingStat) {
                await updateStatistic(editingStat.id, statForm);
                setSuccess('Estatística atualizada!');
            } else {
                await createStatistic(statForm);
                setSuccess('Estatística criada!');
            }
            setStatDialog(false);
            setStatImagePreview('');
            loadData();
            setTimeout(() => setSuccess(''), 3000);
        } catch {
            setError('Erro ao salvar estatística');
        }
    };

    const handleDeleteStat = async (id: number) => {
        if (!window.confirm('Deseja excluir esta estatística?')) return;
        try {
            await deleteStatistic(id);
            setSuccess('Estatística excluída!');
            loadData();
            setTimeout(() => setSuccess(''), 3000);
        } catch {
            setError('Erro ao excluir estatística');
        }
    };

    // Handlers para upload de imagem - Soluções
    const handleSolImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                setSolImagePreview(base64);
                setSolForm({ ...solForm, icon: base64, iconType: 'image' });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveSol = async () => {
        try {
            if (editingSol) {
                await updateSolution(editingSol.id, solForm);
                setSuccess('Solução atualizada!');
            } else {
                await createSolution(solForm);
                setSuccess('Solução criada!');
            }
            setSolDialog(false);
            setSolImagePreview('');
            loadData();
            setTimeout(() => setSuccess(''), 3000);
        } catch {
            setError('Erro ao salvar solução');
        }
    };

    const handleDeleteSol = async (id: number) => {
        if (!window.confirm('Deseja excluir esta solução?')) return;
        try {
            await deleteSolution(id);
            setSuccess('Solução excluída!');
            loadData();
            setTimeout(() => setSuccess(''), 3000);
        } catch {
            setError('Erro ao excluir solução');
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ pt: { xs: 12, sm: 14, md: 16 }, pb: { xs: 4, sm: 6, md: 8 }, minHeight: '100vh', backgroundColor: '#f9f9f9' }}>
            <Container maxWidth="lg">
                <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
                    <Typography variant="h4" component="h1" fontWeight="bold" color="primary" sx={{ mb: 3 }}>
                        Gerenciar Conteúdo
                    </Typography>

                    {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
                    {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}

                    <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
                        <Tab label="Sobre" />
                        <Tab label="Estatísticas" />
                        <Tab label="Soluções" />
                    </Tabs>

                    {/* Tab Sobre */}
                    <TabPanel value={tabValue} index={0}>
                        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <Typography variant="h6" color="primary" sx={{ mt: 2 }}>Seção "Sobre"</Typography>
                            <TextField
                                label="Overline"
                                value={aboutForm.overline}
                                onChange={(e) => setAboutForm({ ...aboutForm, overline: e.target.value })}
                                fullWidth
                            />
                            <TextField
                                label="Título"
                                value={aboutForm.title}
                                onChange={(e) => setAboutForm({ ...aboutForm, title: e.target.value })}
                                fullWidth
                                required
                            />
                            <TextField
                                label="Subtítulo"
                                value={aboutForm.subtitle}
                                onChange={(e) => setAboutForm({ ...aboutForm, subtitle: e.target.value })}
                                fullWidth
                                multiline
                                rows={4}
                                required
                            />

                            <Divider sx={{ my: 2 }} />

                            <Typography variant="h6" color="primary">Seção "Soluções"</Typography>
                            <TextField
                                label="Overline da Seção Soluções"
                                value={aboutForm.solutionsOverline}
                                onChange={(e) => setAboutForm({ ...aboutForm, solutionsOverline: e.target.value })}
                                fullWidth
                                helperText="Texto pequeno acima do título da seção Soluções"
                            />
                            <TextField
                                label="Título da Seção Soluções"
                                value={aboutForm.solutionsTitle}
                                onChange={(e) => setAboutForm({ ...aboutForm, solutionsTitle: e.target.value })}
                                fullWidth
                                helperText="Título principal da seção Soluções"
                            />
                            <TextField
                                label="Subtítulo da Seção Soluções"
                                value={aboutForm.solutionsSubtitle}
                                onChange={(e) => setAboutForm({ ...aboutForm, solutionsSubtitle: e.target.value })}
                                fullWidth
                                multiline
                                rows={3}
                                helperText="Descrição da seção Soluções"
                            />

                            <Button variant="contained" onClick={handleSaveAbout} size="large">
                                Salvar Todas as Alterações
                            </Button>
                        </Box>
                    </TabPanel>

                    {/* Tab Estatísticas */}
                    <TabPanel value={tabValue} index={1}>
                        <Button variant="contained" startIcon={<Add />} onClick={() => {
                            setEditingStat(null);
                            setStatForm({ value: '', label: '', icon: 'Users', iconType: 'lucide' });
                            setStatImagePreview('');
                            setStatDialog(true);
                        }} sx={{ mb: 2 }}>
                            Nova Estatística
                        </Button>

                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Valor</TableCell>
                                        <TableCell>Label</TableCell>
                                        <TableCell>Ícone</TableCell>
                                        <TableCell>Ativo</TableCell>
                                        <TableCell>Ações</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {statistics.map((stat) => (
                                        <TableRow key={stat.id}>
                                            <TableCell>{stat.value}</TableCell>
                                            <TableCell>{stat.label}</TableCell>
                                            <TableCell>{stat.iconType === 'lucide' ? stat.icon : 'Imagem personalizada'}</TableCell>
                                            <TableCell>{stat.isActive ? 'Sim' : 'Não'}</TableCell>
                                            <TableCell>
                                                <IconButton onClick={() => {
                                                    setEditingStat(stat);
                                                    setStatForm(stat);
                                                    if (stat.iconType === 'image') {
                                                        setStatImagePreview(stat.icon);
                                                    }
                                                    setStatDialog(true);
                                                }}>
                                                    <Edit />
                                                </IconButton>
                                                <IconButton color="error" onClick={() => handleDeleteStat(stat.id)}>
                                                    <Delete />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </TabPanel>

                    {/* Tab Soluções */}
                    <TabPanel value={tabValue} index={2}>
                        <Button variant="contained" startIcon={<Add />} onClick={() => {
                            setEditingSol(null);
                            setSolForm({ title: '', description: '', icon: 'BarChart2', iconType: 'lucide' });
                            setSolImagePreview('');
                            setSolDialog(true);
                        }} sx={{ mb: 2 }}>
                            Nova Solução
                        </Button>

                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Título</TableCell>
                                        <TableCell>Descrição</TableCell>
                                        <TableCell>Ícone</TableCell>
                                        <TableCell>Ativo</TableCell>
                                        <TableCell>Ações</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {solutions.map((sol) => (
                                        <TableRow key={sol.id}>
                                            <TableCell>{sol.title}</TableCell>
                                            <TableCell>{sol.description}</TableCell>
                                            <TableCell>{sol.iconType === 'lucide' ? sol.icon : 'Imagem personalizada'}</TableCell>
                                            <TableCell>{sol.isActive ? 'Sim' : 'Não'}</TableCell>
                                            <TableCell>
                                                <IconButton onClick={() => {
                                                    setEditingSol(sol);
                                                    setSolForm(sol);
                                                    if (sol.iconType === 'image') {
                                                        setSolImagePreview(sol.icon);
                                                    }
                                                    setSolDialog(true);
                                                }}>
                                                    <Edit />
                                                </IconButton>
                                                <IconButton color="error" onClick={() => handleDeleteSol(sol.id)}>
                                                    <Delete />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </TabPanel>
                </Paper>

                {/* Dialog Estatística */}
                <Dialog open={statDialog} onClose={() => setStatDialog(false)} maxWidth="md" fullWidth>
                    <DialogTitle>{editingStat ? 'Editar Estatística' : 'Nova Estatística'}</DialogTitle>
                    <DialogContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                            <TextField
                                label="Valor"
                                value={statForm.value}
                                onChange={(e) => setStatForm({ ...statForm, value: e.target.value })}
                                fullWidth
                            />
                            <TextField
                                label="Label"
                                value={statForm.label}
                                onChange={(e) => setStatForm({ ...statForm, label: e.target.value })}
                                fullWidth
                            />

                            <FormControl component="fieldset">
                                <FormLabel>Tipo de Ícone</FormLabel>
                                <RadioGroup
                                    value={statForm.iconType}
                                    onChange={(e) => {
                                        setStatForm({ ...statForm, iconType: e.target.value as 'lucide' | 'image', icon: e.target.value === 'lucide' ? 'Users' : '' });
                                        setStatImagePreview('');
                                    }}
                                >
                                    <FormControlLabel value="lucide" control={<Radio />} label="Ícone Predefinido" />
                                    <FormControlLabel value="image" control={<Radio />} label="Imagem Personalizada" />
                                </RadioGroup>
                            </FormControl>

                            {statForm.iconType === 'lucide' ? (
                                <>
                                    <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>Escolha um ícone:</Typography>
                                    <Grid container spacing={1}>
                                        {iconOptions.map((iconName) => {
                                            const IconComponent = iconComponents[iconName];
                                            return (
                                                <Grid item key={iconName}>
                                                    <Card
                                                        sx={{
                                                            border: statForm.icon === iconName ? '2px solid' : '1px solid',
                                                            borderColor: statForm.icon === iconName ? 'primary.main' : 'divider',
                                                        }}
                                                    >
                                                        <CardActionArea
                                                            onClick={() => setStatForm({ ...statForm, icon: iconName })}
                                                            sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}
                                                        >
                                                            <IconComponent size={32} />
                                                            <Typography variant="caption">{iconName}</Typography>
                                                        </CardActionArea>
                                                    </Card>
                                                </Grid>
                                            );
                                        })}
                                    </Grid>
                                </>
                            ) : (
                                <Box>
                                    <input
                                        type="file"
                                        ref={statFileInputRef}
                                        onChange={handleStatImageChange}
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                    />
                                    <Button
                                        variant="outlined"
                                        startIcon={<CloudUpload />}
                                        onClick={() => statFileInputRef.current?.click()}
                                        fullWidth
                                    >
                                        {statImagePreview ? 'Alterar Imagem' : 'Upload de Imagem'}
                                    </Button>
                                    {statImagePreview && (
                                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                                            <img src={statImagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: 150 }} />
                                        </Box>
                                    )}
                                </Box>
                            )}

                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={statForm.isActive ?? true}
                                        onChange={(e) => setStatForm({ ...statForm, isActive: e.target.checked })}
                                    />
                                }
                                label="Ativo"
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setStatDialog(false)}>Cancelar</Button>
                        <Button variant="contained" onClick={handleSaveStat}>Salvar</Button>
                    </DialogActions>
                </Dialog>

                {/* Dialog Solução */}
                <Dialog open={solDialog} onClose={() => setSolDialog(false)} maxWidth="md" fullWidth>
                    <DialogTitle>{editingSol ? 'Editar Solução' : 'Nova Solução'}</DialogTitle>
                    <DialogContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                            <TextField
                                label="Título"
                                value={solForm.title}
                                onChange={(e) => setSolForm({ ...solForm, title: e.target.value })}
                                fullWidth
                            />
                            <TextField
                                label="Descrição"
                                value={solForm.description}
                                onChange={(e) => setSolForm({ ...solForm, description: e.target.value })}
                                fullWidth
                                multiline
                                rows={3}
                            />

                            <FormControl component="fieldset">
                                <FormLabel>Tipo de Ícone</FormLabel>
                                <RadioGroup
                                    value={solForm.iconType}
                                    onChange={(e) => {
                                        setSolForm({ ...solForm, iconType: e.target.value as 'lucide' | 'image', icon: e.target.value === 'lucide' ? 'BarChart2' : '' });
                                        setSolImagePreview('');
                                    }}
                                >
                                    <FormControlLabel value="lucide" control={<Radio />} label="Ícone Predefinido" />
                                    <FormControlLabel value="image" control={<Radio />} label="Imagem Personalizada" />
                                </RadioGroup>
                            </FormControl>

                            {solForm.iconType === 'lucide' ? (
                                <>
                                    <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>Escolha um ícone:</Typography>
                                    <Grid container spacing={1}>
                                        {iconOptions.map((iconName) => {
                                            const IconComponent = iconComponents[iconName];
                                            return (
                                                <Grid item key={iconName}>
                                                    <Card
                                                        sx={{
                                                            border: solForm.icon === iconName ? '2px solid' : '1px solid',
                                                            borderColor: solForm.icon === iconName ? 'primary.main' : 'divider',
                                                        }}
                                                    >
                                                        <CardActionArea
                                                            onClick={() => setSolForm({ ...solForm, icon: iconName })}
                                                            sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}
                                                        >
                                                            <IconComponent size={32} />
                                                            <Typography variant="caption">{iconName}</Typography>
                                                        </CardActionArea>
                                                    </Card>
                                                </Grid>
                                            );
                                        })}
                                    </Grid>
                                </>
                            ) : (
                                <Box>
                                    <input
                                        type="file"
                                        ref={solFileInputRef}
                                        onChange={handleSolImageChange}
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                    />
                                    <Button
                                        variant="outlined"
                                        startIcon={<CloudUpload />}
                                        onClick={() => solFileInputRef.current?.click()}
                                        fullWidth
                                    >
                                        {solImagePreview ? 'Alterar Imagem' : 'Upload de Imagem'}
                                    </Button>
                                    {solImagePreview && (
                                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                                            <img src={solImagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: 150 }} />
                                        </Box>
                                    )}
                                </Box>
                            )}

                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={solForm.isActive ?? true}
                                        onChange={(e) => setSolForm({ ...solForm, isActive: e.target.checked })}
                                    />
                                }
                                label="Ativo"
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setSolDialog(false)}>Cancelar</Button>
                        <Button variant="contained" onClick={handleSaveSol}>Salvar</Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
};

export default ContentAdminPage;
