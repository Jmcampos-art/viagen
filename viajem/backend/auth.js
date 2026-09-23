/* ============================================================
   VIAGEN - AUTENTICAÇÃO
   ============================================================ */

   import express from 'express';
   import bcrypt from 'bcrypt';
   import jwt from 'jsonwebtoken';
   import { OAuth2Client } from 'google-auth-library';
   import fs from 'fs';
   import path from 'path';
   import { fileURLToPath } from 'url';
   
   const __filename = fileURLToPath(import.meta.url);
   const __dirname = path.dirname(__filename);
   
   const router = express.Router();
   
   const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
   const JWT_SECRET = process.env.JWT_SECRET || 'viagen-secret-troque-em-producao';
   const JWT_EXPIRES = '7d';
   
   const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);
   
   const DB_PATH = path.join(__dirname, 'usuarios.json');
   
   function lerUsuarios() {
     if (!fs.existsSync(DB_PATH)) return [];
     try { return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8')); }
     catch { return []; }
   }
   function salvarUsuarios(usuarios) {
     fs.writeFileSync(DB_PATH, JSON.stringify(usuarios, null, 2), 'utf-8');
   }
   function buscarPorEmail(email) {
     return lerUsuarios().find(u => u.email.toLowerCase() === email.toLowerCase());
   }
   function buscarPorId(id) {
     return lerUsuarios().find(u => u.id === id);
   }
   function criarUsuario({ email, nome, senhaHash = null, provider = 'local', foto = null, isAdmin = false }) {
     const usuarios = lerUsuarios();
     const novo = {
       id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
       email: email.toLowerCase(),
       nome,
       senhaHash,
       provider,
       foto,
       isAdmin,
       criadoEm: new Date().toISOString()
     };
     usuarios.push(novo);
     salvarUsuarios(usuarios);
     return novo;
   }
   
   function gerarToken(usuario) {
     return jwt.sign(
       { id: usuario.id, email: usuario.email, nome: usuario.nome, isAdmin: usuario.isAdmin },
       JWT_SECRET,
       { expiresIn: JWT_EXPIRES }
     );
   }
   
   function usuarioPublico(u) {
     return {
       id: u.id,
       email: u.email,
       nome: u.nome,
       foto: u.foto || null,
       provider: u.provider,
       isAdmin: !!u.isAdmin,
       criadoEm: u.criadoEm
     };
   }
   
   /* Middleware: exige login */
   export function exigirLogin(req, res, next) {
     const auth = req.headers.authorization || '';
     const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
     if (!token) return res.status(401).json({ error: 'Não autenticado' });
     try {
       const payload = jwt.verify(token, JWT_SECRET);
       const usuario = buscarPorId(payload.id);
       if (!usuario) return res.status(401).json({ error: 'Usuário não encontrado' });
       req.usuario = usuario;
       next();
     } catch {
       return res.status(401).json({ error: 'Token inválido ou expirado' });
     }
   }
   
   /* Middleware: exige admin */
   export function exigirAdmin(req, res, next) {
     exigirLogin(req, res, () => {
       if (!req.usuario.isAdmin) {
         return res.status(403).json({ error: 'Acesso restrito a administradores' });
       }
       next();
     });
   }
   
   /* ---------- REGISTRAR ---------- */
   router.post('/api/auth/registrar', async (req, res) => {
     try {
       const { email, senha, nome } = req.body;
       if (!email || !senha || !nome) {
         return res.status(400).json({ error: 'Preencha nome, e-mail e senha' });
       }
       if (senha.length < 6) {
         return res.status(400).json({ error: 'A senha precisa ter pelo menos 6 caracteres' });
       }
       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
       if (!emailRegex.test(email)) {
         return res.status(400).json({ error: 'E-mail inválido' });
       }
       if (buscarPorEmail(email)) {
         return res.status(409).json({ error: 'Este e-mail já está cadastrado' });
       }
       const senhaHash = await bcrypt.hash(senha, 10);
       const usuario = criarUsuario({ email, nome, senhaHash, provider: 'local' });
       console.log(`✅ Novo usuário: ${usuario.email}`);
       res.json({ token: gerarToken(usuario), usuario: usuarioPublico(usuario) });
     } catch (error) {
       console.error('❌ Erro no registro:', error);
       res.status(500).json({ error: 'Erro ao cadastrar' });
     }
   });
   
   /* ---------- LOGIN ---------- */
   router.post('/api/auth/login', async (req, res) => {
     try {
       const { email, senha } = req.body;
       if (!email || !senha) {
         return res.status(400).json({ error: 'Informe e-mail e senha' });
       }
       const usuario = buscarPorEmail(email);
       if (!usuario) return res.status(401).json({ error: 'E-mail ou senha incorretos' });
       if (usuario.provider !== 'local') {
         return res.status(400).json({
           error: `Esta conta foi criada com ${usuario.provider}. Use esse método para entrar.`
         });
       }
       const senhaOk = await bcrypt.compare(senha, usuario.senhaHash);
       if (!senhaOk) return res.status(401).json({ error: 'E-mail ou senha incorretos' });
       console.log(`✅ Login: ${usuario.email}${usuario.isAdmin ? ' (admin)' : ''}`);
       res.json({ token: gerarToken(usuario), usuario: usuarioPublico(usuario) });
     } catch (error) {
       console.error('❌ Erro no login:', error);
       res.status(500).json({ error: 'Erro ao entrar' });
     }
   });
   
   /* ---------- LOGIN GOOGLE ---------- */
   router.post('/api/auth/google', async (req, res) => {
     try {
       const { credential } = req.body;
       if (!credential) return res.status(400).json({ error: 'Credencial do Google ausente' });
       const ticket = await googleClient.verifyIdToken({
         idToken: credential,
         audience: GOOGLE_CLIENT_ID
       });
       const payload = ticket.getPayload();
       const { email, name, picture, email_verified } = payload;
       if (!email_verified) {
         return res.status(400).json({ error: 'E-mail do Google não verificado' });
       }
       let usuario = buscarPorEmail(email);
       if (!usuario) {
         usuario = criarUsuario({
           email,
           nome: name || email.split('@')[0],
           provider: 'google',
           foto: picture
         });
         console.log(`✅ Novo usuário via Google: ${email}`);
       } else {
         console.log(`✅ Login via Google: ${email}`);
       }
       res.json({ token: gerarToken(usuario), usuario: usuarioPublico(usuario) });
     } catch (error) {
       console.error('❌ Erro no Google login:', error);
       res.status(401).json({ error: 'Falha ao validar login do Google' });
     }
   });
   
   /* ---------- PERFIL ---------- */
   router.get('/api/auth/me', exigirLogin, (req, res) => {
     res.json({ usuario: usuarioPublico(req.usuario) });
   });
   
   /* ---------- CONFIG PÚBLICA ---------- */
   router.get('/api/auth/config', (req, res) => {
     res.json({ googleClientId: GOOGLE_CLIENT_ID || null });
   });
   
   /* ============================================================
      SCRIPT UTILITÁRIO: tornar usuário admin
      Chame uma vez: POST /api/auth/tornar-admin { email }
      (Só funciona se ainda não houver admin no sistema)
      ============================================================ */
   router.post('/api/auth/tornar-admin', (req, res) => {
     const { email, chave } = req.body;
     const usuarios = lerUsuarios();
     const jaTemAdmin = usuarios.some(u => u.isAdmin);
   
     // Se já existe admin, exige a chave secreta
     if (jaTemAdmin) {
       const chaveCorreta = process.env.ADMIN_KEY || 'viagen-admin-2025';
       if (chave !== chaveCorreta) {
         return res.status(403).json({ error: 'Chave de admin inválida' });
       }
     }
   
     const usuario = buscarPorEmail(email);
     if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });
   
     usuario.isAdmin = true;
     salvarUsuarios(usuarios);
     console.log(`👑 Usuário promovido a admin: ${usuario.email}`);
     res.json({ ok: true, usuario: usuarioPublico(usuario) });
   });
   
   export default router;