import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import ItemTable from './ItemTable'
import PeopleManager from './PeopleManager'
import SplitSummary from './SplitSummary'

interface Item {
  name: string
  price: number
  assignedTo: string[]
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
  const [people, setPeople] = useState<string[]>([])

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
    const itemsWithAssignments = data.items.map((item: Omit<Item, 'assignedTo'>) => ({
      ...item,
      assignedTo: []
    }))
    setReceipt({ ...data, items: itemsWithAssignments })
    setUploading(false)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1
  })

  return (
    <div style={{ maxWidth: 700, margin: '60px auto', fontFamily: 'sans-serif' }}>
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

      {receipt && (
        <>
          <PeopleManager
            people={people}
            onPeopleChange={setPeople}
          />
          <ItemTable
            items={receipt.items}
            subtotal={receipt.subtotal}
            tax={receipt.tax}
            total={receipt.total}
            people={people}
            onItemsChange={(items) => setReceipt({ ...receipt, items })}
          />
          <SplitSummary
            items={receipt.items || []}
            tax={receipt.tax || 0}
            total={receipt.total || 0}
            people={people || []}
          />
        </>
      )}
    </div>
  )
}

export default App