import fs from 'fs'
import path from 'path'

// Helper to escape PDF text
function escapePdfText(text) {
  return text.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')
}

class SimplePdfBuilder {
  constructor() {
    this.objects = []
    this.pages = []
  }

  addObject(content) {
    this.objects.push(content)
    return this.objects.length // 1-based object number
  }

  addPage(commands) {
    const stream = commands.join('\n')
    const streamLen = Buffer.byteLength(stream, 'latin1')
    const contentObj = this.addObject(`<< /Length ${streamLen} >>\nstream\n${stream}\nendstream`)
    this.pages.push(contentObj)
  }

  build() {
    // Reserve page tree and catalog IDs
    const fontObj1 = this.addObject(`<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>`)
    const fontObj2 = this.addObject(`<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>`)
    const fontObj3 = this.addObject(`<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>`)
    const fontObj4 = this.addObject(`<< /Type /Font /Subtype /Type1 /BaseFont /Courier-Bold >>`)

    const pageRefs = []
    const pagesObjNum = this.objects.length + this.pages.length + 1
    const catalogObjNum = pagesObjNum + 1

    const finalObjs = []
    // Add previously built page contents
    // Now create page objects
    for (let i = 0; i < this.pages.length; i++) {
      const contentId = this.pages[i]
      const pageId = this.addObject(
        `<< /Type /Page /Parent ${pagesObjNum} 0 R /MediaBox [0 0 595.28 841.89] /Resources << /Font << /F1 ${fontObj1} 0 R /F2 ${fontObj2} 0 R /F3 ${fontObj3} 0 R /F4 ${fontObj4} 0 R >> >> /Contents ${contentId} 0 R >>`
      )
      pageRefs.push(`${pageId} 0 R`)
    }

    const pagesObj = this.addObject(
      `<< /Type /Pages /Kids [ ${pageRefs.join(' ')} ] /Count ${pageRefs.length} >>`
    )
    const catalogObj = this.addObject(
      `<< /Type /Catalog /Pages ${pagesObj} 0 R >>`
    )

    // Write PDF
    let out = '%PDF-1.4\n'
    const offsets = [0]

    for (let i = 0; i < this.objects.length; i++) {
      offsets.push(Buffer.byteLength(out, 'latin1'))
      out += `${i + 1} 0 obj\n${this.objects[i]}\nendobj\n`
    }

    const xrefOffset = Buffer.byteLength(out, 'latin1')
    out += `xref\n0 ${this.objects.length + 1}\n`
    out += `0000000000 65535 f \n`
    for (let i = 1; i <= this.objects.length; i++) {
      const offStr = String(offsets[i]).padStart(10, '0')
      out += `${offStr} 00000 n \n`
    }
    out += `trailer\n<< /Size ${this.objects.length + 1} /Root ${catalogObj} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`

    return Buffer.from(out, 'latin1')
  }
}

// Layout helper
function createPageWriter() {
  const commands = []
  let y = 800

  // Background header band
  commands.push('q')
  commands.push('0.102 0.420 0.208 rg') // Green brand color
  commands.push('0 770 595.28 72 re')
  commands.push('f')
  commands.push('Q')

  // Top Brand Header
  commands.push('BT')
  commands.push('/F1 18 Tf')
  commands.push('1 1 1 rg')
  commands.push(`50 795 Td (${escapePdfText('AgFarm • Redux Toolkit (RTK) Complete Guide')}) Tj`)
  commands.push('/F2 10 Tf')
  commands.push('0.9 0.95 0.9 rg')
  commands.push(`0 -16 Td (${escapePdfText('Architecture, Slices, State Persistence & Frontend UI Integration')}) Tj`)
  commands.push('ET')

  y = 740

  return {
    commands,
    getY() { return y },
    setY(val) { y = val },
    addHeading(text, size = 14) {
      y -= (size + 14)
      commands.push('BT')
      commands.push(`/F1 ${size} Tf`)
      commands.push('0.102 0.36 0.18 rg') // dark green
      commands.push(`50 ${y} Td (${escapePdfText(text)}) Tj`)
      commands.push('ET')
      y -= 6
    },
    addText(text, size = 9, indent = 50, color = [0.15, 0.2, 0.15]) {
      y -= (size + 5)
      commands.push('BT')
      commands.push(`/F2 ${size} Tf`)
      commands.push(`${color[0]} ${color[1]} ${color[2]} rg`)
      commands.push(`${indent} ${y} Td (${escapePdfText(text)}) Tj`)
      commands.push('ET')
    },
    addCodeBox(lines, startIndent = 50, width = 495) {
      const boxHeight = lines.length * 12 + 14
      y -= (boxHeight + 6)
      // Gray box
      commands.push('q')
      commands.push('0.95 0.96 0.95 rg')
      commands.push(`${startIndent} ${y} ${width} ${boxHeight} re`)
      commands.push('f')
      commands.push('0.8 0.85 0.8 RG 1 w')
      commands.push(`${startIndent} ${y} ${width} ${boxHeight} re`)
      commands.push('S')
      commands.push('Q')

      let lineY = y + boxHeight - 12
      commands.push('BT')
      commands.push('/F3 8.5 Tf')
      commands.push('0.1 0.25 0.1 rg')
      for (const line of lines) {
        commands.push(`${startIndent + 10} ${lineY} Td (${escapePdfText(line)}) Tj`)
        lineY -= 12
        commands.push(`-${startIndent + 10} 0 Td`) // reset X
      }
      commands.push('ET')
      y -= 8
    },
    addDivider() {
      y -= 10
      commands.push('q')
      commands.push('0.85 0.88 0.85 RG 0.5 w')
      commands.push(`50 ${y} m 545 ${y} l S`)
      commands.push('Q')
      y -= 8
    },
    addFooter(pageNum, totalPages = 3) {
      commands.push('BT')
      commands.push('/F2 8 Tf')
      commands.push('0.5 0.5 0.5 rg')
      commands.push(`50 30 Td (${escapePdfText(`AgFarm Technical Architecture Guide — Page ${pageNum} of ${totalPages}`)}) Tj`)
      commands.push('ET')
    }
  }
}

const pdf = new SimplePdfBuilder()

// PAGE 1: Overview & Frontend Fixes
{
  const p1 = createPageWriter()
  p1.addHeading('1. Frontend UI Diagnosis & Resolved Issues', 13)
  p1.addText('Why was the frontend UI not showing or appearing inactive?', 10, 50, [0.05, 0.05, 0.05])
  p1.addText('1. Vite Network Binding: By default, Vite binds to [::1] (IPv6 loopback). On Windows, browsers attempting to', 9, 58)
  p1.addText('   access http://localhost:5173 or 127.0.0.1 can fail if IPv4/IPv6 resolution is misconfigured.', 9, 58)
  p1.addText('   Fix Applied: Configured server: { host: true, port: 5173 } in vite.config.ts to bind to 0.0.0.0 & ::.', 9, 58, [0.1, 0.45, 0.2])
  p1.addText('2. Ephemeral Redux Auth State: authSlice was resetting user and accessToken to null on refresh.', 9, 58)
  p1.addText('   Fix Applied: Implemented automatic localStorage synchronization in authSlice (initialState & reducers).', 9, 58, [0.1, 0.45, 0.2])
  p1.addText('3. Missing Bearer Token: Axios instance in src/lib/api.ts was not injecting the Authorization header.', 9, 58)
  p1.addText('   Fix Applied: Added an Axios request interceptor that automatically attaches Bearer <token>.', 9, 58, [0.1, 0.45, 0.2])
  p1.addText('4. Missing Typed Hooks & Barrel Export: Official RTK recommends useAppDispatch & useAppSelector.', 9, 58)
  p1.addText('   Fix Applied: Created src/store/hooks.ts and src/store/index.ts barrel exports.', 9, 58, [0.1, 0.45, 0.2])
  p1.addText('5. Missing Route Fallback: Any unmatched route rendered blank. Added <Route path="*" element={<Navigate to="/" />} />.', 9, 58)

  p1.addDivider()

  p1.addHeading('2. Redux Toolkit (RTK) Core Architecture', 13)
  p1.addText('Redux Toolkit is the official, opinionated, batteries-included toolset for efficient Redux development.', 9.5)
  p1.addText('It solves the 3 major classic Redux headaches: boilerplate setup, complex store configs, and immutability bugs.', 9)

  p1.addText('Key Building Blocks of Redux Toolkit:', 9.5, 50, [0.1, 0.35, 0.15])
  p1.addText('• configureStore(): Simplifies store setup with Redux Thunk and Redux DevTools enabled by default.', 9, 58)
  p1.addText('• createSlice(): Generates action creators, action types, and reducers in one unified declarative block.', 9, 58)
  p1.addText('• Built-in Immer: Lets you write "mutative" code (state.user = action.payload) that safely creates immutable copies.', 9, 58)
  p1.addText('• createAsyncThunk(): Handles asynchronous lifecycles (pending, fulfilled, rejected) cleanly.', 9, 58)

  p1.addFooter(1, 3)
  pdf.addPage(p1.commands)
}

// PAGE 2: Code Examples - Slices & Store
{
  const p2 = createPageWriter()
  p2.addHeading('3. Implementing Slices with createSlice', 13)
  p2.addText('Below is the exact production implementation of authSlice.ts with safe state persistence:', 9)

  p2.addCodeBox([
    "import { createSlice, type PayloadAction } from '@reduxjs/toolkit'",
    "import type { AuthUser } from '@/services/auth.service'",
    "",
    "const storedToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null",
    "const storedUserStr = typeof window !== 'undefined' ? localStorage.getItem('authUser') : null",
    "",
    "const initialState = {",
    "  user: storedUserStr ? JSON.parse(storedUserStr) : null,",
    "  accessToken: storedToken,",
    "  isAuthenticated: Boolean(storedToken),",
    "  isLoading: false, error: null",
    "}",
    "",
    "export const authSlice = createSlice({",
    "  name: 'auth',",
    "  initialState,",
    "  reducers: {",
    "    setCredentials(state, action: PayloadAction<{ user: AuthUser; accessToken: string }>) {",
    "      state.user = action.payload.user",
    "      state.accessToken = action.payload.accessToken",
    "      state.isAuthenticated = true",
    "      localStorage.setItem('accessToken', action.payload.accessToken)",
    "      localStorage.setItem('authUser', JSON.stringify(action.payload.user))",
    "    },",
    "    clearCredentials(state) {",
    "      state.user = null; state.accessToken = null; state.isAuthenticated = false",
    "      localStorage.removeItem('accessToken')",
    "      localStorage.removeItem('authUser')",
    "    }",
    "  }",
    "})"
  ])

  p2.addHeading('4. Configuring the Central Store (store.ts)', 13)
  p2.addCodeBox([
    "import { configureStore } from '@reduxjs/toolkit'",
    "import uiSlice from './slices/uiSlice'",
    "import authSlice from './slices/authSlice'",
    "",
    "export const store = configureStore({",
    "  reducer: { ui: uiSlice, auth: authSlice }",
    "})",
    "",
    "export type RootState = ReturnType<typeof store.getState>",
    "export type AppDispatch = typeof store.dispatch"
  ])

  p2.addFooter(2, 3)
  pdf.addPage(p2.commands)
}

// PAGE 3: Hooks, Components & Integration
{
  const p3 = createPageWriter()
  p3.addHeading('5. Typed React-Redux Hooks (hooks.ts)', 13)
  p3.addText('Instead of importing untyped useDispatch/useSelector into components, use pre-typed hooks:', 9)

  p3.addCodeBox([
    "import { useDispatch, useSelector } from 'react-redux'",
    "import type { AppDispatch, RootState } from './store'",
    "",
    "// Pre-typed hooks for components",
    "export const useAppDispatch = useDispatch.withTypes<AppDispatch>()",
    "export const useAppSelector = useSelector.withTypes<RootState>()"
  ])

  p3.addHeading('6. How to Use in React Components (e.g., Navbar / Login)', 13)
  p3.addText('Read state using useAppSelector and update state using useAppDispatch:', 9)

  p3.addCodeBox([
    "import { useAppDispatch, useAppSelector, setCredentials, clearCredentials } from '@/store'",
    "",
    "export function UserProfileHeader() {",
    "  const dispatch = useAppDispatch()",
    "  const { user, isAuthenticated } = useAppSelector((state) => state.auth)",
    "",
    "  if (!isAuthenticated) {",
    "    return <Link to='/login'>Sign In</Link>",
    "  }",
    "",
    "  return (",
    "    <div>",
    "      <span>Welcome back, {user?.fullname}!</span>",
    "      <button onClick={() => dispatch(clearCredentials())}>Logout</button>",
    "    </div>",
    "  )",
    "}"
  ])

  p3.addHeading('7. How to View the Frontend UI', 13)
  p3.addText('1. Open your browser and navigate to: http://localhost:5173 or http://127.0.0.1:5173', 9.5, 58, [0.1, 0.4, 0.15])
  p3.addText('2. The dev server is already running! (Vite now responds on both IPv4 and IPv6).', 9, 58)
  p3.addText('3. Test the navbar: Click "Sign In" or "Register" to test Redux authentication in real-time!', 9, 58)

  p3.addFooter(3, 3)
  pdf.addPage(p3.commands)
}

// Save PDF
const buffer = pdf.build()
const outputPath = path.resolve('Redux_Toolkit_Guide.pdf')
fs.writeFileSync(outputPath, buffer)
console.log('PDF successfully created at:', outputPath)
