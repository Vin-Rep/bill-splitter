import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import ItemTable from './ItemTable'

interface Item {
  name: string
  price: number
}

interface ReceiptData {
  items: Item[]
  subtotal: number
  tax: number
  total: number
}

function App() {
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [receipt, setReceipt] = useState<ReceiptData | null>(null)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    setPreview(URL.createObjectURL(file))
    setUploading(true)

    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('http://127.0.0.1:8000/upload', {
      method: 'POST',
      body: formData
    })

    const data = await response.json()
    setReceipt(data)
    setUploading(false)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1
  })

  return (
    <div style={{ maxWidth: 600, margin: '60px auto', fontFamily: 'sans-serif' }}>
      <h1>Bill Splitter</h1>

      <div
        {...getRootProps()}
        style={{
          border: '2px dashed #ccc',
          borderRadius: 8,
          padding: 40,
          textAlign: 'center',
          cursor: 'pointer',
          background: isDragActive ? '#f0f0f0' : 'white'
        }}
      >
        <input {...getInputProps()} />
        {uploading
          ? <p>Scanning receipt...</p>
          : isDragActive
          ? <p>Drop the receipt here...</p>
          : <p>Drag and drop a receipt image, or click to select</p>
        }
      </div>

      {preview && (
        <div style={{ marginTop: 24 }}>
          <img src={preview} alt="Receipt preview" style={{ maxWidth: '100%' }} />
        </div>
      )}

      {receipt && (
        <ItemTable
          items={receipt.items}
          subtotal={receipt.subtotal}
          tax={receipt.tax}
          total={receipt.total}
          onItemsChange={(items) => setReceipt({ ...receipt, items })}
        />
      )}
    </div>
  )
}

export default App