// electron/main.js - Electron main process
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

let mainWindow
let store

async function initStore() {
    try {
        const { default: Store } = await import('electron-store')
        store = new Store({
            defaults: {
                userElo: 800,
                completedPuzzles: [],
                solvedPuzzleCount: 0,
                lessonsCompleted: [],
                preferredDifficulty: 2,
                boardTheme: 'classic',
                pieceTheme: 'classic',
                soundEnabled: true,
                windowBounds: { width: 1280, height: 800 }
            }
        })
    } catch (err) {
        console.warn('Could not init electron-store:', err.message)
        // Fallback in-memory store
        const data = {}
        store = {
            get: (key) => data[key],
            set: (key, val) => { data[key] = val },
            delete: (key) => { delete data[key] },
        }
    }
    return store
}

function createWindow() {
    const bounds = store ? store.get('windowBounds') : null
    const width = bounds?.width || 1280
    const height = bounds?.height || 800

    mainWindow = new BrowserWindow({
        width,
        height,
        minWidth: 1024,
        minHeight: 700,
        backgroundColor: '#0D1117',
        titleBarStyle: 'hiddenInset',
        trafficLightPosition: { x: 18, y: 18 },
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: false,
            webSecurity: false,
        },
        show: false,
    })

    // Force show window after a timeout even if ready-to-show doesn't fire
    const showTimeout = setTimeout(() => {
        if (mainWindow && !mainWindow.isVisible()) {
            console.log('Force-showing window after timeout')
            mainWindow.show()
            mainWindow.focus()
        }
    }, 5000)

    mainWindow.once('ready-to-show', () => {
        clearTimeout(showTimeout)
        mainWindow.show()
        mainWindow.focus()
    })

    mainWindow.on('resize', () => {
        if (store && mainWindow) {
            const [w, h] = mainWindow.getSize()
            store.set('windowBounds', { width: w, height: h })
        }
    })

    mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
        console.error('Page failed to load:', errorCode, errorDescription)
        // Retry loading after a short delay
        setTimeout(() => {
            const isDev = !app.isPackaged
            if (isDev) {
                mainWindow.loadURL('http://localhost:5173')
            }
        }, 2000)
    })

    const isDev = !app.isPackaged

    if (isDev) {
        console.log('Loading dev URL: http://localhost:5173')
        mainWindow.loadURL('http://localhost:5173')
    } else {
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
    }
}

// IPC Handlers
ipcMain.handle('store:get', (event, key) => store ? store.get(key) : null)
ipcMain.handle('store:set', (event, key, value) => { if (store) store.set(key, value) })
ipcMain.handle('store:delete', (event, key) => { if (store) store.delete(key) })
ipcMain.handle('app:getVersion', () => app.getVersion())

app.whenReady().then(async () => {
    await initStore()
    createWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
