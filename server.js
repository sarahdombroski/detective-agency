import express from 'express';

const app = express();

const name = process.env.NAME;

app.get('/', (req, res) => {
  const title = `Welcome Home ${name}`;  
  res.render('home', { title });
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

const PORT = provess.env.PORT || 3000;
app.use((req, res, next) => {
  res.locals.NODE_ENV = NODE_ENV.toLowerCase() || 'production';
  next();
})

if (NODE_ENV.includes('dev')) {
    const ws = await import('ws');

    try {
        const wsPort = parseInt(PORT) + 1;
        const wsServer = new ws.WebSocketServer({ port: wsPort });

        wsServer.on('listening', () => {
            console.log(`WebSocket server is running on port ${wsPort}`);
        });

        wsServer.on('error', (error) => {
            console.error('WebSocket server error:', error);
        });
    } catch (error) {
        console.error('Failed to start WebSocket server:', error);
    }
}

app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});