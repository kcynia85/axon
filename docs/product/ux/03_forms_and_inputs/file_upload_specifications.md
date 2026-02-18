### Accepted Formats by Context**

`Knowledge Source Upload:
├─ Formats: .pdf, .md, .txt, .docx
├─ Max Size: 50 MB per file
├─ Max Files: 10 files at once
└─ Validation: On file select (before upload)

User Avatar:
├─ Formats: .jpg, .jpeg, .png, .webp, .gif
├─ Max Size: 5 MB
├─ Max Files: 1 file only
├─ Dimensions: Min 100x100px, Max 2000x2000px
└─ Validation: Client-side (instant feedback)

Project/Org Logo:
├─ Formats: .png, .svg (preferably .svg)
├─ Max Size: 2 MB
├─ Max Files: 1 file
├─ Dimensions: Square (1:1 ratio)
└─ Background: Transparent preferred

Agent/Component Icon (Future):
├─ Formats: .png, .svg, emoji
├─ Max Size: 500 KB
└─ Dimensions: 256x256px recommended

Import/Export Files:
├─ Formats: .json (for configs)
├─ Max Size: 10 MB
└─ Validation: Parse JSON, validate schema`

---

### Upload UI Components**

`File Picker (Default):
┌─────────────────────────────────────────────────────┐
│ Upload Document                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│   📄                                                │
│   Drag and drop files here                         │
│   or                                               │
│   [Browse Files]                                   │
│                                                     │
│   Accepted: PDF, MD, TXT, DOCX (max 50 MB)         │
│                                                     │
└─────────────────────────────────────────────────────┘

With Files Selected:
┌─────────────────────────────────────────────────────┐
│ Upload Document                                     │
├─────────────────────────────────────────────────────┤
│ ✓ document.pdf (2.3 MB)                        [×]  │
│ ✓ notes.md (45 KB)                             [×]  │
│ ✓ research.docx (1.8 MB)                       [×]  │
│                                                     │
│ [+ Add More Files] (7 remaining)                   │
│                                                     │
│ [Upload 3 files]                                   │
└─────────────────────────────────────────────────────┘

Avatar Upload:
┌─────────────────────────────────────────────────────┐
│ Profile Picture                                     │
├─────────────────────────────────────────────────────┤
│  ┌─────────┐                                        │
│  │  [JD]   │  [Change]                              │
│  └─────────┘                                        │
│  Current avatar                                     │
│                                                     │
│  Accepted: JPG, PNG (max 5 MB, min 100x100px)      │
└─────────────────────────────────────────────────────┘

After Upload Click:
└─ Opens file picker dialog (native OS)`

---

### Drag and Drop**

`Behavior:
├─ Drag Enter: Highlight drop zone
│  └─ Border: Dashed blue, Background: Light blue
├─ Drag Over: Maintain highlight
├─ Drag Leave: Remove highlight
└─ Drop: Process files, show preview

Drop Zone States:

Idle:
┌─────────────────────────────────────────────────────┐
│   📄 Drag files here or click to browse             │
└─────────────────────────────────────────────────────┘
Border: Dashed gray

Hover (dragging over):
┌═════════════════════════════════════════════════════┐
║   📄 Drop files here                                ║
╚═════════════════════════════════════════════════════╝
Border: Dashed blue, Background: Light blue (#EFF6FF)

Disabled:
┌─────────────────────────────────────────────────────┐
│   📄 Upload disabled (offline)                      │
└─────────────────────────────────────────────────────┘
Border: Dashed gray, Text: Gray, Cursor: not-allowed

Validation on Drop:
├─ Check file types: Show error for invalid
├─ Check file sizes: Show error for too large
├─ Check count: Show error if too many
└─ Valid files: Show preview with checkmarks`

---

### Upload Progress**

`Single File:
┌─────────────────────────────────────────────────────┐
│ Uploading document.pdf                              │
│ [▓▓▓▓▓▓▓▓░░░░░░░░] 45%                              │
│ 2.3 MB / 5.1 MB · 3s remaining                      │
│                                          [Cancel]   │
└─────────────────────────────────────────────────────┘

Multiple Files:
┌─────────────────────────────────────────────────────┐
│ Uploading 3 files...                                │
│                                                     │
│ ✓ document1.pdf (complete)                          │
│ [▓▓▓▓▓▓▓▓░░░░░░░░] document2.pdf (45%)              │
│ ⏳ document3.pdf (pending)                          │
│                                                     │
│ Overall: 2.8 MB / 7.5 MB                            │
│                                          [Cancel All]│
└─────────────────────────────────────────────────────┘

Progress Bar Styling:
├─ Height: 8px
├─ Background: Light gray (#E5E7EB)
├─ Fill: Blue (#3B82F6)
├─ Border Radius: 4px
└─ Animated: Smooth transition (0.3s)

Percentage Display:
├─ Position: Right of progress bar
├─ Format: "45%"
└─ Update: Every 1-5% (not every byte)

Time Remaining:
├─ Calculate: Based on upload speed
├─ Format: "X seconds remaining" or "X minutes remaining"
└─ Update: Every 2 seconds

Cancel Button:
├─ Action: Abort upload, remove file from queue
├─ Confirmation: "Are you sure? Partial upload will be discarded."
└─ Effect: Immediate (don't wait for server response)`

---

### Upload States**

`Idle (before upload):
└─ File selected, waiting for user to click [Upload]

Uploading:
└─ Progress bar animating, percentage updating

Paused (future):
└─ Progress bar gray, [Resume] button visible

Complete:
└─ ✓ Checkmark, "Upload complete"

Failed:
└─ ⚠️ Error icon, error message, [Retry] button

Processing (after upload):
└─ ⏳ "Processing..." (e.g., indexing PDF)

Ready:
└─ ✓ "Ready" (file processed, indexed, available)`

---

### Error Handling**

`Client-Side Validation Errors (before upload):

Invalid Format:
└─ "File format not supported. Please upload PDF, MD, TXT, or DOCX."
└─ Icon: ⚠️ on file preview

File Too Large:
└─ "File 'document.pdf' exceeds 50 MB limit (file is 67 MB). Please upload a smaller file."

Too Many Files:
└─ "Maximum 10 files allowed. You selected 15. Please remove 5 files."

Invalid Dimensions (images):
└─ "Image must be at least 100x100 pixels. Your image is 50x50."

Upload Errors (during upload):

Network Error:
└─ "Upload failed: Connection lost. Please check your internet and try again."
└─ Action: [Retry] button

Server Error:
└─ "Upload failed: Server error. Please try again later."
└─ Action: [Retry] button

Timeout:
└─ "Upload timed out. Your connection may be slow. Please try again."
└─ Action: [Retry] button

Quota Exceeded:
└─ "Storage limit reached. Please delete some files or upgrade your plan."
└─ Action: [View Storage] button

Processing Errors (after upload):

Indexing Failed:
└─ "Failed to index document. The file may be corrupted."
└─ Action: [Re-upload] or [Skip Indexing]

Invalid Content:
└─ "File appears to be corrupted or empty. Please upload a valid file."

Virus Detected:
└─ "This file failed security scan. Upload cancelled for your protection."`

---

### File Preview**

`Before Upload:
┌─────────────────────────────────────────────────────┐
│ 📄 document.pdf                                 [×] │
│ 2.3 MB · PDF Document                               │
└─────────────────────────────────────────────────────┘

After Upload (in list):
┌─────────────────────────────────────────────────────┐
│ 📄 document.pdf                      Ready      [⋮] │
│ 2.3 MB · Indexed 2 minutes ago · 45 chunks          │
└─────────────────────────────────────────────────────┘

Image Preview:
┌─────────────────────────────────────────────────────┐
│ ┌────────┐                                          │
│ │ [IMG]  │  avatar.jpg                         [×] │
│ └────────┘  250 KB · 512x512px                      │
└─────────────────────────────────────────────────────┘

Actions Menu (⋮):
├─ Download
├─ Preview (opens in modal or new tab)
├─ Replace
├─ Delete
└─ View Details`

---

###  Upload Optimization**

`Chunked Upload (Large Files):
├─ Split: Files >5 MB into 1 MB chunks
├─ Upload: One chunk at a time
├─ Resume: If connection drops, resume from last chunk
└─ Benefit: More reliable for large files

Compression:
├─ Images: Auto-compress to max 1920px width (preserve aspect ratio)
├─ PDFs: No compression (would break content)
└─ Benefit: Faster uploads, less storage

Parallel Uploads:
├─ Limit: 3 concurrent uploads max
├─ Queue: Additional files wait in queue
└─ Benefit: Faster for multiple small files

Background Upload (Future - v1.1):
├─ Allow: User to navigate away during upload
├─ Continue: Upload in background
├─ Notify: Show toast when complete or failed
└─ Requires: Service worker or persistent connection`
